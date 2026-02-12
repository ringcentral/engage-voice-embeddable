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
import { CallHistoryDetailPanel } from '../../components/CallHistoryDetailPanel';
import { callDirection } from '../../../enums';

import type {
  CallHistoryDetailViewOptions,
  CallHistoryDetailViewUIProps,
  CallHistoryDetailViewUIFunctions,
} from './CallHistoryDetailView.interface';

/**
 * CallHistoryDetailView - Call history log detail view
 * Displays call details and allows adding notes/disposition
 */
@injectable({
  name: 'CallHistoryDetailView',
})
class CallHistoryDetailView extends RcViewModule {
  private _params: { id?: string } = {};

  constructor(
    private _evCallHistory: EvCallHistory,
    private _router: RouterPlugin,
    @optional('CallHistoryDetailViewOptions')
    private _options?: CallHistoryDetailViewOptions,
  ) {
    super();
  }

  goBack() {
    this._router.goBack();
  }

  async saveCallLog(callId: string, notes: string, dispositionId: string | null) {
    // Save call log implementation would go here
    this._options?.onSave?.();
    this.goBack();
  }

  /**
   * Returns reactive UI state for the view
   */
  getUIProps(callId?: string): UIProps<CallHistoryDetailViewUIProps> {
    const callHistory = this._evCallHistory.formattedCalls;
    const callDetail = callHistory.find(
      (call) =>
        call.id === callId ||
        call.telephonySessionId === callId ||
        call.sessionId === callId,
    );
    const isInbound = callDetail?.direction === callDirection.inbound;
    // Raw call data for extra metadata and dispositions
    const rawCall = callId
      ? this._evCallHistory.callsMapping[callId]
      : undefined;
    const dispositions =
      rawCall?.outdialDispositions?.dispositions ?? [];
    // endedCall is typed as boolean in EvBaseCall but at runtime
    // it holds the full EvEndedCall object with termParty/termReason
    const endedCall = (rawCall?.endedCall as unknown) as
      | { termParty?: string; termReason?: string }
      | undefined;
    const callMeta = {
      dnis: rawCall?.dnis,
      callId: rawCall?.uii,
      termParty: endedCall?.termParty,
      termReason: endedCall?.termReason,
    };
    return {
      callDetail,
      callMeta,
      dispositions,
      isInbound,
      callNotFound: !callDetail,
    };
  }

  /**
   * Returns stable UI callback functions for the view
   */
  getUIFunctions(): UIFunctions<CallHistoryDetailViewUIFunctions> {
    return {
      onSave: (callId: string, notes: string, dispositionId: string | null) =>
        this.saveCallLog(callId, notes, dispositionId),
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
