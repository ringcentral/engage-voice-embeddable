import type { UIFunctions, UIProps } from '@ringcentral-integration/next-core';
import {
  injectable,
  optional,
  useConnector,
} from '@ringcentral-integration/next-core';
import { ConnectivityView as BaseConnectivityView } from '@ringcentral-integration/micro-auth/src/app/views/ConnectivityView/Connectivity.view';
import { ConnectivityManager } from '@ringcentral-integration/micro-auth/src/app/services';
import { useObservableState } from 'observable-hooks';
import React, { useRef } from 'react';

import { EvClient } from '../../services/EvClient';
import { EvAuth } from '../../services/EvAuth';
import { EvIntegratedSoftphone } from '../../services/EvIntegratedSoftphone';
import { evStatus } from '../../services/EvClient/enums';

import type { EvConnectivityViewProps } from './ConnectivityView.interface';
import { ConnectivityPanel } from './ConnectivityPanel';

/**
 * ConnectivityView - Extended connectivity view for Engage Voice
 * Shows network status, EvClient socket status, and SIP connection status
 *
 * Priority: base network mode > socket disconnected > SIP unstable > SIP connecting
 *
 * - sipUnstableConnection: was connected, then lost (error severity, red)
 * - sipConnecting: first-time SIP registration after session setup (info severity, blue)
 */
@injectable({
  name: 'ConnectivityView',
})
export class ConnectivityView extends BaseConnectivityView {
  constructor(
    protected _connectivityManager: ConnectivityManager,
    protected _evClient: EvClient,
    protected _evAuth: EvAuth,
    @optional() protected _evIntegratedSoftphone?: EvIntegratedSoftphone,
  ) {
    super(_connectivityManager);
  }

  /**
   * Get UI props including EV-specific connectivity statuses
   * Priority: base mode > socket disconnected > SIP unstable > SIP connecting
   */
  override getUIProps(): UIProps<EvConnectivityViewProps> {
    const baseProps = super.getUIProps();
    if (baseProps.mode) {
      return { ...baseProps, severity: 'error' };
    }
    const isSocketDisconnected =
      this._evClient.appStatus === evStatus.CLOSED ||
      this._evClient.appStatus === evStatus.CONNECT_FAILURE;
    if (isSocketDisconnected) {
      return {
        mode: 'socketDisconnected',
        severity: 'error',
        loading: false,
        retry: true,
      };
    }
    if (this._evIntegratedSoftphone?.isIntegratedSoftphone) {
      if (this._evIntegratedSoftphone.sipUnstableConnection) {
        return {
          mode: 'sipUnstableConnection',
          severity: 'error',
          loading: true,
          retry: false,
        };
      }
      if (this._evIntegratedSoftphone.sipRegistering) {
        return {
          mode: 'sipConnecting',
          severity: 'info',
          loading: true,
          retry: false,
        };
      }
    }
    return { ...baseProps, severity: 'error' };
  }

  /**
   * Get UI functions with EV-specific retry handling
   */
  override getUIFunctions(): UIFunctions<EvConnectivityViewProps> {
    const baseFunctions = super.getUIFunctions();
    return {
      onClick: () => {
        const { mode } = this.getUIProps();
        if (mode === 'socketDisconnected') {
          this._evAuth.openSocketWithSelectedAgentId({
            retryOpenSocket: true,
          });
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
