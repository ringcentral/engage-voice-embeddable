import { ListItem, ListItemText } from '@ringcentral/spring-ui';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';

import type { SelectableListItemProps } from './SelectableListItem.interface';

/**
 * SelectableListItem - A clickable list item with selection state
 *
 * Uses Spring UI ListItem and ListItemText components
 * Supports primary/secondary text, selection state, and hover actions
 */
export const SelectableListItem: FunctionComponent<SelectableListItemProps> = ({
  primary,
  secondary,
  selected = false,
  disabled = false,
  onClick,
  className,
  'data-sign': dataSign,
  size = 'large',
  divider = true,
  hoverActions,
  leading,
  trailing,
}) => {
  return (
    <ListItem
      className={clsx(
        'cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      selected={selected}
      clickable={!disabled}
      hoverable={!disabled}
      onClick={disabled ? undefined : onClick}
      data-sign={dataSign}
      size={size}
      divider={divider}
      hoverActions={hoverActions}
    >
      {leading && <div className="mr-3 flex-shrink-0">{leading}</div>}
      <ListItemText
        primary={primary}
        secondary={secondary}
        className="flex-1 min-w-0"
      />
      {trailing && <div className="ml-3 flex-shrink-0">{trailing}</div>}
    </ListItem>
  );
};
