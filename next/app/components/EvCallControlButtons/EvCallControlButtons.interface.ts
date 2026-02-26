import type React from 'react';

/**
 * Props for individual call control buttons
 */
export interface CallControlButtonProps {
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Data sign for testing */
  'data-sign'?: string;
  /** Size of the button */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Props for MuteButton
 */
export interface MuteButtonProps extends CallControlButtonProps {
  /** Whether the call is currently muted */
  isMuted: boolean;
}

/**
 * Props for HoldButton
 */
export interface HoldButtonProps extends CallControlButtonProps {
  /** Whether the call is currently on hold */
  isOnHold: boolean;
}

/**
 * Props for RecordButton
 */
export interface RecordButtonProps extends CallControlButtonProps {
  /** Whether recording is currently active */
  isRecording: boolean;
  /** Whether recording is paused */
  isPaused?: boolean;
  /** Whether auto-recording is enabled by default (shows red even when disabled) */
  isDefaultRecord?: boolean;
}

/**
 * Props for EvCallControlButtons container
 */
export interface EvCallControlButtonsProps {
  /** Whether the call is muted */
  isMuted?: boolean;
  /** Whether the call is on hold */
  isOnHold?: boolean;
  /** Whether recording is active */
  isRecording?: boolean;
  /** Whether recording is paused */
  isRecordingPaused?: boolean;
  /** Whether auto-recording is enabled by default */
  isDefaultRecord?: boolean;
  /** Whether to show mute button */
  showMuteButton?: boolean;
  /** Whether to show hold button */
  showHoldButton?: boolean;
  /** Whether to show transfer button */
  showTransferButton?: boolean;
  /** Whether to show record button */
  showRecordButton?: boolean;
  /** Whether to show hangup button */
  showHangupButton?: boolean;
  /** Whether to show active call button (instead of hangup) */
  showActiveCallButton?: boolean;
  /** Mute button click handler */
  onMute?: () => void;
  /** Hold button click handler */
  onHold?: () => void;
  /** Transfer button click handler (event used for menu anchor positioning) */
  onTransfer?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Record button click handler */
  onRecord?: () => void;
  /** Hangup button click handler */
  onHangup?: () => void;
  /** Active call button click handler */
  onActiveCall?: () => void;
  /** Whether buttons are disabled */
  disabled?: boolean;
  /** Whether transfer is disabled */
  disableTransfer?: boolean;
  /** Whether record is disabled */
  disableRecord?: boolean;
  /** Size of the buttons */
  size?: 'small' | 'medium' | 'large';
  /** Custom class name */
  className?: string;
  /** Data sign for testing */
  'data-sign'?: string;
}
