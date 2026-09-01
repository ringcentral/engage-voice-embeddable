/**
 * A network drop destroys the agent's audio leg rather than suspending it: the
 * softphone has no ICE restart, so ICE failure ends the media session, and
 * re-registering rebuilds the SIP user agent from scratch, leaving no dialog to
 * recover. The leg therefore has to be created anew with an offhook session,
 * which the platform bridges back to the call it is still holding.
 *
 * Two signals identify a leg worth rebuilding, and neither alone covers both
 * failure shapes:
 *
 * - An active call whose leg was seen dying in this page session. A call
 *   cannot carry audio without a leg, so once the loss is witnessed the
 *   combination proves the leg is broken — the network-switch case, where the
 *   softphone re-registers against the same registrar and the SDK reports
 *   nothing else. The witness matters because call state is persisted: after
 *   a reload the same combination is just rehydrated storage.
 * - The offhook flags the SDK hands back on `SIP_DIAL_DEST_CHANGED` after it
 *   rotated registrars. This covers an idle agent whose standing session was
 *   rebuilt, where no call exists to witness the loss.
 */

/** Offhook flags as reported by the SDK on `SIP_DIAL_DEST_CHANGED`. */
export interface OffhookFlags {
  /** The agent had an audio leg when the registration dropped. */
  readonly autoStartOH: boolean;
  /** The agent owns the session, so ending a call must not tear it down. */
  readonly maintainOH: boolean;
}

export interface OffhookRecoveryInputs {
  /** Only the port that owns the SDK may drive registration. */
  readonly isServer: boolean;
  readonly isIntegratedSoftphone: boolean;
  /** Whether the app still believes an offhook session is up. */
  readonly isOffhook: boolean;
  /** An offhook init is already in flight; a second one would collide. */
  readonly isOffhooking: boolean;
  /** The app still holds an active call, which cannot live without a leg. */
  readonly hasActiveCall: boolean;
  /**
   * The audio leg was seen dying under an active call in this page session.
   * Required alongside `hasActiveCall`, because call state is persisted and a
   * page reload rehydrates it: without a witnessed loss, an active-call/no-leg
   * combination is stale storage, not a broken leg, and restoring from it
   * would put a freshly loaded agent offhook out of nowhere.
   */
  readonly offhookLostMidCall: boolean;
  /** The agent started the offhook session manually and owns it. */
  readonly isManualOffhook: boolean;
  /** Flags reported by the SDK, present only on the registrar-rotation path. */
  readonly flags?: OffhookFlags;
}

export interface OffhookRecoveryPlan {
  readonly shouldRestoreOffhook: boolean;
  /** Mark the restored session as agent-owned so `END_CALL` leaves it alone. */
  readonly shouldMaintainOffhook: boolean;
  readonly reason: string;
}

const SKIP = {
  shouldRestoreOffhook: false,
  shouldMaintainOffhook: false,
} as const;

/**
 * Decide whether the softphone needs a fresh offhook session.
 */
export function planOffhookRecovery({
  isServer,
  isIntegratedSoftphone,
  isOffhook,
  isOffhooking,
  hasActiveCall,
  offhookLostMidCall,
  isManualOffhook,
  flags,
}: OffhookRecoveryInputs): OffhookRecoveryPlan {
  if (!isServer) {
    return { ...SKIP, reason: 'notServer' };
  }
  if (!isIntegratedSoftphone) {
    return { ...SKIP, reason: 'notIntegratedSoftphone' };
  }
  if (isOffhook) {
    // The session survived, or was already rebuilt; a second offhook init
    // would displace a working leg.
    return { ...SKIP, reason: 'offhookStillUp' };
  }
  if (isOffhooking) {
    return { ...SKIP, reason: 'offhookInProgress' };
  }
  const shouldMaintainOffhook = isManualOffhook || !!flags?.maintainOH;
  if (hasActiveCall && offhookLostMidCall) {
    return {
      shouldRestoreOffhook: true,
      shouldMaintainOffhook,
      reason: 'activeCallWithoutAudioLeg',
    };
  }
  if (flags?.autoStartOH) {
    return {
      shouldRestoreOffhook: true,
      shouldMaintainOffhook,
      reason: 'restoreOffhook',
    };
  }
  return { ...SKIP, reason: 'noOffhookToRestore' };
}
