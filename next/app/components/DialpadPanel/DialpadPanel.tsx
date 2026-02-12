import { DialPad, DialTextField, IconButton, Tooltip } from '@ringcentral/spring-ui';
import { Xmd, DialpadMd } from '@ringcentral/spring-icon';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';

import type { DialpadPanelProps } from './DialpadPanel.interface';

/**
 * DialpadPanel - Collapsible keypad with dial pad and text field
 *
 * Uses Spring UI DialPad and DialTextField components for proper
 * DTMF tone support and keypad behavior.
 * When collapsed, shows a small keypad toggle button.
 * When expanded, shows the full dial pad with text display.
 */
export const DialpadPanel: FunctionComponent<DialpadPanelProps> = ({
  isOpen,
  value,
  onToggle,
  onChange,
  onKeyPress,
  className,
  'data-sign': dataSign = 'dialpadPanel',
}) => {
  const handleDialPadChange = (digit: string) => {
    onKeyPress?.(digit);
  };

  const handleTextFieldChange = (newValue: string) => {
    onChange(newValue);
  };

  if (!isOpen) {
    return (
      <div
        className={clsx(
          'flex justify-center border-b border-neutral-b4 bg-neutral-base',
          className,
        )}
        data-sign={dataSign}
      >
        <Tooltip title="Keypad">
          <IconButton
            symbol={DialpadMd}
            size="small"
            variant="plain"
            onClick={() => onToggle(true)}
            data-sign="keypadOpenButton"
          />
        </Tooltip>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'border-b border-neutral-b4 bg-neutral-base shadow-sm',
        className,
      )}
      data-sign={dataSign}
    >
      {/* Close button */}
      <div className="flex justify-end p-2">
        <IconButton
          symbol={Xmd}
          size="small"
          variant="icon"
          onClick={() => onToggle(false)}
          data-sign="keypadCloseButton"
        />
      </div>
      {/* Dial text field */}
      <div className="px-4">
        <DialTextField
          value={value}
          onChange={handleTextFieldChange}
          keypadMode
          onlyAllowKeypadValue
          fullWidth
          data-sign="keypadTextField"
        />
      </div>
      {/* Dial pad */}
      <div className="px-4 py-2">
        <DialPad
          onChange={handleDialPadChange}
          size="medium"
          data-sign="keypadDialPad"
        />
      </div>
    </div>
  );
};
