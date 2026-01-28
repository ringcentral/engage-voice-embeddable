import React, { useState } from 'react';
import {
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';

import type { EvPresence } from '../../services/EvPresence';
import type { EvCall } from '../../services/EvCall';
import type { EvCallDisposition } from '../../services/EvCallDisposition';
import type { EvWorkingState } from '../../services/EvWorkingState';
import type { EvIntegratedSoftphone } from '../../services/EvIntegratedSoftphone';
import i18n from './i18n';

/**
 * ActivityCallView options for configuration
 */
export interface ActivityCallViewOptions {
  // Optional configuration options
}

/**
 * ActivityCallView module - Call activity log and keypad
 * Displays current call information, call log form, and keypad
 */
@injectable({
  name: 'ActivityCallView',
})
class ActivityCallView extends RcViewModule {
  constructor(
    private evPresence: EvPresence,
    private evCall: EvCall,
    private evCallDisposition: EvCallDisposition,
    private evWorkingState: EvWorkingState,
    private evIntegratedSoftphone: EvIntegratedSoftphone,
    @optional('ActivityCallViewOptions')
    private activityCallViewOptions?: ActivityCallViewOptions,
  ) {
    super();
  }

  get currentCall() {
    const calls = this.evPresence.calls;
    return calls.length > 0 ? calls[0] : null;
  }

  hangUp = () => {
    this.evIntegratedSoftphone.sipHangUp();
  };

  hold = () => {
    // Hold call logic
  };

  mute = () => {
    this.evIntegratedSoftphone.sipToggleMute();
  };

  sendDTMF = (digit: string) => {
    this.evIntegratedSoftphone.sipSendDTMF(digit);
  };

  component() {
    const { t } = useLocale(i18n);
    const [isKeypadOpen, setIsKeypadOpen] = useState(false);
    const [keypadValue, setKeypadValue] = useState('');

    const { currentCall, isMuted } = useConnector(() => ({
      currentCall: this.evPresence.calls[0] || null,
      isMuted: this.evIntegratedSoftphone.muteActive,
    }));

    const handleKeypadClick = (digit: string) => {
      setKeypadValue((prev) => prev + digit);
      this.sendDTMF(digit);
    };

    if (!currentCall) {
      return (
        <div className="p-4 text-center text-neutral-b2">
          <p className="typography-mainText">{t('noActiveCall')}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-neutral-base">
        {/* Call Info Header */}
        <div className="p-4 border-b border-neutral-b4">
          <div className="typography-subtitle mb-2">{t('activeCall')}</div>
          <div className="typography-mainText text-neutral-b2">
            {currentCall.ani || t('unknown')}
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex justify-center gap-4 p-4 border-b border-neutral-b4">
          <button
            onClick={this.mute}
            className={`p-3 rounded-full ${
              isMuted ? 'bg-danger text-neutral-w0' : 'bg-neutral-b5 text-neutral-b1'
            }`}
          >
            {isMuted ? t('unmute') : t('mute')}
          </button>
          <button
            onClick={this.hold}
            className="p-3 rounded-full bg-neutral-b5 text-neutral-b1"
          >
            {t('hold')}
          </button>
          <button
            onClick={() => setIsKeypadOpen(!isKeypadOpen)}
            className="p-3 rounded-full bg-neutral-b5 text-neutral-b1"
          >
            {t('keypad')}
          </button>
          <button
            onClick={this.hangUp}
            className="p-3 rounded-full bg-danger text-neutral-w0"
          >
            {t('hangUp')}
          </button>
        </div>

        {/* Keypad */}
        {isKeypadOpen && (
          <div className="p-4 border-b border-neutral-b4">
            <input
              type="text"
              value={keypadValue}
              readOnly
              className="w-full p-2 mb-2 text-center typography-title bg-neutral-b5 rounded"
            />
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(
                (digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeypadClick(digit)}
                    className="p-3 typography-subtitle bg-neutral-b5 rounded hover:bg-neutral-b4"
                  >
                    {digit}
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {/* Call Log Form */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="typography-subtitle mb-4">{t('callLog')}</div>
          <div className="space-y-4">
            <div>
              <label className="typography-descriptor text-neutral-b2 block mb-1">
                {t('disposition')}
              </label>
              <select className="w-full p-2 border border-neutral-b4 rounded">
                <option value="">{t('selectDisposition')}</option>
              </select>
            </div>
            <div>
              <label className="typography-descriptor text-neutral-b2 block mb-1">
                {t('notes')}
              </label>
              <textarea
                className="w-full p-2 border border-neutral-b4 rounded h-24 resize-none"
                placeholder={t('enterNotes')}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { ActivityCallView };
