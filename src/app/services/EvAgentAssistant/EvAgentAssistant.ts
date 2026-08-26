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
import { Auth, Client } from '@ringcentral-integration/micro-auth/src/app/services';
import { Locale } from '@ringcentral-integration/micro-core/src/app/services';

import type { EvBaseCall } from '../EvClient/interfaces';
import { EvAuth } from '../EvAuth';
import { EvCall } from '../EvCall';
import { EvCallMonitor, type EvCallData } from '../EvCallMonitor';
import { EvClient } from '../EvClient';
import { EvPresence } from '../EvPresence';
import { SideWidget, SIDE_WIDGET_IDS } from '../SideWidget';
import { getCallAni, getCallDnis } from '../../../lib/getEvCallNumbers';

import type {
  EvAgentAssistantFrameParams,
  EvAgentAssistantOptions,
} from './EvAgentAssistant.interface';

/** Client app type the assistant understands; anything else degrades its analytics. */
const clientAppType = 'RCX_EMBEDDED_AGENT';
const interactionSource = 'VOICE';
const interopScope = 'Interoperability';
const defaultPageUrl = './agentAssistant.html';

/**
 * The recording mode the assistant needs: it works off the agent leg audio, so
 * a segment that is not recorded that way has nothing for it to listen to.
 */
const allAgentLegsRecording = 'ALL_AGENT_LEGS';

/**
 * Agent Assistant (AI Assistant) side widget lifecycle.
 *
 * The assistant itself is a RingCX single page app loaded by `agentAssistant.html`;
 * this service decides when its tab is on screen and assembles the per call
 * configuration that page needs, including a short lived RingCentral interop
 * code. The whole feature is hidden when the account has not enabled agent
 * assist, when the agent is not a RingCentral user, or when the RingCentral app
 * is not allowed to mint that code.
 *
 * The eligibility rules deliberately mirror the desktop agent app
 * (`agent-service`, `apps/eag/src/app/phone/phone.detail.js`) so that the same
 * call is offered the assistant in both.
 */
