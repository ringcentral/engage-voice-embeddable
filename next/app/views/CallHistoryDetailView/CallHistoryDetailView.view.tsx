import type { UIFunctions, UIProps } from '@ringcentral-integration/next-core';
import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
  useParams,
} from '@ringcentral-integration/next-core';
import React, { useRef } from 'react';

import { EvCallHistory } from '../../services/EvCallHistory';
import { EvCallMonitor } from '../../services/EvCallMonitor';
import { CallHistoryDetailPanel } from '../../components/CallHistoryDetailPanel';
import { callDirection } from '../../../enums';
import { formatPhoneNumber } from '../../../lib/FormatPhoneNumber/formatPhoneNumber';

import type {
  CallHistoryDetailViewOptions,
  CallHistoryDetailViewUIProps,
  CallHistoryDetailViewUIFunctions,
} from './CallHistoryDetailView.interface';

/**
 * Build a FormattedCall-like object from raw call data (active or ended)
 */
function buildCallDetailFromRaw(rawCall: any, callId: string): any {
  if (!rawCall) return undefined;
  const isOutbound = rawCall.callType?.toLowerCase() === 'outbound';
  const direction = isOutbound ? callDirection.outbound : callDirection.inbound;
  const contactMatches: any[] = rawCall.contactMatches || [];
  const contactName = contactMatches[0]?.name || '';
  const phone = formatPhoneNumber({ phoneNumber: rawCall.ani || '' });
  const contact = { name: contactName || phone, phoneNumber: phone };
  const agent = { name: rawCall.agentId || '', phoneNumber: rawCall.agentId || '' };
  const from = isOutbound ? agent : contact;
  const to = isOutbound ? contact : agent;
  return {
    id: callId,
    direction,
    agent,
    contact,
    from,
    to,
    fromName: from.name || from.phoneNumber,
    toName: to.name || to.phoneNumber,
    fromMatches: contactMatches,
    toMatches: contactMatches,
    startTime: rawCall.timestamp,
    telephonySessionId: rawCall.session?.uii,
    sessionId: rawCall.session?.sessionId,
  };
}

/**
 * CallHistoryDetailView - Read-only call detail view
 * Displays call details for both active calls and call history
 */
@injectable({
  name: 'CallHistoryDetailView',
})
class CallHistoryDetailView extends RcViewModule {
  private _params: { id?: string } = {};

  constructor(
    private _evCallHistory: EvCallHistory,
    private _evCallMonitor: EvCallMonitor,
    private _router: RouterPlugin,
    @optional('CallHistoryDetailViewOptions')
    private _options?: CallHistoryDetailViewOptions,
  ) {
    super();
  }

  goBack() {
    this._router.goBack();
  }

  /**
   * Returns reactive UI state for the view
   */
  getUIProps(callId?: string): UIProps<CallHistoryDetailViewUIProps> {
    // 1. Try call history (ended calls) first
    const callHistory = this._evCallHistory.formattedCalls;
    let callDetail = callHistory.find(
      (call) =>
        call.id === callId ||
        call.telephonySessionId === callId ||
        call.sessionId === callId,
    );
    // 2. Try raw callsMapping (includes active + ended calls)
    const rawCall = callId
      ? (this._evCallHistory.callsMapping[callId] ??
         this._evCallMonitor.callsMapping[callId])
      : undefined;
    // 3. If not found in formatted history, build from raw data
    if (!callDetail && rawCall && callId) {
      callDetail = buildCallDetailFromRaw(rawCall, callId);
    }
    const isInbound = callDetail?.direction === callDirection.inbound;
    const isActiveCall = !!callId && this._evCallMonitor.callIds.includes(callId);
    // endedCall is typed as boolean in EvBaseCall but at runtime
    // it holds the full EvEndedCall object with termParty/termReason
    const endedCall = (rawCall?.endedCall as unknown) as
      | { termParty?: string; termReason?: string }
      | undefined;
    const callMeta = {
      dnis: rawCall?.dnis,
      queueName: rawCall?.queue?.name,
      callId: rawCall?.uii,
      termParty: endedCall?.termParty,
      termReason: endedCall?.termReason,
    };
    return {
      callDetail,
      callMeta,
      isInbound,
      isActiveCall,
      callNotFound: !callDetail,
    };
  }

  /**
   * Returns stable UI callback functions for the view
   */
  getUIFunctions(): UIFunctions<CallHistoryDetailViewUIFunctions> {
    return {
      onBack: () => this.goBack(),
    };
  }

  component() {
    this._params = useParams<{ id?: string }>();
    const { current: uiFunctions } = useRef(this.getUIFunctions());
    const uiProps = useConnector(() => this.getUIProps(this._params.id));
    return <CallHistoryDetailPanel {...uiProps} {...uiFunctions} />;
  }
}

export { CallHistoryDetailView };
