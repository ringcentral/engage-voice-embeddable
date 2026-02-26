import React, { useCallback, useState } from 'react';
import type { FunctionComponent } from 'react';
import { DialPad, DialTextField, IconButton, Drawer } from '@ringcentral/spring-ui';
import { Xmd, DialpadMd } from '@ringcentral/spring-icon';
import clsx from 'clsx';

import type { DialpadPanelProps } from './DialpadPanel.interface';

/**
 * DialpadPanel - Keypad with Spring UI Drawer overlay.
 *
 * When collapsed, renders a 32px toggle bar with centered dial pad icon.
 * When expanded, opens a blocking bottom Drawer with close button,
 * dial text field, dial pad, and optional footer (call controls).
 */
export const DialpadPanel: FunctionComponent<DialpadPanelProps> = ({
  isOpen,
  value,
  onToggle,
  onChange,
  onKeyPress,
  footer,
  className,
  'data-sign': dataSign = 'dialpadPanel',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDialPadChange = useCallback(
    (digit: string) => {
      onChange(value + digit);
    },
    [onChange, value],
  );

  const handleTextFieldChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
    },
    [onChange],
  );

  const handleOpen = useCallback(() => {
    onToggle(true);
    setIsHovered(false);
  }, [onToggle]);

  const handleClose = useCallback(() => {
    onToggle(false);
    setIsHovered(false);
  }, [onToggle]);

  return (
    <div className={className} data-sign={dataSign}>
      {!isOpen && (
        <div
          className={clsx(
            'flex items-center justify-center h-8 cursor-pointer border-b border-neutral-b4 transition-colors',
            isHovered ? 'bg-neutral-b0/[0.08]' : 'bg-neutral-base',
          )}
          onClick={handleOpen}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-sign="keypadOpenButton"
        >
          <IconButton
            symbol={DialpadMd}
            size="small"
            variant="icon"
            color="neutral"
            TooltipProps={{ title: 'Keypad' }}
          />
        </div>
      )}
      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={handleClose}
        footer={footer}
        data-sign="keypadDrawer"
      >
        <div className="flex justify-end pt-2 pr-2">
          <IconButton
            symbol={Xmd}
            size="small"
            variant="icon"
            color="neutral"
            onClick={handleClose}
            data-sign="keypadCloseButton"
          />
        </div>
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
        <div className="flex justify-center px-4 py-2">
          <DialPad
            onChange={handleDialPadChange}
            size="medium"
            data-sign="keypadDialPad"
          />
        </div>
      </Drawer>
    </div>
  );
};
