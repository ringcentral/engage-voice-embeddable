import type { UIFunctions, UIProps } from '@ringcentral-integration/next-core';
import {
  injectable,
  optional,
  useConnector,
} from '@ringcentral-integration/next-core';
import { Auth } from '@ringcentral-integration/micro-auth/src/app/services';
import { ConnectivityView as BaseConnectivityView } from '@ringcentral-integration/micro-auth/src/app/views/ConnectivityView/Connectivity.view';
import { ConnectivityManager } from '@ringcentral-integration/micro-auth/src/app/services';
import { useObservableState } from 'observable-hooks';
import React, { useRef } from 'react';

import { EvClient } from '../../services/EvClient';
import { EvAuth } from '../../services/EvAuth';
import { EvIntegratedSoftphone } from '../../services/EvIntegratedSoftphone';
import { evStatus } from '../../services/EvClient/enums';

import { resolveEvConnectivity } from '../../utils/resolveEvConnectivity';

import type { EvConnectivityViewProps } from './ConnectivityView.interface';
import { ConnectivityPanel } from './ConnectivityPanel';

/**
 * ConnectivityView - Extended connectivity view for Engage Voice
 * Shows network status, EvClient socket status, and SIP connection status
 *
 * Priority: base network mode > reauthing > socket reconnecting > socket
 * disconnected > SIP unstable > SIP connecting
 *
 * - socketReconnecting: socket dropped but the SDK is still retrying, or a
 *   re-authentication is in flight (error, shows spinner, no Refresh)
 * - socketDisconnected: the SDK has given up (error, shows Refresh button)
 * - sipUnstableConnection: was connected, then lost (error, shows spinner)
 * - sipConnecting: first-time SIP registration after session (info, shows spinner)
 */
@injectable({
  name: 'ConnectivityView',
})
export class ConnectivityView extends BaseConnectivityView {
  constructor(
    protected _connectivityManager: ConnectivityManager,
    protected _evClient: EvClient,
    protected _evAuth: EvAuth,
    protected _auth: Auth,
    @optional() protected _evIntegratedSoftphone?: EvIntegratedSoftphone,
  ) {
    super(_connectivityManager);
  }

  /**
   * Get UI props including EV-specific connectivity statuses
   * Priority: base mode > socket reconnecting > socket disconnected > SIP unstable > SIP connecting
   */
  override getUIProps(): UIProps<EvConnectivityViewProps> {
    const baseProps = super.getUIProps();
    return {
      ...baseProps,
      ...resolveEvConnectivity({
        baseMode: baseProps.mode,
        isLoggedIn: this._auth.loggedIn,
        isReauthing: this._evAuth.isReauthing,
        isReconnecting: this._evClient.appStatus === evStatus.RECONNECTING,
        isSocketDisconnected:
          this._evClient.appStatus === evStatus.CLOSED ||
          this._evClient.appStatus === evStatus.CONNECT_FAILURE,
        isIntegratedSoftphone:
          !!this._evIntegratedSoftphone?.isIntegratedSoftphone,
        sipUnstableConnection:
          !!this._evIntegratedSoftphone?.sipUnstableConnection,
        sipRegistering: !!this._evIntegratedSoftphone?.sipRegistering,
        attemptingSoftphoneReconnect:
          !!this._evIntegratedSoftphone?.attemptingSoftphoneReconnect,
        manualSoftphoneReconnect:
          !!this._evIntegratedSoftphone?.manualSoftphoneReconnect,
      }),
    };
  }

  /**
   * Get UI functions with EV-specific retry handling
   */
  override getUIFunctions(): UIFunctions<EvConnectivityViewProps> {
    const baseFunctions = super.getUIFunctions();
    return {
      onClick: async () => {
        const { mode } = this.getUIProps();
        if (mode === 'sipReconnectFailed') {
          await this._evIntegratedSoftphone?.retrySoftphoneSession();
          return;
        }
        if (mode === 'socketDisconnected') {
          await this._evIntegratedSoftphone?.resetSip();
          // Resume the existing session rather than forcing a fresh login, so
          // a call the server still holds is handed back instead of orphaned.
          await this._evAuth.retryConnection();
          return;
        }
        baseFunctions.onClick();
      },
    };
  }

  /**
   * Render the connectivity panel with EV-specific props
   */
  override component(props?: Pick<EvConnectivityViewProps, 'className'>) {
    const { current: uiFunctions } = useRef(this.getUIFunctions());
    const _props = useConnector(() => {
      const uiProps = this.getUIProps();
      return {
        ...props,
        ...uiProps,
      };
    });
    const ready = useObservableState(
      this._connectivityManager.readyState$,
      false,
    );
    if (!ready) return null;
    return <ConnectivityPanel {..._props} {...uiFunctions} />;
  }
}
