import { resolveEvConnectivity } from '../../../../src/app/utils/resolveEvConnectivity';
import type { EvConnectivityInputs } from '../../../../src/app/utils/resolveEvConnectivity';

const connected: EvConnectivityInputs = {
  baseMode: null,
  isLoggedIn: true,
  isReauthing: false,
  isReconnecting: false,
  isSocketDisconnected: false,
  isIntegratedSoftphone: false,
  sipUnstableConnection: false,
  sipRegistering: false,
  attemptingSoftphoneReconnect: false,
  manualSoftphoneReconnect: false,
};

const onSoftphone: EvConnectivityInputs = {
  ...connected,
  isIntegratedSoftphone: true,
};

describe('resolveEvConnectivity SIP recovery', () => {
  it('offers a retry once automatic SIP recovery is exhausted', () => {
    const state = resolveEvConnectivity({
      ...onSoftphone,
      manualSoftphoneReconnect: true,
    });
    expect(state).toEqual({
      mode: 'sipReconnectFailed',
      severity: 'error',
      loading: false,
      retry: true,
    });
  });

  it('shows a spinner without a retry while the SDK rebuilds the session', () => {
    const state = resolveEvConnectivity({
      ...onSoftphone,
      attemptingSoftphoneReconnect: true,
    });
    expect(state.mode).toBe('sipUnstableConnection');
    expect(state.loading).toBe(true);
    expect(state.retry).toBe(false);
  });

  it('prefers the retry over the spinner when the SDK has given up', () => {
    const state = resolveEvConnectivity({
      ...onSoftphone,
      attemptingSoftphoneReconnect: true,
      manualSoftphoneReconnect: true,
      sipUnstableConnection: true,
    });
    expect(state.mode).toBe('sipReconnectFailed');
    expect(state.retry).toBe(true);
  });

  it('ignores SIP recovery state when not on the integrated softphone', () => {
    const state = resolveEvConnectivity({
      ...connected,
      manualSoftphoneReconnect: true,
    });
    expect(state.mode).toBeNull();
    expect(state.retry).toBe(false);
  });

  it('still lets a dead agent socket outrank the SIP retry', () => {
    const state = resolveEvConnectivity({
      ...onSoftphone,
      isSocketDisconnected: true,
      manualSoftphoneReconnect: true,
    });
    expect(state.mode).toBe('socketDisconnected');
  });
});

describe('resolveEvConnectivity', () => {
  it('shows nothing while everything is healthy', () => {
    expect(resolveEvConnectivity(connected)).toEqual({
      mode: null,
      severity: 'error',
      loading: false,
      retry: false,
    });
  });

  it('lets the network-level mode win over every EV status', () => {
    const state = resolveEvConnectivity({
      ...connected,
      baseMode: 'offline',
      isSocketDisconnected: true,
      sipUnstableConnection: true,
    });
    expect(state.mode).toBe('offline');
    expect(state.retry).toBe(false);
  });

  it('shows nothing when the user is signed out', () => {
    const state = resolveEvConnectivity({
      ...connected,
      isLoggedIn: false,
      isSocketDisconnected: true,
    });
    expect(state.mode).toBeNull();
  });

  it('shows a spinner without Refresh while the SDK is still retrying', () => {
    expect(
      resolveEvConnectivity({ ...connected, isReconnecting: true }),
    ).toEqual({
      mode: 'socketReconnecting',
      severity: 'error',
      loading: true,
      retry: false,
    });
  });

  it('shows a spinner without Refresh while re-authenticating', () => {
    const state = resolveEvConnectivity({ ...connected, isReauthing: true });
    expect(state.mode).toBe('socketReconnecting');
    expect(state.retry).toBe(false);
  });

  // Offering Refresh mid-reconnect lets the agent discard a recoverable
  // session, which strands the call in pending disposition server-side.
  it('only offers Refresh once automatic recovery has been ruled out', () => {
    const retrying = resolveEvConnectivity({
      ...connected,
      isReconnecting: true,
      isSocketDisconnected: true,
    });
    expect(retrying.retry).toBe(false);

    const gaveUp = resolveEvConnectivity({
      ...connected,
      isSocketDisconnected: true,
    });
    expect(gaveUp).toEqual({
      mode: 'socketDisconnected',
      severity: 'error',
      loading: false,
      retry: true,
    });
  });

  it('reports an unstable softphone once the socket is healthy', () => {
    expect(
      resolveEvConnectivity({
        ...connected,
        isIntegratedSoftphone: true,
        sipUnstableConnection: true,
      }),
    ).toEqual({
      mode: 'sipUnstableConnection',
      severity: 'error',
      loading: true,
      retry: false,
    });
  });

  it('reports softphone registration as info rather than an error', () => {
    expect(
      resolveEvConnectivity({
        ...connected,
        isIntegratedSoftphone: true,
        sipRegistering: true,
      }),
    ).toEqual({
      mode: 'sipConnecting',
      severity: 'info',
      loading: true,
      retry: false,
    });
  });

  it('ignores SIP status when the integrated softphone is not in use', () => {
    const state = resolveEvConnectivity({
      ...connected,
      isIntegratedSoftphone: false,
      sipUnstableConnection: true,
      sipRegistering: true,
    });
    expect(state.mode).toBeNull();
  });

  it('reports the socket before the softphone', () => {
    const state = resolveEvConnectivity({
      ...connected,
      isSocketDisconnected: true,
      isIntegratedSoftphone: true,
      sipUnstableConnection: true,
    });
    expect(state.mode).toBe('socketDisconnected');
  });
});
