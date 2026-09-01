/**
 * When only the media path breaks — a NAT rebinding, a relay failover, a short
 * burst of loss — the SIP dialog and its signaling transport are still up, so
 * the call can be repaired with an ICE restart instead of being rebuilt.
 *
 * The softphone does not attempt this: it treats `failed` as terminal and ends
 * the call. Acting while ICE is still `disconnected` is the only chance, since
 * once it reaches `failed` the dialog is torn down and nothing remains to
 * renegotiate.
 */

/** ICE states that mean the media path recovered on its own. */
const HEALTHY_ICE_STATES = ['connected', 'completed'] as const;

export interface IceRestartInputs {
  readonly iceConnectionState: string;
  /** Restarts already attempted for the current call. */
  readonly attempts: number;
  /** A confirmed dialog exists to carry the re-INVITE. */
  readonly hasSession: boolean;
  /** The SIP transport can still deliver the re-INVITE. */
  readonly isSignalingConnected: boolean;
  readonly maxAttempts?: number;
}

export interface IceRestartPlan {
  readonly shouldRestart: boolean;
  readonly reason: string;
}

/**
 * Long enough that a momentary blip settles by itself, short enough to stay
 * well inside the browser's window before ICE gives up and reports `failed`.
 */
export const ICE_RESTART_GRACE_MS = 2000;

/**
 * A restart that fails twice is not going to succeed a third time, and each
 * attempt renegotiates media on a call the agent may still be able to hear.
 */
export const ICE_RESTART_MAX_ATTEMPTS = 2;

export function isHealthyIceState(state: string): boolean {
  return (HEALTHY_ICE_STATES as readonly string[]).includes(state);
}

/**
 * Decide whether a stalled media path is worth trying to repair in place.
 */
export function planIceRestart({
  iceConnectionState,
  attempts,
  hasSession,
  isSignalingConnected,
  maxAttempts = ICE_RESTART_MAX_ATTEMPTS,
}: IceRestartInputs): IceRestartPlan {
  if (iceConnectionState !== 'disconnected') {
    // `failed` is deliberately excluded: the softphone has already ended the
    // call by then, so there is no dialog left to renegotiate.
    return { shouldRestart: false, reason: 'notDisconnected' };
  }
  if (!hasSession) {
    return { shouldRestart: false, reason: 'noSession' };
  }
  if (!isSignalingConnected) {
    // Without signaling the re-INVITE cannot be delivered; this is the network
    // switch case, where the session has to be rebuilt rather than repaired.
    return { shouldRestart: false, reason: 'signalingDown' };
  }
  if (attempts >= maxAttempts) {
    return { shouldRestart: false, reason: 'attemptsExhausted' };
  }
  return { shouldRestart: true, reason: 'restartIce' };
}
