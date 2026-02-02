import { IconButton, CallButton, Tooltip } from '@ringcentral/spring-ui';
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
  size = 'medium',
}) => {
  return (
    <Tooltip content={isMuted ? 'Unmute' : 'Mute'}>
      <IconButton
        symbol={isMuted ? MuteMd : MicrophoneMd}
        onClick={onClick}
        disabled={disabled}
        data-sign={dataSign}
        size={size}
        variant={isMuted ? 'contained' : 'outlined'}
        color={isMuted ? 'danger' : 'neutral'}
      />
    </Tooltip>
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
  size = 'medium',
}) => {
  return (
    <Tooltip content={isOnHold ? 'Unhold' : 'Hold'}>
      <IconButton
        symbol={HoldMd}
        onClick={onClick}
        disabled={disabled}
        data-sign={dataSign}
        size={size}
        variant={isOnHold ? 'contained' : 'outlined'}
        color={isOnHold ? 'warning' : 'neutral'}
      />
    </Tooltip>
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
    <Tooltip content="Transfer">
      <IconButton
        symbol={TransferCallMd}
        onClick={onClick}
        disabled={disabled}
        data-sign={dataSign}
        size={size}
        variant="outlined"
        color="neutral"
      />
    </Tooltip>
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
    <Tooltip content={getTooltip()}>
      <IconButton
        symbol={RecordMd}
        onClick={onClick}
        disabled={disabled}
        data-sign={dataSign}
        size={size}
        variant={isRecording ? 'contained' : 'outlined'}
        color={isRecording && !isPaused ? 'danger' : 'neutral'}
      />
    </Tooltip>
  );
};

/**
 * HangupButton - End call
 */
export const HangupButton: FunctionComponent<CallControlButtonProps> = ({
  disabled = false,
  onClick,
  'data-sign': dataSign = 'hangupButton',
  size = 'medium',
}) => {
  return (
    <Tooltip content="End Call">
      <CallButton
        variant="end"
        onClick={onClick}
        disabled={disabled}
        data-sign={dataSign}
        size={size}
      />
    </Tooltip>
  );
};

/**
 * ActiveCallButton - Switch to active call
 */
export const ActiveCallButton: FunctionComponent<CallControlButtonProps> = ({
  disabled = false,
  onClick,
  'data-sign': dataSign = 'activeCallButton',
  size = 'medium',
}) => {
  return (
    <Tooltip content="Active Calls">
      <IconButton
        symbol={ActiveCallMd}
        onClick={onClick}
        disabled={disabled}
        data-sign={dataSign}
        size={size}
        variant="contained"
        color="success"
      />
    </Tooltip>
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
      className={clsx('flex items-center justify-center gap-3', className)}
      data-sign={dataSign}
    >
      {showHoldButton && (
        <HoldButton
          isOnHold={isOnHold}
          disabled={disabled}
          onClick={onHold}
          size={size}
        />
      )}

      {showMuteButton && (
        <MuteButton
          isMuted={isMuted}
          disabled={disabled}
          onClick={onMute}
          size={size}
        />
      )}

      {showTransferButton && (
        <TransferButton
          disabled={disabled || disableTransfer}
          onClick={onTransfer}
          size={size}
        />
      )}

      {showRecordButton && (
        <RecordButton
          isRecording={isRecording}
          isPaused={isRecordingPaused}
          disabled={disabled || disableRecord}
          onClick={onRecord}
          size={size}
        />
      )}

      {showActiveCallButton ? (
        <ActiveCallButton
          disabled={disabled}
          onClick={onActiveCall}
          size={size}
        />
      ) : (
        showHangupButton && (
          <HangupButton disabled={disabled} onClick={onHangup} size={size} />
        )
      )}
    </div>
  );
};
