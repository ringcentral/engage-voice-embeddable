import { Avatar, ListItem, ListItemText } from '@ringcentral/spring-ui';
import { IncomingCallMd, OutgoingCallMd } from '@ringcentral/spring-icon';
import type { FunctionComponent } from 'react';
import React from 'react';

import { StatusBadge } from '../StatusBadge';
import type { CallInfoHeaderProps } from './CallInfoHeader.interface';

/**
 * CallInfoHeader - Displays call contact information with status
 *
 * Uses Spring UI ListItem layout with direction icon as Avatar.
 * Shows contact name, phone number, status badge, and follow-up info.
 * Clickable to navigate to call details page.
 */
export const CallInfoHeader: FunctionComponent<CallInfoHeaderProps> = ({
  contactName,
  phoneNumber,
  status,
  direction,
  isOnHold = false,
  className,
  'data-sign': dataSign,
  actions,
  followInfos,
  secondaryTitle,
  onClick,
}) => {
  const displayName = contactName || phoneNumber;
  const showPhoneNumber = contactName && phoneNumber !== contactName;
  const displayStatus = isOnHold ? 'onHold' : status;
  const isInbound = direction === 'inbound';
  const DirectionIcon = isInbound ? IncomingCallMd : OutgoingCallMd;

  const primaryContent = (
    <span className="flex items-center gap-2">
      <span
        className="typography-subtitle text-neutral-b1 truncate"
        data-sign="contactName"
      >
        {displayName}
      </span>
      {displayStatus && (
        <StatusBadge status={displayStatus} className="flex-shrink-0" />
      )}
    </span>
  );

  const secondaryParts: string[] = [];
  if (showPhoneNumber) {
    secondaryParts.push(phoneNumber);
  }
  if (followInfos && followInfos.length > 0) {
    secondaryParts.push(...followInfos);
  }
  const secondaryContent =
    secondaryParts.length > 0 ? (
      <span
        className="typography-descriptor text-neutral-b2 truncate"
        data-sign="secondaryInfo"
        title={secondaryTitle}
      >
        {secondaryParts.join(' | ')}
      </span>
    ) : null;

  return (
    <ListItem
      clickable={!!onClick}
      onClick={onClick}
      divider
      className={className}
      data-sign={dataSign || 'callInfoHeader'}
      hoverable={false}
      size="large"
    >
      {direction && (
        <Avatar
          size="small"
          classes={{ content: 'bg-neutral-b5 text-neutral-b2' }}
        >
          <DirectionIcon />
        </Avatar>
      )}
      <ListItemText
        primary={primaryContent}
        secondary={secondaryContent}
      />
      {actions}
    </ListItem>
  );
};
