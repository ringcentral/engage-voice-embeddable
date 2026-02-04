import {
  action,
  injectable,
  optional,
  RcViewModule,
  state,
  storage,
  StoragePlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { DialTextField, Button, IconButton, Link } from '@ringcentral/spring-ui';
import { BackspaceMd } from '@ringcentral/spring-icon';
import React, { useCallback } from 'react';

import { EvCall } from '../../services/EvCall';
import { EvAuth } from '../../services/EvAuth';
import { EvSettings } from '../../services/EvSettings';
import { EvClient } from '../../services/EvClient';
import { Redirect } from '../../services/Redirect';
import type { DialerViewOptions, DialerViewProps } from './DialerView.interface';
import i18n from './i18n';

/**
 * DialerView - Phone dialer view for outbound calls
 * Displays phone number input field and call button
 */
@injectable({
  name: 'DialerView',
})
class DialerView extends RcViewModule {
  constructor(
    private evCall: EvCall,
    private evAuth: EvAuth,
    private evSettings: EvSettings,
    private evClient: EvClient,
    private redirect: Redirect,
    private storagePlugin: StoragePlugin,
    @optional('DialerViewOptions') private dialerViewOptions?: DialerViewOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

  @storage
  @state
  toNumber = '';

  @storage
  @state
  latestDialoutNumber = '';

  /**
   * Check if agent has permission to make manual calls
   */
  get hasDialer(): boolean {
    return !!this.evAuth.agentPermissions?.allowManualCalls;
  }

  /**
   * Check if dialout status is idle
   */
  get isIdle(): boolean {
    return this.evCall.isIdle;
  }

  @action
  setToNumber(value: string): void {
    this.toNumber = value;
  }

  @action
  setLatestDialoutNumber(): void {
    this.latestDialoutNumber = this.toNumber;
  }

  @action
  reset(): void {
    this.toNumber = '';
    this.latestDialoutNumber = '';
  }

  override onInitOnce(): void {
    this.evAuth.beforeAgentLogout(() => {
      this.reset();
    });
  }

  /**
   * Initiate an outbound call with redial support
   */
  async dialout(): Promise<void> {
    if (this.toNumber) {
      this.setLatestDialoutNumber();
    } else if (this.latestDialoutNumber) {
      this.setToNumber(this.latestDialoutNumber);
      return;
    }
    if (this.toNumber) {
      await this.evCall.dialout(this.toNumber);
    }
  }

  /**
   * Cancel the current outbound call
   */
  hangup(): void {
    this.evCall.outdialCancel();
    if (!this.evSettings.isManualOffhook) {
      this.evClient.offhookTerm();
    }
  }

  /**
   * Navigate to manual dial settings page
   */
  goToManualDialSettings(): void {
    this.redirect.push('/settings/manualDial');
  }

  component(_props?: DialerViewProps) {
    const { t } = useLocale(i18n);

    const {
      toNumber,
      hasDialer,
      isDialing,
      isIdle,
    } = useConnector(() => ({
      toNumber: this.toNumber,
      hasDialer: this.hasDialer,
      isDialing: this.evCall.isDialing,
      isIdle: this.isIdle,
    }));

    const handleBackspace = useCallback(() => {
      this.setToNumber(this.toNumber.slice(0, -1));
    }, []);

    const handleDial = useCallback(async () => {
      await this.dialout();
    }, []);

    const handleHangup = useCallback(() => {
      this.hangup();
    }, []);

    const handleInputChange = useCallback(
      (value: string) => {
        this.setToNumber(value);
      },
      [],
    );

    const handleGoToSettings = useCallback(() => {
      this.goToManualDialSettings();
    }, []);

    if (!hasDialer) {
      return null;
    }

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4">
        {/* Main Content - Vertically Centered */}
        <div className="flex-1 flex flex-col justify-center items-center">
          {/* Phone Number Input with Delete Button */}
          <div className="w-full mb-4 [&_input]:text-center flex justify-center">
            <DialTextField
              value={toNumber}
              onChange={handleInputChange}
              placeholder={t('enterNumber')}
              inputProps={{
                'data-sign': 'dialerInput',
              }}
              endAdornment={
                toNumber && (
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

          {/* Call Tips - shown when no number entered */}
          {!toNumber && (
            <div className="text-center">
              <p
                className="typography-descriptor text-neutral-b2"
                data-sign="callButtonTip"
              >
                {t('callButtonTip')}
              </p>
              <p
                className="typography-descriptor text-neutral-b2 mt-2"
                data-sign="callButtonEmergencyTip"
              >
                {t('callButtonEmergencyTip')}
              </p>
            </div>
          )}

          {/* Call Button - shown when number entered */}
          {toNumber && (
            <div className="flex justify-center">
              <Button
                size="large"
                onClick={isIdle ? handleDial : handleHangup}
                disabled={!isIdle && isDialing ? false : !toNumber.trim()}
                data-sign="callButton"
              >
                {t('callButton')}
              </Button>
            </div>
          )}
        </div>

        {/* Manual Dial Settings Link - Fixed at Bottom */}
        <div className="text-center pb-2">
          <Link
            onClick={handleGoToSettings}
            data-sign="manualDialSettings"
            className="typography-descriptor"
          >
            {t('manualDialSettings')}
          </Link>
        </div>
      </div>
    );
  }
}

export { DialerView };
