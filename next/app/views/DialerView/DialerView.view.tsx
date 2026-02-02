import {
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { DialPad, DialTextField, CallButton, IconButton } from '@ringcentral/spring-ui';
import { BackspaceMd } from '@ringcentral/spring-icon';
import React, { useCallback, useState } from 'react';

import { EvCall } from '../../services/EvCall';
import type { DialerViewOptions, DialerViewProps } from './DialerView.interface';
import i18n from './i18n';

/**
 * DialerView - Phone dialer view for outbound calls
 * Displays dialpad and outbound call settings
 */
@injectable({
  name: 'DialerView',
})
class DialerView extends RcViewModule {
  constructor(
    private evCall: EvCall,
    @optional('DialerViewOptions') private dialerViewOptions?: DialerViewOptions,
  ) {
    super();
  }

  async dialout(phoneNumber: string) {
    await this.evCall.dialout(phoneNumber);
  }

  cancelCall(uii: string) {
    this.evCall.outdialCancel(uii);
  }

  component(_props?: DialerViewProps) {
    const { t } = useLocale(i18n);
    const [phoneNumber, setPhoneNumber] = useState('');

    const { isDialing, callerIds, availableQueues, availableCountries, formGroup } =
      useConnector(() => ({
        isDialing: this.evCall.isDialing,
        callerIds: this.evCall.callerIds,
        availableQueues: this.evCall.availableQueues,
        availableCountries: this.evCall.availableCountries,
        formGroup: this.evCall.formGroup,
      }));

    const handleKeyPress = useCallback((key: string) => {
      setPhoneNumber((prev) => prev + key);
    }, []);

    const handleBackspace = useCallback(() => {
      setPhoneNumber((prev) => prev.slice(0, -1));
    }, []);

    const handleClear = useCallback(() => {
      setPhoneNumber('');
    }, []);

    const handleDial = useCallback(async () => {
      if (phoneNumber.trim()) {
        await this.dialout(phoneNumber);
      }
    }, [phoneNumber]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
      },
      [],
    );

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4">
        {/* Phone Number Input with Delete Button */}
        <div className="mb-4">
          <DialTextField
            value={phoneNumber}
            onChange={handleInputChange}
            placeholder={t('enterNumber')}
            inputProps={{
              'data-sign': 'dialerInput',
            }}
            endAdornment={
              phoneNumber && (
                <IconButton
                  symbol={BackspaceMd}
                  size="small"
                  variant="icon"
                  onClick={handleBackspace}
                  disabled={isDialing}
                  data-sign="backspaceButton"
                />
              )
            }
          />
        </div>

        {/* Dialpad - Using Spring UI DialPad */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <DialPad
            onPress={handleKeyPress}
            disabled={isDialing}
            data-sign="dialPad"
          />

          {/* Action Row */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <IconButton
              symbol={BackspaceMd}
              size="large"
              variant="outlined"
              onClick={handleClear}
              disabled={isDialing || !phoneNumber}
              data-sign="clearButton"
            />
            <CallButton
              variant="start"
              size="large"
              onClick={handleDial}
              disabled={isDialing || !phoneNumber.trim()}
              data-sign="dialButton"
            />
          </div>
        </div>

        {/* Settings Summary */}
        <div className="mt-4 p-3 bg-neutral-b5 rounded-lg">
          <div className="flex justify-between typography-descriptor text-neutral-b2">
            <span>{t('callerId')}:</span>
            <span className="truncate ml-2">
              {formGroup.dialoutCallerId === '-1'
                ? 'Default'
                : formGroup.dialoutCallerId}
            </span>
          </div>
          <div className="flex justify-between typography-descriptor text-neutral-b2 mt-1">
            <span>{t('country')}:</span>
            <span>{formGroup.dialoutCountryId}</span>
          </div>
        </div>
      </div>
    );
  }
}

export { DialerView };
