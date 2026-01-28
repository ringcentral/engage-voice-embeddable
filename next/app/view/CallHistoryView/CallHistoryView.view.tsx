import React from 'react';
import {
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';

import type { EvCallHistory } from '../../services/EvCallHistory';
import type { EvCall } from '../../services/EvCall';
import i18n from './i18n';

/**
 * CallHistoryView options for configuration
 */
export interface CallHistoryViewOptions {
  // Optional configuration options
}

/**
 * CallHistoryView module - Call history display
 * Shows call history list with action menu
 */
@injectable({
  name: 'CallHistoryView',
})
class CallHistoryView extends RcViewModule {
  constructor(
    private evCallHistory: EvCallHistory,
    private evCall: EvCall,
    @optional('CallHistoryViewOptions')
    private callHistoryViewOptions?: CallHistoryViewOptions,
  ) {
    super();
  }

  dialNumber = (phoneNumber: string) => {
    this.evCall.dialout(phoneNumber);
  };

  component() {
    const { t } = useLocale(i18n);

    const { formattedCalls } = useConnector(() => ({
      formattedCalls: this.evCallHistory.formattedCalls,
    }));

    return (
      <div className="flex flex-col h-full bg-neutral-base">
        <div className="p-4 border-b border-neutral-b4">
          <h1 className="typography-title">{t('callHistory')}</h1>
        </div>

        <div className="flex-1 overflow-auto">
          {formattedCalls.length === 0 ? (
            <div className="p-4 text-center text-neutral-b2">
              <p className="typography-mainText">{t('noCallHistory')}</p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-b4">
              {formattedCalls.map((call) => (
                <li
                  key={call.id}
                  className="p-4 hover:bg-neutral-b5 cursor-pointer"
                  onClick={() => this.dialNumber(call.from.phoneNumber)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="typography-subtitle truncate">
                      {call.fromName || call.from.phoneNumber}
                    </span>
                    <span className="typography-descriptor text-neutral-b2">
                      {call.direction === 'inbound' ? t('inbound') : t('outbound')}
                    </span>
                  </div>
                  <div className="typography-descriptor text-neutral-b2">
                    {new Date(call.startTime).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

export { CallHistoryView };
