import {
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback, useState } from 'react';

import type { EvCall } from '../../services/EvCall';
import type { DialerViewOptions, DialerViewProps } from './DialerView.interface';
import i18n from './i18n';

const DIALPAD_KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
];

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
        {/* Phone Number Input */}
        <div className="mb-4">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handleInputChange}
            placeholder={t('enterNumber')}
            className="w-full p-4 text-center typography-display1 border border-neutral-b4 rounded-lg bg-neutral-base"
          />
        </div>

        {/* Dialpad */}
        <div className="flex-1 flex flex-col justify-center">
          {DIALPAD_KEYS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-4 mb-4">
              {row.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeyPress(key)}
                  disabled={isDialing}
                  className="w-16 h-16 rounded-full bg-neutral-b5 hover:bg-neutral-b4 typography-title flex items-center justify-center transition-colors"
                >
                  {key}
                </button>
              ))}
            </div>
          ))}

          {/* Action Row */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleClear}
              disabled={isDialing}
              className="w-16 h-16 rounded-full bg-neutral-b5 hover:bg-neutral-b4 typography-descriptor flex items-center justify-center transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleDial}
              disabled={isDialing || !phoneNumber.trim()}
              className={`w-16 h-16 rounded-full typography-title flex items-center justify-center transition-colors ${
                isDialing || !phoneNumber.trim()
                  ? 'bg-neutral-b4 text-neutral-b2 cursor-not-allowed'
                  : 'bg-success text-neutral-w0 hover:bg-success-f'
              }`}
            >
              {isDialing ? '...' : t('dial')}
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              disabled={isDialing}
              className="w-16 h-16 rounded-full bg-neutral-b5 hover:bg-neutral-b4 typography-descriptor flex items-center justify-center transition-colors"
            >
              ←
            </button>
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
