import { IconButton, Tooltip } from '@ringcentral/spring-ui';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';

import type { RecordCountdownProps } from './RecordCountdown.interface';

/**
 * Format the countdown display value
 */
const formatCountdown = (seconds: number): string => {
  if (seconds > 99) return '99+';
  return String(Math.max(0, seconds));
};

/**
 * CountdownIcon - Renders the countdown number as an icon substitute
 */
const CountdownIcon: FunctionComponent<{ count: number }> = ({ count }) => {
  return (
    <span className="typography-subtitleMini text-danger" data-sign="countdownText">
      {formatCountdown(count)}
    </span>
  );
};

/**
 * RecordCountdown - Countdown timer for paused recording
 *
 * Displays the remaining seconds until a paused recording auto-resumes.
 * Clicking the button restarts the pause timer.
 * When the countdown reaches zero, it automatically triggers resume recording.
 */
export const RecordCountdown: FunctionComponent<RecordCountdownProps> = ({
  recordPauseCount,
  timeStamp,
  onResumeRecord,
  onRestartTimer,
  className,
  'data-sign': dataSign = 'recordCountdown',
}) => {
  const [remainingTime, setRemainingTime] = useState(recordPauseCount);

  useEffect(() => {
    if (!timeStamp) return;

    const updateTimer = () => {
      const time = Math.ceil(
        recordPauseCount + (timeStamp - Date.now()) / 1000,
      );
      if (time < 0) {
        clearInterval(intervalId);
        // Small delay before resuming to handle cross-tab scenarios
        setTimeout(() => onResumeRecord(), 1000);
        return;
      }
      setRemainingTime(time);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [timeStamp, recordPauseCount, onResumeRecord]);

  return (
    <div
      className={clsx('inline-flex', className)}
      data-sign={dataSign}
    >
      <Tooltip title="Restart timer">
        <IconButton
          symbol={() => <CountdownIcon count={remainingTime} />}
          onClick={onRestartTimer}
          variant="contained"
          color="danger"
          size="medium"
          data-sign="restartTimerButton"
        />
      </Tooltip>
    </div>
  );
};
