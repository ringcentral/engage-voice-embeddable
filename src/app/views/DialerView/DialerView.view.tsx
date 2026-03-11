import {
  action,
  injectable,
  optional,
  RcViewModule,
  state,
  storage,
  StoragePlugin,
  useConnector,
  delegate,
  PortManager,
  RouterPlugin,
} from '@ringcentral-integration/next-core';
import type { UIFunctions, UIProps } from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { DialTextField, Button, IconButton, Link } from '@ringcentral/spring-ui';
import { BackspaceMd } from '@ringcentral/spring-icon';
import React, { useRef } from 'react';

import { EvCall } from '../../services/EvCall';
import { EvAuth } from '../../services/EvAuth';
import { EvSettings } from '../../services/EvSettings';
import { EvClient } from '../../services/EvClient';
import { EvCallMonitor } from '../../services/EvCallMonitor';
import { EvWorkingState } from '../../services/EvWorkingState';
import type {
  DialerViewOptions,
  DialerViewProps,
  DialerViewUIProps,
  DialerViewUIFunctions,
} from './DialerView.interface';
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
    private evCallMonitor: EvCallMonitor,
    private evWorkingState: EvWorkingState,
    private router: RouterPlugin,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional('DialerViewOptions') private dialerViewOptions?: DialerViewOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    if (this.portManager?.shared) {
      this.portManager.onServer(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
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
  _setToNumber(value: string): void {
    this.toNumber = value;
  }

  @delegate('server')
  async setToNumber(value: string): Promise<void> {
    this._setToNumber(value);
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

  initialize(): void {
    this.evAuth.beforeAgentLogout(() => {
      this.reset();
    });
  }

  /**
   * Initiate an outbound call with redial support
   */
  @delegate('server')
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
  @delegate('server')
  async hangup(): Promise<void> {
    await this.evCall.outdialCancel();
    if (!this.evSettings.isManualOffhook) {
      await this.evClient.offhookTerm();
    }
  }

  /**
   * Navigate to manual dial settings page
   */
  goToManualDialSettings(): void {
    this.router.push('/settings/manualDial');
  }

  /**
   * Get reactive UI state props for the component
   */
  getUIProps(): UIProps<DialerViewUIProps> {
    return {
      toNumber: this.toNumber,
      hasDialer: this.hasDialer,
      isIdle: this.isIdle,
      isOnCall: this.evCallMonitor.isOnCall,
      isPendingDisposition: this.evWorkingState.isPendingDisposition,
    };
  }

  /**
   * Get stable UI action functions for the component
   */
  getUIFunctions(): UIFunctions<DialerViewUIFunctions> {
    return {
      onBackspace: () => {
        this.setToNumber(this.toNumber.slice(0, -1));
      },
      onDial: async () => {
        await this.dialout();
      },
      onHangup: () => {
        this.hangup();
      },
      onInputChange: (value: string) => {
        this.setToNumber(value);
      },
      onGoToSettings: () => {
        this.goToManualDialSettings();
      },
    };
  }

  component(_props?: DialerViewProps) {
    const { t } = useLocale(i18n);
    const { current: uiFunctions } = useRef(this.getUIFunctions());

    const {
      toNumber,
      hasDialer,
      isIdle,
      isOnCall,
      isPendingDisposition,
    } = useConnector(() => this.getUIProps());

    if (!hasDialer) {
      return null;
    }

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4">
        <div className="flex-1 flex flex-col justify-center items-center">
          {isPendingDisposition ? (
            <p
              className="typography-descriptor text-neutral-b2 text-center"
              data-sign="callBusyTip"
            >
              {t('pendingDispositionTip')}
            </p>
          ) : !isIdle || isOnCall ? (
            <>
              <p
                className="typography-descriptor text-neutral-b2 text-center"
                data-sign="callBusyTip"
              >
                {t('callInProgressTip')}
              </p>
              <div className="flex justify-center mt-4">
                <Button
                  size="large"
                  onClick={uiFunctions.onHangup}
                  data-sign="hangupButton"
                  color="danger"
                >
                  {t('hangupButton')}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-full mb-4 [&_input]:text-center flex justify-center">
                <DialTextField
                  value={toNumber}
                  onChange={uiFunctions.onInputChange}
                  placeholder={t('enterNumber')}
                  inputProps={{
                    'data-sign': 'dialerInput',
                  }}
                  startAdornment={
                    toNumber && (
                      <IconButton
                        symbol={BackspaceMd}
                        size="large"
                        variant="icon"
                        className="invisible pointer-events-none"
                      />
                    )
                  }
                  endAdornment={
                    toNumber && (
                      <IconButton
                        symbol={BackspaceMd}
                        size="large"
                        variant="icon"
                        onClick={uiFunctions.onBackspace}
                        data-sign="backspaceButton"
                      />
                    )
                  }
                />
              </div>
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
              {toNumber && (
                <div className="flex justify-center">
                  <Button
                    size="large"
                    onClick={uiFunctions.onDial}
                    disabled={!toNumber.trim()}
                    data-sign="callButton"
                  >
                    {t('callButton')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="text-center pb-2">
          <Link
            onClick={uiFunctions.onGoToSettings}
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
