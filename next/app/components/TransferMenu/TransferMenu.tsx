import { Menu, MenuItem } from '@ringcentral/spring-ui';
import type { FunctionComponent } from 'react';
import React from 'react';

import type { TransferMenuProps } from './TransferMenu.interface';

/**
 * TransferMenu - Dropdown menu with transfer call options
 *
 * Provides 4 transfer options: Internal Transfer, Phone Book Transfer,
 * Queue Transfer, and Enter a Number.
 */
export const TransferMenu: FunctionComponent<TransferMenuProps> = ({
  anchorEl,
  isOpen,
  onClose,
  onSelect,
  allowTransferCall = true,
  allowRequeueCall = true,
  disableInternalTransfer = false,
  labels = {},
  'data-sign': dataSign = 'transferMenu',
}) => {
  const handleSelect = (option: 'internal' | 'phoneBook' | 'queue' | 'manualEntry') => {
    onSelect(option);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      data-sign={dataSign}
    >
      <MenuItem
        onClick={() => handleSelect('internal')}
        disabled={!allowTransferCall || disableInternalTransfer}
        data-sign="transferItem-internalTransfer"
      >
        {labels.internalTransfer || 'Internal transfer'}
      </MenuItem>
      <MenuItem
        onClick={() => handleSelect('phoneBook')}
        disabled={!allowTransferCall}
        data-sign="transferItem-phoneBookTransfer"
      >
        {labels.phoneBookTransfer || 'Phone book transfer'}
      </MenuItem>
      <MenuItem
        onClick={() => handleSelect('queue')}
        disabled={!allowRequeueCall}
        data-sign="transferItem-queueTransfer"
      >
        {labels.queueTransfer || 'Queue transfer'}
      </MenuItem>
      <MenuItem
        onClick={() => handleSelect('manualEntry')}
        disabled={!allowTransferCall}
        data-sign="transferItem-enterANumber"
      >
        {labels.enterANumber || 'Enter a number'}
      </MenuItem>
    </Menu>
  );
};
