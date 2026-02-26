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

function getMuteTooltip(isMuted: boolean): string {
  return isMuted ? 'Unmute' : 'Mute';
}

function getHoldTooltip(isOnHold: boolean): string {
  return isOnHold ? 'Unhold' : 'Hold';
}

function getRecordTooltip({
  disabled,
  isRecording,
  isPaused,
  isDefaultRecord,
}: Pick<RecordButtonProps, 'disabled' | 'isRecording' | 'isPaused' | 'isDefaultRecord'>): string {
  if (disabled && isDefaultRecord) return 'Recording';
  if (disabled) return 'Recording disabled';
  if (isRecording && !isPaused) return 'Pause Recording';
  if (isPaused) return 'Resume Recording';
  return 'Start Recording';
}

/**
 * Determine the record button color based on recording state.
 *
 * In the old project, when the agent has no record control but auto-recording
 * is enabled (isDefaultRecord), the RecordingButton is shown in danger color
 * even when disabled, to indicate the call is being recorded automatically.
 */
function getRecordColor({
  isRecording,
  isPaused,
  isDefaultRecord,
}: Pick<RecordButtonProps, 'isRecording' | 'isPaused' | 'isDefaultRecord'>): 'danger' | 'neutral' {
  if (isDefaultRecord) return 'danger';
  if (isRecording && !isPaused) return 'danger';
  return 'neutral';
}

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
        title: getMuteTooltip(isMuted),
      }}
    />
  );
};

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
        title: getHoldTooltip(isOnHold),
      }}
    />
  );
};

export const TransferButton: FunctionComponent<CallControlButtonProps> = ({
  disabled = false,
  onClick,
  'data-sign': dataSign = 'transferButton',
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

export const RecordButton: FunctionComponent<RecordButtonProps> = ({
  isRecording,
  isPaused = false,
  isDefaultRecord = false,
  disabled = false,
  onClick,
  'data-sign': dataSign = 'recordButton',
}) => {
  // When auto-recording is active but agent has no record control,
  // render as a non-interactive red indicator instead of a disabled grey button.
  // This matches the old project's RecordingButton behavior.
  const isAutoRecordIndicator = disabled && isDefaultRecord;
  if (isAutoRecordIndicator) {
    return (
      <Tooltip title={getRecordTooltip({ disabled, isRecording, isPaused, isDefaultRecord })}>
        <span className="inline-flex">
          <IconButton
            symbol={RecordMd}
            data-sign={dataSign}
            size="large"
            variant="inverted"
            color="danger"
            className="pointer-events-none"
          />
        </span>
      </Tooltip>
    );
  }
  return (
    <IconButton
      symbol={RecordMd}
      onClick={onClick}
      disabled={disabled}
      data-sign={dataSign}
      size="large"
      variant="inverted"
      color={getRecordColor({ isRecording, isPaused, isDefaultRecord })}
      TooltipProps={{
        title: getRecordTooltip({ disabled, isRecording, isPaused, isDefaultRecord }),
      }}
    />
  );
};

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
      TooltipProps={{
        title: 'End Call',
      }}
    />
  );
};

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
      TooltipProps={{
        title: 'Active Calls',
      }}
    />
  );
};

/**
 * EvCallControlButtons - Container for Engage Voice call control buttons
 */
export const EvCallControlButtons: FunctionComponent<EvCallControlButtonsProps> = ({
  isMuted = false,
  isOnHold = false,
  isRecording = false,
  isRecordingPaused = false,
  isDefaultRecord = false,
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
          isDefaultRecord={isDefaultRecord}
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
