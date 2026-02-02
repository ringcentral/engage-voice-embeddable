import {
  action,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
  watch,
} from '@ringcentral-integration/next-core';
import { debounce } from '@ringcentral-integration/commons/lib/debounce-throttle';
import { EventEmitter } from 'events';
import { clone, reduce } from 'ramda';

import {
  agentScriptEvents,
  EV_AGENT_SCRIPT_BROADCAST_KEY,
  EV_AGENT_SCRIPT_PAGE_KEY,
  EV_APP_PAGE_KEY,
} from '../../../enums';
import type {
  EvAgentScriptResult,
  EvAgentScriptResultModel,
  EvBaseCall,
} from '../EvClient/interfaces';
import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import { EvCall } from '../EvCall';
import { EvPresence } from '../EvPresence';
import { TabManager } from '../EvTabManager';
import type {
  EvAgentScriptOptions,
  EvCallScriptResultMapping,
  EvAgentScriptData,
  EvCallDispositionItem,
} from './EvAgentScript.interface';

/**
 * EvAgentScript module - Agent scripting support
 * Handles agent scripts, script results, and broadcast channel communication
 */
@injectable({
  name: 'EvAgentScript',
})
class EvAgentScript extends RcModule {
  protected _eventEmitter = new EventEmitter();
  private _channel: BroadcastChannel | null = null;
  private _hadResponse = false;

  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private evCall: EvCall,
    private evPresence: EvPresence,
    private storagePlugin: StoragePlugin,
    @optional() private tabManager?: TabManager,
    @optional('EvAgentScriptOptions')
    private evAgentScriptOptions?: EvAgentScriptOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

  @storage
  @state
  currentCallScript: EvAgentScriptData | null = null;

  @storage
  @state
  isDisplayAgentScript = true;

  @storage
  @state
  callScriptResultMapping: EvCallScriptResultMapping = {};

  @action
  setIsDisplayAgentScript(state: boolean) {
    this.isDisplayAgentScript = state;
  }

  @action
  setCurrentCallScript(script: EvAgentScriptData | null) {
    this.currentCallScript = script;
  }

  @action
  setCallScriptResult(id: string, data: EvAgentScriptResult) {
    this.callScriptResultMapping[id] = data;
    this._eventEmitter.emit(agentScriptEvents.SET_SCRIPT_RESULT, id, data);
  }

  debouncedSetCallScriptResult = debounce({ fn: this.setCallScriptResult.bind(this) });

  /**
   * Reset script state
   */
  reset(): void {
    this.logger.info('EvAgentScript reset');
  }

  /**
   * Register callback for script result set events
   */
  onSetScriptResult(cb: (id: string, data: EvAgentScriptResult) => void): void {
    this._eventEmitter.on(agentScriptEvents.SET_SCRIPT_RESULT, cb);
  }

  /**
   * Register callback for disposition update events
   */
  onUpdateDisposition(cb: (id: string, data: EvCallDispositionItem) => void): void {
    this._eventEmitter.on(agentScriptEvents.UPDATE_DISPOSITION, cb);
  }

  override onInitOnce(): void {
    this._bindChannel();

    // When script changes, emit the response
    watch(
      this,
      () => this.currentCallScript,
      () => {
        this._responseInitScript();
      },
    );

    // When a call is answered, fetch the script if available
    this.evPresence.onCallAnswered(async (call) => {
      if (this.getIsAgentScript(call)) {
        await this.getScript(call.scriptId, call.scriptVersion, 'CALL', call.uii);
      }
    });

    this.evAuth.beforeAgentLogout(() => {
      this.reset();
    });
  }

  override onInit(): void {
    this.logger.info('EvAgentScript init');
    this.setIsDisplayAgentScript(true);
  }

  /**
   * Check if the call has an agent script
   */
  getIsAgentScript(call: EvBaseCall | undefined): boolean {
    return !!(this.isDisplayAgentScript && call?.scriptId);
  }

