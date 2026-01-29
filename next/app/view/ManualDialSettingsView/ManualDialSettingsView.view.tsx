import React from 'react';
import {
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';

import { EvCall } from '../../services/EvCall';
import { EvAuth } from '../../services/EvAuth';
import i18n from './i18n';

/**
 * ManualDialSettingsView options for configuration
 */
export interface ManualDialSettingsViewOptions {
  // Optional configuration options
}

/**
 * ManualDialSettingsView module - Manual dial settings
 * Handles country fallback and dialout settings
 */
@injectable({
  name: 'ManualDialSettingsView',
})
class ManualDialSettingsView extends RcViewModule {
  constructor(
    private evCall: EvCall,
    private evAuth: EvAuth,
    @optional('ManualDialSettingsViewOptions')
    private manualDialSettingsViewOptions?: ManualDialSettingsViewOptions,
  ) {
    super();
  }

  setDialoutCallerId = (callerId: string) => {
    this.evCall.setDialoutCallerId(callerId);
  };

  setDialoutCountryId = (countryId: string) => {
    this.evCall.setDialoutCountryId(countryId);
  };

  setDialoutRingTime = (ringTime: string) => {
    this.evCall.setDialoutRingTime(ringTime);
  };

  component() {
    const { t } = useLocale(i18n);

    const {
      dialoutCallerId,
      dialoutCountryId,
      dialoutRingTime,
      callerIds,
      availableCountries,
    } = useConnector(() => ({
      dialoutCallerId: this.evCall.dialoutCallerId,
      dialoutCountryId: this.evCall.dialoutCountryId,
      dialoutRingTime: this.evCall.dialoutRingTime,
      callerIds: this.evAuth.callerIds,
      availableCountries: this.evAuth.availableCountries,
    }));

    return (
      <div className="flex flex-col h-full bg-neutral-base">
        <div className="p-4 border-b border-neutral-b4">
          <h1 className="typography-title">{t('dialSettings')}</h1>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Caller ID */}
          <div>
            <label className="typography-descriptor text-neutral-b2 block mb-1">
              {t('callerId')}
            </label>
            <select
              value={dialoutCallerId}
              onChange={(e) => this.setDialoutCallerId(e.target.value)}
              className="w-full p-2 border border-neutral-b4 rounded"
            >
              {callerIds.map((caller: any) => (
                <option key={caller.number} value={caller.number}>
                  {caller.description || caller.number}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="typography-descriptor text-neutral-b2 block mb-1">
              {t('country')}
            </label>
            <select
              value={dialoutCountryId}
              onChange={(e) => this.setDialoutCountryId(e.target.value)}
              className="w-full p-2 border border-neutral-b4 rounded"
            >
              {availableCountries.map((country: any) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.countryName || country.countryId}
                </option>
              ))}
            </select>
          </div>

          {/* Ring Time */}
          <div>
            <label className="typography-descriptor text-neutral-b2 block mb-1">
              {t('ringTime')}
            </label>
            <input
              type="number"
              value={dialoutRingTime}
              onChange={(e) => this.setDialoutRingTime(e.target.value)}
              min="10"
              max="60"
              className="w-full p-2 border border-neutral-b4 rounded"
            />
            <p className="typography-descriptor text-neutral-b3 mt-1">
              {t('ringTimeHint')}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export { ManualDialSettingsView };
