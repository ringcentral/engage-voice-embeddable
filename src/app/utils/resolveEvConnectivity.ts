import type {
  ConnectivitySeverity,
  EvConnectivityType,
} from '../views/ConnectivityView/ConnectivityView.interface';

/**
 * Inputs the connectivity banner derives its state from, flattened out of the
 * modules so the precedence rules can be tested on their own.
 */
export interface EvConnectivityInputs {
  /** Mode already decided by the shared network-level connectivity manager. */
  readonly baseMode: EvConnectivityType | null;
  readonly isLoggedIn: boolean;
  /** A full re-authentication is in flight. */
  readonly isReauthing: boolean;
  /** Socket is down but the Agent SDK is still retrying. */
  readonly isReconnecting: boolean;
  /** Socket is down and the Agent SDK has stopped retrying. */
  readonly isSocketDisconnected: boolean;
  readonly isIntegratedSoftphone: boolean;
  readonly sipUnstableConnection: boolean;
  readonly sipRegistering: boolean;
  /** The SDK is rebuilding the SIP session against another registrar. */
  readonly attemptingSoftphoneReconnect: boolean;
  /** Automatic SIP recovery is exhausted; only a manual retry is left. */
  readonly manualSoftphoneReconnect: boolean;
}

export interface EvConnectivityState {
  readonly mode: EvConnectivityType | null;
  readonly severity: ConnectivitySeverity;
  readonly loading: boolean;
  /** Whether to offer the manual Refresh action. */
  readonly retry: boolean;
}

/**
 * Resolve which connectivity message the agent should see.
 *
 * Refresh is only offered once automatic recovery has been ruled out. Offering
 * it while the SDK is still retrying invites the agent to throw away a
 * recoverable session, which strands the call in pending disposition on the
 * server.
 */
export function resolveEvConnectivity(
  inputs: EvConnectivityInputs,
): EvConnectivityState {
  if (inputs.baseMode) {
    return {
      mode: inputs.baseMode,
      severity: 'error',
      loading: false,
      retry: false,
    };
  }
  if (!inputs.isLoggedIn) {
    return { mode: null, severity: 'error', loading: false, retry: false };
  }
  if (inputs.isReauthing) {
    return {
      mode: 'socketReconnecting',
      severity: 'error',
      loading: true,
      retry: false,
    };
  }
  if (inputs.isReconnecting) {
    return {
      mode: 'socketReconnecting',
      severity: 'error',
      loading: true,
      retry: false,
    };
  }
  if (inputs.isSocketDisconnected) {
    return {
      mode: 'socketDisconnected',
      severity: 'error',
      loading: false,
      retry: true,
    };
  }
  if (inputs.isIntegratedSoftphone) {
    // Ranked above the unstable banner: SIP.js does not reconnect its own
    // transport, so once the SDK has stopped trying, the retry is the only
    // route back and a spinner would misrepresent it as still recovering.
    if (inputs.manualSoftphoneReconnect) {
      return {
        mode: 'sipReconnectFailed',
        severity: 'error',
        loading: false,
        retry: true,
      };
    }
    if (inputs.attemptingSoftphoneReconnect) {
      return {
        mode: 'sipUnstableConnection',
        severity: 'error',
        loading: true,
        retry: false,
      };
    }
    if (inputs.sipUnstableConnection) {
      return {
        mode: 'sipUnstableConnection',
        severity: 'error',
        loading: true,
        retry: false,
      };
    }
    if (inputs.sipRegistering) {
      return {
        mode: 'sipConnecting',
        severity: 'info',
        loading: true,
        retry: false,
      };
    }
  }
  return { mode: null, severity: 'error', loading: false, retry: false };
}