  /**
   * Fetch a script by ID and version
   */
  async getScript(
    scriptId: string,
    version: string | null = null,
    type = 'CALL',
    uii: string | null = null,
  ): Promise<EvAgentScriptData> {
    const response = await this.evClient.getScript(scriptId, version);
    const result: EvAgentScriptData = {
      scriptId: response.scriptId,
      data: JSON.parse(response.json),
    };

    switch (type) {
      case 'CALL':
        this.setCurrentCallScript(result);
        break;
      default:
        break;
    }

    return result;
  }

  /**
   * Save the script result for a call
   */
  saveScriptResult(call: any): void {
    const scriptResult =
      this.callScriptResultMapping[
        this.evClient.encodeUii({
          uii: call.uii,
          sessionId: call.session?.sessionId,
        })
      ];

    if (scriptResult) {
      const result = this._formatScriptResult(scriptResult);
      this.evClient.saveScriptResult(call.uii, call.scriptId, result);
    }
  }

  private _bindChannel(): void {
    if (typeof BroadcastChannel === 'undefined') {
      return;
    }

    if (this.tabManager && !sessionStorage.getItem(EV_AGENT_SCRIPT_BROADCAST_KEY)) {
      sessionStorage.setItem(EV_AGENT_SCRIPT_BROADCAST_KEY, this.tabManager.id || '');
    }

    this._channel = new BroadcastChannel(EV_AGENT_SCRIPT_BROADCAST_KEY);

    this._channel.onmessage = ({ data }) => {
      const { key, value } = data;
      const { activityCallId, currentCall } = this.evCall;

      if (this.isDisplayAgentScript && activityCallId && currentCall?.scriptId) {
        switch (key) {
          case agentScriptEvents.INIT:
            this._responseInitScript();
            break;
          case agentScriptEvents.SET_SCRIPT_RESULT:
            this.debouncedSetCallScriptResult(activityCallId, value);
            break;
          case agentScriptEvents.GET_KNOWLEDGE_BASE_ARTICLES:
            this._getKnowledgeBaseGroups(value);
            break;
          case agentScriptEvents.UPDATE_DISPOSITION:
            this._eventEmitter.emit(
              agentScriptEvents.UPDATE_DISPOSITION,
              activityCallId,
              value,
            );
            break;
          default:
            break;
        }
      }
    };

    // If agent script page loads faster than CTI app, emit when app init
    setTimeout(() => {
      if (this.currentCallScript && !this._hadResponse) {
        this._responseInitScript();
      }
    }, 1000);
  }

  private async _getKnowledgeBaseGroups(knowledgeBaseGroupIds: number[]): Promise<void> {
    const value = await this.evClient.getKnowledgeBaseGroups(knowledgeBaseGroupIds);
    this._sendChannel({
      key: agentScriptEvents.GET_KNOWLEDGE_BASE_ARTICLES,
      value,
    });
  }

  private _responseInitScript(): void {
    this._sendChannel({
      key: agentScriptEvents.INIT,
      value: {
        config: this.currentCallScript,
        call: this.evCall.currentCall,
      },
    });
    this._hadResponse = true;
  }

  private _sendChannel(data: { key: string; value: any }): void {
    if (this._channel) {
      this._channel.postMessage(data);
    }
  }

  private _formatScriptResult(scriptResult: EvAgentScriptResult): EvAgentScriptResult {
    const resultCopy = clone(scriptResult);

    resultCopy.model = reduce(
      (output, [key, value]) => {
        let result = value;
        if (result.value !== undefined) {
          result = result.value;
        }

        output[key] = {
          value: result,
          leadField: value.leadField ?? '',
        };
        return output;
      },
      {} as EvAgentScriptResultModel,
      Object.entries<any>(resultCopy.model),
    );

    return resultCopy;
  }
}

export { EvAgentScript };
