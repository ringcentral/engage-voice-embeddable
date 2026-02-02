import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { Button } from '@ringcentral/spring-ui';
import { CallListMd } from '@ringcentral/spring-icon';
import React, { useCallback } from 'react';

import { EvPresence } from '../../services/EvPresence';
import { EvCall } from '../../services/EvCall';
import { EvCallMonitor } from '../../services/EvCallMonitor';
import {
  SelectableListItem,
  EmptyState,
  StatusBadge,
} from '../../components';
import type {
  ActiveCallListViewOptions,
  ActiveCallListViewProps,
} from './ActiveCallListView.interface';
import i18n from './i18n';

/**
 * ActiveCallListView - Display list of active calls
 * Shows all currently active calls for multi-call scenarios
 */
@injectable({
  name: 'ActiveCallListView',
})
class ActiveCallListView extends RcViewModule {
  constructor(
    private _evPresence: EvPresence,
    private _evCall: EvCall,
    private _evCallMonitor: EvCallMonitor,
    private _router: RouterPlugin,
    @optional('ActiveCallListViewOptions')
    private _options?: ActiveCallListViewOptions,
  ) {
    super();
  }

  /**
   * Get contact name from matches or fallback to phone number
   */
  getContactName(call: any): string {
    if (!call) return '';
    const contactMatches = call.contactMatches || [];
    if (contactMatches.length > 0) {
      return contactMatches[0].name || call.ani || call.dnis || '';
    }
    return call.ani || call.dnis || '';
  }

  selectCall(callId: string) {
    this._options?.onCallSelect?.(callId);
    this._router.push('/calls');
  }

  goBack() {
    this._router.goBack();
  }

  component(_props?: ActiveCallListViewProps) {
    const { t } = useLocale(i18n);

    const { callsMapping, calls, currentCall } = useConnector(() => ({
      callsMapping: this._evCallMonitor.callsMapping,
      calls: this._evCallMonitor.calls,
      currentCall: this._evCall.currentCall,
    }));

    const handleSelectCall = useCallback((callId: string) => {
      this.selectCall(callId);
    }, []);

    const handleBack = useCallback(() => {
      this.goBack();
    }, []);

    // Get enriched call data from callsMapping
    const getEnrichedCall = (call: any) => {
      const callId = this._evCallMonitor.getCallId(call.session || {});
      return callsMapping[callId] || call;
    };

    return (
      <div className="flex flex-col h-full bg-neutral-base overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-neutral-b4">
          <h1 className="typography-title mb-1">{t('activeCalls')}</h1>
          <p className="typography-descriptor text-neutral-b2">
            {t('selectCall')}
          </p>
        </div>

        {/* Active Call List */}
        <div className="flex-1 overflow-y-auto">
          {calls.length === 0 ? (
            <EmptyState
              icon={CallListMd}
              title={t('noCalls')}
              data-sign="emptyCallList"
            />
          ) : (
            calls.map((rawCall: any) => {
              const call = getEnrichedCall(rawCall);
              const isCurrentCall = currentCall?.uii === call.uii;
              const isOnHold = call.isHold || call.hold;
              const isInbound = call.callType === 'INBOUND';
              const contactName = this.getContactName(call);
              const phoneNumber = call.ani || call.dnis || '';
              const displayName = contactName || t('unknown');
              const showPhoneNumber = contactName && contactName !== phoneNumber;

              return (
                <SelectableListItem
                  key={call.uii}
                  primary={
                    <div className="flex items-center gap-2">
                      <span className="truncate">{displayName}</span>
                      <StatusBadge
                        status={isOnHold ? 'onHold' : 'active'}
                      />
                    </div>
                  }
                  secondary={
                    <div>
                      {showPhoneNumber && (
                        <div className="text-neutral-b2 truncate">{phoneNumber}</div>
                      )}
                      <div className="text-neutral-b3">
                        {isInbound ? t('inbound') : t('outbound')}
                      </div>
                    </div>
                  }
                  selected={isCurrentCall}
                  onClick={() => handleSelectCall(call.uii)}
                  data-sign={`callItem-${call.uii}`}
                />
              );
            })
          )}
        </div>

        {/* Back Button */}
        <div className="p-4 border-t border-neutral-b4">
          <Button
            variant="outlined"
            color="neutral"
            fullWidth
            onClick={handleBack}
            data-sign="backButton"
          >
            {t('back')}
          </Button>
        </div>
      </div>
    );
  }
}

export { ActiveCallListView };
