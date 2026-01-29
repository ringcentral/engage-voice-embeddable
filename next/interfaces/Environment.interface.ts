/**
 * Base Environment interface - local definition
 */
export interface BaseEnvironment {
  server: string;
  enabled: boolean;
  clientId?: string;
  clientSecret?: string;
}

export type EvEnvironment = BaseEnvironment & {
  view: { mode: string };
  isWide: boolean;
  recordingHost?: string;
  evAuthServer?: string;
};