@injectable({
  name: 'EvAgentAssistant',
})
class EvAgentAssistant extends RcModule {
  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private evCall: EvCall,
    private evPresence: EvPresence,
    private evCallMonitor: EvCallMonitor,
    private sideWidget: SideWidget,
    private auth: Auth,
    private client: Client,
    private locale: Locale,
    private portManager: PortManager,
    @optional('EvAgentAssistantOptions')
    private evAgentAssistantOptions?: EvAgentAssistantOptions,
  ) {
    super();
    if (this.portManager.shared) {
      this.portManager.onServer(() => this.initialize());
    } else {
      this.initialize();
    }
  }

  /**
   * `null` until the interop endpoint has told us otherwise; `false` disables the
   * feature for the rest of the session so we stop asking for codes we cannot get.
   */
  @state
  interopSupported: boolean | null = null;

  @action
  private _setInteropSupported(supported: boolean) {
    this.interopSupported = supported;
  }

  /**
   * Whether this Engage agent is backed by a RingCentral user, which the
   * assistant requires - it logs in as that user. Read from the SDK's own user
   * details, so it is only readable on the main client and has to be resolved
   * into state to be usable in a synchronous eligibility check.
   *
   * `null` means "not read yet" and keeps the feature hidden, the same way the
   * desktop app holds the tab back until its user details have loaded.
   */
  @state
  isRCAgent: boolean | null = null;

  @action
  private _setIsRCAgent(isRCAgent: boolean | null) {
    this.isRCAgent = isRCAgent;
  }

  private _resolvingIsRCAgent = false;

  /**
   * The assistant needs an interop code minted for its own client id, which
   * requires the `Interoperability` permission on the RingCentral app. The scope
   * is not always present on the token, so an unknown scope is treated as
   * "maybe" and settled by the first `generate-code` response.
   */
  get hasInteropScope(): boolean {
    const scope = this.auth.token?.scope;
    if (!scope) return true;
    return scope.split(' ').includes(interopScope);
  }

  /**
   * Account level `enable_agent_assist` permission, as reported by the agent
   * config on login.
   */
  get hasAgentAssistPermission(): boolean {
    return !!this.evAuth.agentPermissions?.enableAgentAssist;
  }

  get isSupported(): boolean {
    return !!(
      !this.evAgentAssistantOptions?.disabled &&
      this.interopSupported !== false &&
      this.hasInteropScope &&
      this.hasAgentAssistPermission &&
      this.isRCAgent
    );
  }

  get pageUrl(): string {
    return this.evAgentAssistantOptions?.pageUrl || defaultPageUrl;
  }

  /**
   * Whether the AI Assistant side widget should be on screen: the call being
   * worked on is answered and eligible for the assistant.
   */
  get hasVisibleAssistant(): boolean {
    return this.getIsAgentAssistant(
      this.evPresence.callsMapping[this.evCall.activityCallId],
    );
  }

  private initialize(): void {
    this.evAuth.beforeAgentLogout(() => {
      this._setIsRCAgent(null);
      void this.sideWidget.closeWidget(SIDE_WIDGET_IDS.agentAssistant);
    });

    if (this.evAuth.isEvLogged) {
      void this._resolveIsRCAgent();
    }
    watch(
      this,
      () => this.evAuth.isEvLogged,
      (logged) => {
        if (logged) {
          void this._resolveIsRCAgent();
        } else {
          this._setIsRCAgent(null);
        }
      },
    );

    // The SDK writes its user details around login, so a read that came back
    // without an RC user id is retried on the next call rather than turning the
    // feature off for the whole session.
    watch(
      this,
      () => this.evCall.activityCallId,
      (callId) => {
        if (callId && this.isRCAgent !== true && this.evAuth.isEvLogged) {
          void this._resolveIsRCAgent();
        }
      },
    );

    // Same rule as the Agent Script widget: keep the tab a pure function of the
    // call state so answering, ending and logging out are all covered.
    watch(
      this,
      () => this.hasVisibleAssistant,
      (visible) => {
        if (visible) {
          void this.sideWidget.openWidget({
            id: SIDE_WIDGET_IDS.agentAssistant,
            nameKey: 'agentAssistant',
          });
        } else {
          void this.sideWidget.closeWidget(SIDE_WIDGET_IDS.agentAssistant);
        }
      },
    );
  }

  /**
   * Whether the assistant can run on this call.
   *
   * A knowledge base is deliberately *not* required: without one the assistant
   * still runs, just with no knowledge context, which is why `knowledgeBaseId`
   * only feeds `kbContextIds`. What it does need is the agent leg recording it
   * listens to, and - specific to the embeddable - a dialog id, because the
   * frame's auto suggestion handshake keys on it.
   */
  getIsAgentAssistant(call?: EvBaseCall | null): boolean {
    if (!this.isSupported || !call) return false;
    if (this.getPerspectiveRecordingMode(call) !== allAgentLegsRecording) {
      return false;
    }
    return !!this.getDialogId(call);
  }

  getPerspectiveRecordingMode(call?: EvBaseCall | null): string {
    return call?.segmentContext?.agentContext?.perspectiveRecordingMode || '';
  }

  getKnowledgeBaseId(call?: EvBaseCall | null): string {
    return call?.segmentContext?.agentContext?.knowledgeBaseId || '';
  }

  getDialogId(call?: EvBaseCall | null): string {
    return call?.session?.dialogId || call?.segmentContext?.dialog?.dialogId || '';
  }

  getSegmentId(call?: EvBaseCall | null): string {
    return call?.session?.segmentId || call?.segmentContext?.segmentId || '';
  }

  /**
   * Reads the RC user id off the main client and remembers whether there is one.
   * Guarded against overlapping reads because both login and an arriving call
   * can ask for it.
   */
  private async _resolveIsRCAgent(): Promise<void> {
    if (this._resolvingIsRCAgent) return;
    this._resolvingIsRCAgent = true;
    try {
      const identity = await this.evClient.getAgentIdentity();
      this._setIsRCAgent(!!identity?.rcUserId);
    } catch (error) {
      this.logger.warn(
        'Agent Assistant: failed to read the agent identity',
        error,
      );
      this._setIsRCAgent(false);
    } finally {
      this._resolvingIsRCAgent = false;
    }
  }

  private getCall(callId: string): EvCallData | null {
    if (!callId) return null;
    return (
      this.evCallMonitor.callsMapping[callId] ||
      (this.evPresence.callsMapping[callId] as EvCallData) ||
      null
    );
  }

  /**
   * Configuration for one mount of the assistant frame, or `null` when the call
   * or the account cannot support it. The interop code is single use, so this is
   * called per frame mount and nothing here is cached.
   */
  @delegate('server')
  async getFrameParams(
    callId: string,
  ): Promise<EvAgentAssistantFrameParams | null> {
    const call = this.getCall(callId);
    if (!call || !this.getIsAgentAssistant(call)) return null;

    const knowledgeBaseId = this.getKnowledgeBaseId(call);
    const dialogId = this.getDialogId(call);

    const authorized = await this.evAuth.refreshEvToken();
    if (!authorized) {
      this.logger.warn('Agent Assistant skipped: Engage token is expired');
      return null;
    }

    const identity = await this.evClient.getAgentIdentity();
    // Authoritative read of the same value the eligibility check caches.
    if (this.isRCAgent !== !!identity.rcUserId) {
      this._setIsRCAgent(!!identity.rcUserId);
    }
    const platformId =
      identity.platformId || this.evAuth.authenticateResponse?.platformId || '';
    if (!identity.engageAccessToken || !platformId) {
      this.logger.warn(
        'Agent Assistant skipped: missing Engage token or platform id',
      );
      return null;
    }

    const authCode = await this._generateAuthCode();
    if (!authCode) return null;

    const agentSettings = this.evAuth.agentSettings;
    const queue = call.queue;
    const isCampaign = !!queue?.isCampaign;
    const agentName = [agentSettings?.firstName, agentSettings?.lastName]
      .filter(Boolean)
      .join(' ');

    return {
      pageUrl: this.pageUrl,
      dialogId,
      kbContextIds: knowledgeBaseId.split('|').filter(Boolean),
      query: {
        authCode,
        env: platformId,
        // The assistant reads the locale as `local`, not `locale`.
        local: this.locale.currentLocale,
        // Sent pre-encoded: the assistant runs `decodeURIComponent` on this one.
        agent_name: encodeURIComponent(agentName),
        customer_name: this._getCustomerName(call),
        customer_number: this._getCustomerNumber(call),
        rcx_jwt: identity.engageAccessToken,
        rcx_user_id: this.evAuth.agentId,
        rcx_subaccount_id: `${agentSettings?.accountId ?? ''}`,
        extension_id: identity.rcUserId,
        main_account_id: identity.mainAccountId,
        rcx_client_app_type: clientAppType,
        dialog_id: dialogId,
        segment_id: this.getSegmentId(call),
        kb_context_id: knowledgeBaseId,
        queue_id: isCampaign ? '' : queue?.number || '',
        campaign_id: isCampaign ? queue?.number || '' : '',
        interaction_source: interactionSource,
      },
    };
  }

  private _getCustomerName(call: EvCallData): string {
    return call.contactMatches?.[0]?.name || '';
  }

  private _getCustomerNumber(call: EvCallData): string {
    const identityNumber = call.segmentContext?.customerIdentity?.aniE164;
    if (identityNumber) return identityNumber;
    return call.callType === 'INBOUND' ? getCallAni(call) : getCallDnis(call);
  }

  /**
   * Mints the RingCentral interop code the assistant logs in with.
   *
   * Deliberately not `platform.post`: failures there reach `Auth`'s global
   * request-error listener, which turns several 403 codes into an "Access
   * denied" toast and a few of them into a logout. An optional side widget must
   * not be able to do either, so the request is made against the platform URL
   * and token directly.
   */
  private async _generateAuthCode(): Promise<string | null> {
    const clientId = this.evAgentAssistantOptions?.clientId;
    if (!clientId) {
      this.logger.warn('Agent Assistant skipped: no client id configured');
      return null;
    }
    if (!this.auth.loggedIn) return null;
    try {
      const platform = this.client.service.platform();
      await platform.ensureLoggedIn();
      const { access_token: accessToken, token_type: tokenType } =
        await platform.auth().data();
      const response = await fetch(
        platform.createUrl('/restapi/v1.0/interop/generate-code', {
          addServer: true,
        }),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${tokenType || 'Bearer'} ${accessToken}`,
          },
          body: JSON.stringify({ clientId }),
        },
      );
      if (!response.ok) {
        await this._handleAuthCodeError(response);
        return null;
      }
      const { code } = await response.json();
      if (code && this.interopSupported !== true) {
        this._setInteropSupported(true);
      }
      return code || null;
    } catch (error) {
      this.logger.error('Failed to generate Agent Assistant auth code', error);
      return null;
    }
  }

  /**
   * Logs what RingCentral actually said - the error code is the only way to tell
   * a missing permission apart from a client id / scope mismatch. Only a genuine
   * permission failure turns the feature off; anything else may be transient.
   */
  private async _handleAuthCodeError(response: Response): Promise<void> {
    let body: any = null;
    try {
      body = await response.clone().json();
    } catch (error) {
      body = null;
    }
    const errorCode = body?.errors?.[0]?.errorCode ?? body?.error ?? '';
    const message =
      body?.errors?.[0]?.message ?? body?.error_description ?? body?.message ?? '';
    this.logger.error(
      `Agent Assistant auth code request failed: ${response.status} ${errorCode} ${message}`,
    );

    if (this._isPermissionError(response.status, errorCode, message)) {
      this.logger.warn(
        'Agent Assistant disabled: the RingCentral app has no Interoperability permission',
      );
      this._setInteropSupported(false);
      await this.sideWidget.closeWidget(SIDE_WIDGET_IDS.agentAssistant);
    }
  }

  private _isPermissionError(
    status: number,
    errorCode: string,
    message: string,
  ): boolean {
    if (status !== 403) return false;
    // `CMN-408` is the generic "application needs [X] permission" response.
    return errorCode === 'CMN-408' || message.includes(interopScope);
  }
}

export { EvAgentAssistant };
