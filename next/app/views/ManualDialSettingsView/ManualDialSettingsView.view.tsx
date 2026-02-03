import React, { useCallback, useEffect, type ChangeEvent } from 'react';
import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { AppFooterNav, AppHeaderNav } from '@ringcentral-integration/micro-core/src/app/components';
import { PageHeader } from '@ringcentral-integration/next-widgets/components';
import { Select, TextField, Option, Text } from '@ringcentral/spring-ui';

import { EvCall } from '../../services/EvCall';
import { EvAuth } from '../../services/EvAuth';
import i18n from './i18n';

interface CallerIdOption {
  number: string;
  description?: string;
}

interface QueueOption {
  gateId: string;
  gateName: string;
}

interface CountryOption {
  countryId: string;
  countryName: string;
}

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
    private _router: RouterPlugin,
    @optional('ManualDialSettingsViewOptions')
    private manualDialSettingsViewOptions?: ManualDialSettingsViewOptions,
  ) {
    super();
  }

  goBack() {
    this._router.goBack();
  }

  /**
   * Initialize form on mount - reset to current saved values
   */
  init() {
    this.evCall.resetForm();
  }

  setDialoutCallerId = (callerId: string) => {
    this.evCall.setFormGroup({ dialoutCallerId: callerId });
    this.evCall.saveForm();
  };

  setDialoutQueueId = (queueId: string) => {
    this.evCall.setFormGroup({ dialoutQueueId: queueId });
    this.evCall.saveForm();
  };

  setDialoutCountryId = (countryId: string) => {
    this.evCall.setFormGroup({ dialoutCountryId: countryId });
    this.evCall.saveForm();
  };

  setDialoutRingTime = (ringTime: number) => {
    this.evCall.setFormGroup({ dialoutRingTime: ringTime });
  };

  /**
   * Validate ring time on blur
   */
  validateRingTime = () => {
    this.evCall.checkDialoutRingTime();
    this.evCall.saveForm();
  };

  /**
   * Get caller ID display value (description) by number
   */
  getCallerIdDisplay(callerId: string, callerIds: CallerIdOption[]): string {
    const found = callerIds.find((c) => c.number === callerId);
    return found?.description || callerId;
  }

  /**
   * Get queue display value (gateName) by gateId
   */
  getQueueDisplay(queueId: string, queues: QueueOption[]): string {
    const found = queues.find((q) => q.gateId === queueId);
    return found?.gateName || queueId;
  }

  /**
   * Get country display value (countryName (countryId)) by countryId
   */
  getCountryDisplay(countryId: string, countries: CountryOption[]): string {
    const found = countries.find((c) => c.countryId === countryId);
    return found ? `${found.countryName} (${found.countryId})` : countryId;
  }

  component() {
    const { t } = useLocale(i18n);

    const {
      dialoutCallerId,
      dialoutQueueId,
      dialoutCountryId,
      dialoutRingTime,
      callerIds,
      availableQueues,
      availableCountries,
      allowManualOutboundGates,
      allowManualIntlCalls,
      ringTimeLimit,
    } = useConnector(() => ({
      dialoutCallerId: this.evCall.formGroup.dialoutCallerId,
      dialoutQueueId: this.evCall.formGroup.dialoutQueueId,
      dialoutCountryId: this.evCall.formGroup.dialoutCountryId,
      dialoutRingTime: this.evCall.formGroup.dialoutRingTime,
      callerIds: this.evAuth.callerIds,
      availableQueues: this.evAuth.availableQueues,
      availableCountries: this.evAuth.availableCountries,
      allowManualOutboundGates:
        this.evAuth.agentPermissions?.allowManualOutboundGates ?? false,
      allowManualIntlCalls:
        this.evAuth.agentPermissions?.allowManualIntlCalls ?? false,
      ringTimeLimit: this.evCall.ringTimeLimit,
    }));

    // Initialize form on mount
    useEffect(() => {
      this.init();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleBackClick = useCallback(() => {
      this.goBack();
    }, []);

    const handleCallerIdChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        this.setDialoutCallerId(e.target.value);
      },
      [],
    );

    const handleQueueChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        this.setDialoutQueueId(e.target.value);
      },
      [],
    );

    const handleCountryChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        this.setDialoutCountryId(e.target.value);
      },
      [],
    );

    const handleRingTimeChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!Number.isNaN(value)) {
          this.setDialoutRingTime(value);
        }
      },
      [],
    );

    const handleRingTimeBlur = useCallback(() => {
      this.validateRingTime();
    }, []);

    return (
      <>
        <AppHeaderNav override>
          <PageHeader onBackClick={handleBackClick}>
            {t('dialSettings')}
          </PageHeader>
        </AppHeaderNav>

        <div className="flex flex-col flex-1 bg-neutral-base overflow-y-auto overflow-x-hidden">
          <div className="flex-1 p-4 space-y-4">
            {/* Caller ID */}
            <Select
              data-sign="callerIdSelect"
              label={t('callerId')}
              value={dialoutCallerId}
              onChange={handleCallerIdChange}
              renderValue={(value) =>
                this.getCallerIdDisplay(String(value), callerIds)
              }
              variant="outlined"
              size="large"
            >
              {callerIds.map((caller: CallerIdOption) => (
                <Option key={caller.number} value={caller.number}>
                  {caller.description || caller.number}
                </Option>
              ))}
            </Select>

            {/* Queue - Only show if allowManualOutboundGates permission */}
            {allowManualOutboundGates && (
              <Select
                data-sign="queueSelect"
                label={t('queue')}
                value={dialoutQueueId}
                onChange={handleQueueChange}
                renderValue={(value) =>
                  this.getQueueDisplay(String(value), availableQueues)
                }
                variant="outlined"
                size="large"
              >
                {availableQueues.map((queue: QueueOption) => (
                  <Option key={queue.gateId} value={queue.gateId}>
                    {queue.gateName}
                  </Option>
                ))}
              </Select>
            )}

            {/* Country - Only show if allowManualIntlCalls permission */}
            {allowManualIntlCalls && (
              <Select
                data-sign="countrySelect"
                label={t('country')}
                value={dialoutCountryId}
                onChange={handleCountryChange}
                renderValue={(value) =>
                  this.getCountryDisplay(String(value), availableCountries)
                }
                variant="outlined"
                size="large"
              >
                {availableCountries.map((country: CountryOption) => (
                  <Option key={country.countryId} value={country.countryId}>
                    {`${country.countryName} (${country.countryId})`}
                  </Option>
                ))}
              </Select>
            )}

            {/* Ring Time */}
            <TextField
              data-sign="ringTimeInput"
              label={t('ringTime')}
              type="number"
              value={String(dialoutRingTime)}
              onChange={handleRingTimeChange}
              onBlur={handleRingTimeBlur}
              inputProps={{ min: ringTimeLimit.min, max: ringTimeLimit.max }}
              helperText={t('ringTimeHint')}
              variant="outlined"
              size="large"
              clearBtn={false}
              fullWidth
              endAdornment={
                <Text className="typography-mainText text-neutral-b2 pr-2">
                  {t('seconds')}
                </Text>
              }
            />
          </div>
        </div>
        <AppFooterNav />
      </>
    );
  }
}

export { ManualDialSettingsView };
