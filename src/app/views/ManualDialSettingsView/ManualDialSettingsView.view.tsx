import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react';
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
import {
  Autocomplete,
  Select,
  TextField,
  Option,
  Text,
  Button,
} from '@ringcentral/spring-ui';
import type { SuggestionListItemData } from '@ringcentral/spring-ui';

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

type AutocompleteOption = SuggestionListItemData;

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
  };

  setDialoutQueueId = (queueId: string) => {
    this.evCall.setFormGroup({ dialoutQueueId: queueId });
  };

  setDialoutCountryId = (countryId: string) => {
    this.evCall.setFormGroup({ dialoutCountryId: countryId });
  };

  setDialoutRingTime = (ringTime: number) => {
    this.evCall.setFormGroup({ dialoutRingTime: ringTime });
  };

  /**
   * Validate ring time on blur
   */
  validateRingTime = () => {
    this.evCall.checkDialoutRingTime();
  };

  /**
   * Save all form changes and go back
   */
  save = async () => {
    await this.evCall.saveForm();
    this._router.goBack();
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

    // State for autocomplete input values
    const [callerIdInputValue, setCallerIdInputValue] = useState('');
    const [queueInputValue, setQueueInputValue] = useState('');

    // Initialize form on mount
    useEffect(() => {
      this.init();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Transform caller IDs to autocomplete options
    const callerIdOptions = useMemo(
      () =>
        callerIds.map((caller: CallerIdOption) => ({
          id: caller.number,
          label: caller.description || caller.number,
        })),
      [callerIds],
    );

    // Get selected caller ID option
    const selectedCallerId = useMemo(
      () =>
        callerIdOptions.find((opt) => opt.id === dialoutCallerId) ||
        callerIdOptions[0],
      [callerIdOptions, dialoutCallerId],
    );

    // Transform queues to autocomplete options
    const queueOptions = useMemo(
      () =>
        availableQueues.map((queue: QueueOption) => ({
          id: queue.gateId,
          label: queue.gateName,
        })),
      [availableQueues],
    );

    // Get selected queue option
    const selectedQueue = useMemo(
      () =>
        queueOptions.find((opt) => opt.id === dialoutQueueId) || queueOptions[0],
      [queueOptions, dialoutQueueId],
    );

    const handleBackClick = useCallback(() => {
      this.goBack();
    }, []);

    const handleCallerIdChange = useCallback(
      (selectedItems: AutocompleteOption[]) => {
        const selected = selectedItems[0];
        if (selected?.id !== undefined) {
          this.setDialoutCallerId(String(selected.id));
          setCallerIdInputValue('');
        }
      },
      [],
    );

    const handleCallerIdInputChange = useCallback((value: string) => {
      setCallerIdInputValue(value);
    }, []);

    const handleQueueChange = useCallback(
      (selectedItems: AutocompleteOption[]) => {
        const selected = selectedItems[0];
        if (selected?.id !== undefined) {
          this.setDialoutQueueId(String(selected.id));
          setQueueInputValue('');
        }
      },
      [],
    );

    const handleQueueInputChange = useCallback((value: string) => {
      setQueueInputValue(value);
    }, []);

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

    const handleSave = useCallback(() => {
      this.save();
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
            <Autocomplete
              data-sign="callerIdSelect"
              label={t('callerId')}
              options={callerIdOptions}
              value={selectedCallerId ? [selectedCallerId] : []}
              inputValue={callerIdInputValue}
              variant="autocomplete"
              inputVariant="outlined"
              size="large"
              toggleButton
              openOnFocus
              getOptionLabel={(option: AutocompleteOption) => option.label || ''}
              onChange={handleCallerIdChange}
              onInputChange={handleCallerIdInputChange}
            />

            {/* Queue - Only show if allowManualOutboundGates permission */}
            {allowManualOutboundGates && (
              <Autocomplete
                data-sign="queueSelect"
                label={t('queue')}
                options={queueOptions}
                value={selectedQueue ? [selectedQueue] : []}
                inputValue={queueInputValue}
                variant="autocomplete"
                inputVariant="outlined"
                size="large"
                toggleButton
                openOnFocus
                getOptionLabel={(option: AutocompleteOption) => option.label || ''}
                onChange={handleQueueChange}
                onInputChange={handleQueueInputChange}
              />
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

        <div className="px-4 py-4">
          <Button
            data-sign="saveButton"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSave}
          >
            {t('save')}
          </Button>
        </div>
        <AppFooterNav />
      </>
    );
  }
}

export { ManualDialSettingsView };
