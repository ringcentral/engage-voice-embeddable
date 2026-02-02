import { Menu, MenuItem, Icon, Tooltip } from '@ringcentral/spring-ui';
import { CaretDownMd, CaretUpMd } from '@ringcentral/spring-icon';
import clsx from 'clsx';
import type { FunctionComponent, MouseEvent } from 'react';
import React, { useState, useCallback, useRef } from 'react';

import type { WorkingStateSelectProps, AgentStateOption } from './WorkingStateSelect.interface';

/**
 * Color mapping for agent state indicator
 */
const stateColorMap: Record<string, string> = {
  green: 'bg-success',
  red: 'bg-danger',
  orange: 'bg-warning',
  yellow: 'bg-warning',
  grey: 'bg-neutral-b3',
  gray: 'bg-neutral-b3',
  blue: 'bg-primary-b',
};

/**
 * WorkingStateSelect - Agent state dropdown with timer
 *
 * Displays the current agent working state with a colored indicator,
 * timer, and dropdown menu to change states.
 */
export const WorkingStateSelect: FunctionComponent<WorkingStateSelectProps> = ({
  agentStates,
  currentStateIndex,
  stateText,
  stateColor,
  timerText,
  onChangeState,
  disabled = false,
  className,
  'data-sign': dataSign,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        setAnchorEl(event.currentTarget);
      }
    },
    [disabled],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSelectState = useCallback(
    (state: AgentStateOption) => {
      handleClose();
      onChangeState(state);
    },
    [handleClose, onChangeState],
  );

  const colorClass = stateColorMap[stateColor] || 'bg-neutral-b3';

  return (
    <div className={clsx('flex-1', className)} data-sign={dataSign}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={clsx(
          'flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-colors',
          'hover:bg-neutral-b5 focus:outline-none focus:ring-2 focus:ring-primary-b',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer',
        )}
        data-sign="workingStateButton"
      >
        {/* State indicator dot */}
        <div
          className={clsx('w-2.5 h-2.5 rounded-full flex-shrink-0', colorClass)}
        />

        {/* State name with tooltip */}
        <Tooltip content={stateText}>
          <span
            className="typography-subtitle text-neutral-b1 truncate flex-1 text-left"
            data-sign="stateName"
          >
            {stateText}
          </span>
        </Tooltip>

        {/* Timer */}
        <span
          className="typography-descriptor text-neutral-b2 flex-shrink-0"
          data-sign="timer"
        >
          {timerText}
        </span>

        {/* Arrow icon */}
        <Icon
          symbol={menuOpen ? CaretUpMd : CaretDownMd}
          size="small"
          className="text-neutral-b2 flex-shrink-0"
        />
      </button>

      {/* State selection menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        placement="bottom-start"
        PopperPaperProps={{
          style: { maxHeight: 280, minWidth: 200 },
        }}
      >
        {agentStates.map((state, index) => {
          const isSelected = currentStateIndex === index;
          const itemColorClass = stateColorMap[state.color || 'grey'] || 'bg-neutral-b3';

          return (
            <MenuItem
              key={`${state.agentState}-${state.agentAuxState}-${index}`}
              onClick={() => handleSelectState(state)}
              selected={isSelected}
              data-sign="workingStateItem"
            >
              <div className="flex items-center gap-2 w-full">
                <div
                  className={clsx(
                    'w-2 h-2 rounded-full flex-shrink-0',
                    itemColorClass,
                  )}
                />
                <span className="typography-mainText text-neutral-b1 truncate">
                  {state.title || state.agentAuxState || state.agentState}
                </span>
              </div>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};
