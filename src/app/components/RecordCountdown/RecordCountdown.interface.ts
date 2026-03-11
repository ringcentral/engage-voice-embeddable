/**
 * Props for RecordCountdown component
 */
export interface RecordCountdownProps {
  /** Pause countdown duration in seconds */
  recordPauseCount: number;
  /** Timestamp when recording was paused */
  timeStamp: number;
  /** Called when the countdown expires (auto-resume recording) */
  onResumeRecord: () => void;
  /** Called when the restart timer button is clicked */
  onRestartTimer: () => void;
  /** Size of the button */
  size?: 'small' | 'medium' | 'large';
  /** Custom class name */
  className?: string;
  /** Data sign for testing */
  'data-sign'?: string;
}
