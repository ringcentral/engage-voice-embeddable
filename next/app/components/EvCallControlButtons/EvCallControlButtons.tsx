import { IconButton, CallButton } from '@ringcentral/spring-ui';
import {
  MuteMd,
  MicrophoneMd,
  HoldMd,
  TransferCallMd,
  RecordMd,
  ActiveCallMd,
} from '@ringcentral/spring-icon';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';

import type {
  EvCallControlButtonsProps,
  MuteButtonProps,
  HoldButtonProps,
  RecordButtonProps,
  CallControlButtonProps,
} from './EvCallControlButtons.interface';

/**
 * MuteButton - Toggle mute/unmute
 */
export const MuteButton: FunctionComponent<MuteButtonProps> = ({
  isMuted,
  disabled = false,
  onClick,
  'data-sign': dataSign = 'muteButton',
}) => {
  return (
    <IconButton
      symbol={isMuted ? MuteMd : MicrophoneMd}
      onClick={onClick}
      disabled={disabled}
      data-sign={dataSign}
      size="large"
      variant="inverted"
      color={isMuted ? 'danger' : 'neutral'}
      TooltipProps={{
        title: isMuted ? 'Unmute' : 'Mute',
      }}
    />
  );
};

/**
 * HoldButton - Toggle hold/unhold
 */
export const HoldButton: FunctionComponent<HoldButtonProps> = ({
  isOnHold,
  disabled = false,
  onClick,
  'data-sign': dataSign = 'holdButton',
}) => {
  return (
    <IconButton
      symbol={HoldMd}
      onClick={onClick}
      disabled={disabled}
      data-sign={dataSign}
      size="large"
      variant="inverted"
      color={isOnHold ? 'warning' : 'neutral'}
      TooltipProps={{
        title: isOnHold ? 'Unhold' : 'Hold',
      }}
    />
  );
};

/**
 * TransferButton - Transfer call
 */
export const TransferButton: FunctionComponent<CallControlButtonProps> = ({
  disabled = false,
  onClick,
  'data-sign': dataSign = 'transferButton',
  size = 'medium',
}) => {
  return (
    <IconButton
      symbol={TransferCallMd}
      onClick={onClick}
      disabled={disabled}
      data-sign={dataSign}
      size="large"
      variant="inverted"
      color="neutral"
      TooltipProps={{
        title: 'Transfer',
      }}
    />
  );
};

/**
 * RecordButton - Toggle recording
 */
export const RecordButton: FunctionComponent<RecordButtonProps> = ({
  isRecording,
  isPaused = false,
  disabled = false,
  onClick,
  'data-sign': dataSign = 'recordButton',
  size = 'medium',
}) => {
  const getTooltip = () => {
    if (disabled) return 'Recording disabled';
    if (isRecording && !isPaused) return 'Pause Recording';
    if (isPaused) return 'Resume Recording';
    return 'Start Recording';
  };
  return (
    <IconButton
      symbol={RecordMd}
      onClick={onClick}
      disabled={disabled}
      data-sign={dataSign}
      size="large"
      variant="inverted"
      color={isRecording && !isPaused ? 'danger' : 'neutral'}
      TooltipProps={{
        title: getTooltip(),
      }}
    />
  );
};

/**
 * HangupButton - End call
 */
export const HangupButton: FunctionComponent<CallControlButtonProps> = ({
  disabled = false,
  onClick,
  'data-sign': dataSign = 'hangupButton',
}) => {
  return (
    <CallButton
      variant="end"
      onClick={onClick}
      disabled={disabled}
      data-sign={dataSign}
      size="small"
      title="End Call"
    />
  );
};

/**
 * ActiveCallButton - Switch to active call list
 */
export const ActiveCallButton: FunctionComponent<CallControlButtonProps> = ({
  disabled = false,
  onClick,
  'data-sign': dataSign = 'activeCallButton',
}) => {
  return (
    <IconButton
      symbol={ActiveCallMd}
      onClick={onClick}
      disabled={disabled}
      data-sign={dataSign}
      size="large"
      variant="inverted"
      color="success"
    />
  );
};

/**
 * EvCallControlButtons - Container for Engage Voice call control buttons
 *
 * Provides a consistent layout for call control buttons including:
 * - Hold/Unhold
 * - Mute/Unmute
 * - Transfer
 * - Record
 * - Hangup / Active Call
 */
export const EvCallControlButtons: FunctionComponent<EvCallControlButtonsProps> = ({
  isMuted = false,
  isOnHold = false,
  isRecording = false,
  isRecordingPaused = false,
  showMuteButton = true,
  showHoldButton = true,
  showTransferButton = true,
  showRecordButton = false,
  showHangupButton = true,
  showActiveCallButton = false,
  onMute,
  onHold,
  onTransfer,
  onRecord,
  onHangup,
  onActiveCall,
  disabled = false,
  disableTransfer = false,
  disableRecord = false,
  size = 'medium',
  className,
  'data-sign': dataSign = 'evCallControlButtons',
}) => {
  return (
    <div
      className={clsx('flex items-center justify-between', className)}
      data-sign={dataSign}
    >
      {showHoldButton && (
        <HoldButton
          isOnHold={isOnHold}
          disabled={disabled}
          onClick={onHold}
        />
      )}

      {showMuteButton && (
        <MuteButton
          isMuted={isMuted}
          disabled={disabled}
          onClick={onMute}
        />
      )}

      {showTransferButton && (
        <TransferButton
          disabled={disabled || disableTransfer}
          onClick={onTransfer}
        />
      )}

      {showRecordButton && (
        <RecordButton
          isRecording={isRecording}
          isPaused={isRecordingPaused}
          disabled={disabled || disableRecord}
          onClick={onRecord}
        />
      )}

      {showActiveCallButton ? (
        <ActiveCallButton
          disabled={disabled}
          onClick={onActiveCall}
        />
      ) : (
        showHangupButton && (
          <HangupButton disabled={disabled} onClick={onHangup} />
        )
      )}
    </div>
  );
};
