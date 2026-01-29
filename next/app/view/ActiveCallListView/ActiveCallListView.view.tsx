import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback } from 'react';

import { EvPresence } from '../../services/EvPresence';
import { EvCall } from '../../services/EvCall';
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
    private _router: RouterPlugin,
    @optional('ActiveCallListViewOptions')
    private _options?: ActiveCallListViewOptions,
  ) {
    super();
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

    const { callLogs, currentCall } = useConnector(() => ({
      callLogs: this._evPresence.callLogs,
      currentCall: this._evCall.currentCall,
    }));

    const handleSelectCall = useCallback((callId: string) => {
      this.selectCall(callId);
    }, []);

    const handleBack = useCallback(() => {
      this.goBack();
    }, []);

    const activeCalls = callLogs.filter((call: any) => call.isActive);

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-hidden">
        <h1 className="typography-title mb-2">{t('activeCalls')}</h1>
        <p className="typography-descriptor text-neutral-b2 mb-6">
          {t('selectCall')}
        </p>

        {/* Active Call List */}
        <div className="flex-1 overflow-y-auto mb-4">
          {activeCalls.length === 0 ? (
            <div className="text-center text-neutral-b2 py-8">
              {t('noCalls')}
            </div>
          ) : (
            activeCalls.map((call: any) => {
              const isCurrentCall = currentCall?.uii === call.uii;
              const isOnHold = call.isHold;
              const isInbound = call.callType === 'INBOUND';

              return (
                <button
                  key={call.uii}
                  type="button"
                  onClick={() => handleSelectCall(call.uii)}
                  className={`w-full p-4 mb-2 border rounded-lg text-left transition-colors ${
                    isCurrentCall
                      ? 'border-primary-b bg-primary-t10'
                      : 'border-neutral-b4 bg-neutral-base hover:bg-neutral-b5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="typography-subtitle truncate">
                      {call.ani || call.dnis || 'Unknown'}
                    </span>
                    <span
                      className={`typography-descriptorMini px-2 py-1 rounded ${
                        isOnHold
                          ? 'bg-warning-t20 text-warning'
                          : 'bg-success-t20 text-success'
                      }`}
                    >
                      {isOnHold ? t('onHold') : t('active')}
                    </span>
                  </div>
                  <div className="typography-descriptor text-neutral-b2">
                    {isInbound ? t('inbound') : t('outbound')}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="w-full py-3 border border-neutral-b4 text-neutral-b1 rounded-lg typography-subtitle hover:bg-neutral-b5 transition-colors"
        >
          {t('back')}
        </button>
      </div>
    );
  }
}

export { ActiveCallListView };
