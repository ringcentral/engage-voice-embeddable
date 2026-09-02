/**
 * Options for the EvSessionRecovery module.
 */
export interface EvSessionRecoveryOptions {
  /**
   * Route prefix the disposition page lives under. The recovered call id and
   * `/disposition` are appended to it.
   */
  dispositionPathPrefix?: string;
}
