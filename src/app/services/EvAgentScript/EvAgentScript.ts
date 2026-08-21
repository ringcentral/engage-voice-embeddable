import {
  action,
  delegate,
  injectable,
  optional,
  PortManager,
  RcModule,
  state,
  watch,
} from '@ringcentral-integration/next-core';
import type {
  EvAgentScriptResult,
  EvBaseCall,
} from '../EvClient/interfaces';
import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import { EvCall } from '../EvCall';
import { EvCallDisposition } from '../EvCallDisposition';
import { EvPresence } from '../EvPresence';
import { SideWidget, SIDE_WIDGET_IDS } from '../SideWidget';
import type {
  EvAgentScriptData,
  EvAgentScriptOptions,
  EvCallDispositionItem,
  EvCallScriptErrorMapping,
  EvCallScriptLoadingMapping,
  EvCallScriptMapping,
  EvCallScriptResultMapping,
} from './EvAgentScript.interface';
import { formatAgentScriptResult } from './formatAgentScriptResult';

/**
 * Server-authoritative Agent Script lifecycle.
 *
 * UI clients consume the shared script state and invoke the delegated commands.
 * Browser-only Engage SDK calls are delegated by EvClient to the main client.
 */
@injectable({
  name: 'EvAgentScript',
})
class EvAgentScript extends RcModule {
  private _callScriptResultMapping: EvCallScriptResultMapping = {};

  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private evCall: EvCall,
    private evPresence: EvPresence,
    private evCallDisposition: EvCallDisposition,
    private sideWidget: SideWidget,
    private portManager: PortManager,
    @optional('EvAgentScriptOptions')
    private evAgentScriptOptions?: EvAgentScriptOptions,
  ) {
    super();
    if (this.portManager.shared) {
      this.portManager.onServer(() => this.initialize());
    } else {
      this.initialize();
    }
  }

  @state
  callScriptMapping: EvCallScriptMapping = {};

  @state
  callScriptLoadingMapping: EvCallScriptLoadingMapping = {};

  @state
  callScriptErrorMapping: EvCallScriptErrorMapping = {};

  @state
  isDisplayAgentScript = true;

  get currentCallScript(): EvAgentScriptData | null {
    return this.getScriptForCall(this.evCall.activityCallId);
  }

  /**
   * Whether the Agent Script side widget should be on screen: there is a script,
   * a load in flight, or a load error for the call being worked on.
   */
  get hasVisibleScript(): boolean {
    if (!this.evAgentScriptOptions?.enabled) return false;
    const callId = this.evCall.activityCallId;
    if (!callId) return false;
    return !!(
      this.callScriptMapping[callId] ||
      this.callScriptLoadingMapping[callId] ||
      this.callScriptErrorMapping[callId]
    );
  }

  @action
  private _setIsDisplayAgentScript(value: boolean) {
    this.isDisplayAgentScript = value;
  }

  @delegate('server')
  async setIsDisplayAgentScript(value: boolean): Promise<void> {
    this._setIsDisplayAgentScript(value);
  }

  @action
  private _setCallScript(callId: string, script: EvAgentScriptData) {
    this.callScriptMapping[callId] = script;
    this.callScriptLoadingMapping[callId] = false;
    this.callScriptErrorMapping[callId] = null;
  }

  @action
  private _setCallScriptLoading(callId: string, loading: boolean) {
    this.callScriptLoadingMapping[callId] = loading;
    if (loading) {
      this.callScriptErrorMapping[callId] = null;
    }
  }

  @action
  private _setCallScriptError(callId: string, error: string) {
    this.callScriptLoadingMapping[callId] = false;
    this.callScriptErrorMapping[callId] = error;
  }

  @action
  private _removeCallScript(callId: string) {
    delete this.callScriptMapping[callId];
    delete this.callScriptLoadingMapping[callId];
    delete this.callScriptErrorMapping[callId];
  }

  @action
  private _clearCallScripts() {
    this.callScriptMapping = {};
    this.callScriptLoadingMapping = {};
    this.callScriptErrorMapping = {};
  }

  private initialize(): void {
    this.evPresence.onCallAnswered((call) => {
      if (!this.getIsAgentScript(call)) return;
      const callId = this.getCallId(call);
      if (!callId) return;
      void this.loadScript(callId, call!.scriptId, call!.scriptVersion);
    });

    this.evAuth.beforeAgentLogout(() => {
      this._callScriptResultMapping = {};
      this._clearCallScripts();
    });

    // Keep the side widget a pure function of the script state, so load, error,
    // disposition-save and logout teardown are all covered by one rule.
    watch(
      this,
      () => this.hasVisibleScript,
      (visible) => {
        if (visible) {
          void this.sideWidget.openWidget({
            id: SIDE_WIDGET_IDS.agentScript,
            nameKey: 'agentScript',
          });
        } else {
          void this.sideWidget.closeWidget(SIDE_WIDGET_IDS.agentScript);
        }
      },
    );
  }

  getCallId(call?: EvBaseCall | null): string {
    if (!call?.uii || !call.session?.sessionId) return '';
    return this.evClient.encodeUii({
      uii: call.uii,
      sessionId: call.session.sessionId,
    });
  }

  getIsAgentScript(call?: EvBaseCall | null): boolean {
    return !!(
      this.evAgentScriptOptions?.enabled &&
      this.isDisplayAgentScript &&
      call?.scriptId
    );
  }

  getScriptForCall(callId: string): EvAgentScriptData | null {
    return this.callScriptMapping[callId] ?? null;
  }

  getScriptLoading(callId: string): boolean {
    return this.callScriptLoadingMapping[callId] ?? false;
  }

  getScriptError(callId: string): string | null {
    return this.callScriptErrorMapping[callId] ?? null;
  }

  @delegate('server')
  async loadScript(
    callId: string,
    scriptId: string,
    version: string | null = null,
  ): Promise<EvAgentScriptData | null> {
    if (!callId || !scriptId) return null;
    if (this.callScriptMapping[callId]?.scriptId === scriptId) {
      return this.callScriptMapping[callId];
    }

    this._setCallScriptLoading(callId, true);
    try {
      const response = await this.evClient.getScript(scriptId, version);
      const result: EvAgentScriptData = {
        scriptId: response.scriptId,
        groupId: '',
        accountId: '',
        name: response.scriptName ?? '',
        description: '',
        created: '',
        updated: '',
        isActive: true,
        data: JSON.parse(response.json),
      };
      this._setCallScript(callId, result);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load Agent Script';
      this._setCallScriptError(callId, message);
      this.logger.error('Failed to load Agent Script', error);
      return null;
    }
  }

  @delegate('server')
  async updateScriptResult(
    callId: string,
    data: EvAgentScriptResult,
  ): Promise<void> {
    if (!callId || !this.callScriptMapping[callId]) return;
    this._callScriptResultMapping[callId] = data;
  }

  @delegate('server')
  async updateDisposition(
    callId: string,
    data: EvCallDispositionItem,
  ): Promise<void> {
    if (!callId) return;
    const current = this.evCallDisposition.getDisposition(callId);
    this.evCallDisposition.setDisposition(callId, {
      dispositionId: data.dispositionId,
      notes: data.notes ?? current?.notes ?? '',
      summary: current?.summary ?? '',
    });
  }

  @delegate('server')
  async getKnowledgeBaseArticles(
    callId: string,
    knowledgeBaseGroupIds: number[],
  ): Promise<unknown> {
    if (!callId || !this.callScriptMapping[callId]) return null;
    const authorized = await this.evAuth.refreshEvToken();
    if (!authorized) throw new Error('Unable to refresh Engage access token');
    return this.evClient.getKnowledgeBaseGroups(knowledgeBaseGroupIds);
  }

  @delegate('server')
  async saveScriptResult(call: EvBaseCall): Promise<void> {
    const callId = this.getCallId(call);
    const scriptResult = this._callScriptResultMapping[callId];
    if (!callId) return;
    if (!scriptResult || !call.scriptId) {
      this._removeCallScript(callId);
      return;
    }

    const result = formatAgentScriptResult(scriptResult);
    await this.evClient.saveScriptResult(call.uii, call.scriptId, result);
    delete this._callScriptResultMapping[callId];
    this._removeCallScript(callId);
  }

  formatScriptResult(scriptResult: EvAgentScriptResult): EvAgentScriptResult {
    return formatAgentScriptResult(scriptResult);
  }
}

export { EvAgentScript };
