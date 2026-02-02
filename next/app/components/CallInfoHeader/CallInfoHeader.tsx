import { Icon, Avatar } from '@ringcentral/spring-ui';
import { ProfileMd, IncomingCallMd, OutgoingCallMd } from '@ringcentral/spring-icon';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';

import { StatusBadge } from '../StatusBadge';
import type { CallInfoHeaderProps } from './CallInfoHeader.interface';

/**
 * CallInfoHeader - Displays call contact information with status
 *
 * Shows contact name, phone number, call direction, and status badge.
 * Used in active call views and call history.
 */
export const CallInfoHeader: FunctionComponent<CallInfoHeaderProps> = ({
  contactName,
  phoneNumber,
  status,
  direction,
  avatar,
  isOnHold = false,
  className,
  'data-sign': dataSign,
  actions,
}) => {
  const displayName = contactName || phoneNumber;
  const showPhoneNumber = contactName && phoneNumber !== contactName;

  // Determine the status to show
  const displayStatus = isOnHold ? 'onHold' : status;

  return (
    <div
      className={clsx('flex items-center gap-3 p-3', className)}
      data-sign={dataSign || 'callInfoHeader'}
    >
      {/* Avatar or default contact icon */}
      <div className="flex-shrink-0">
        {avatar || (
          <Avatar size="small">
            <Icon symbol={ProfileMd} size="medium" />
          </Avatar>
        )}
      </div>

      {/* Contact info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {/* Direction indicator */}
          {direction && (
            <Icon
              symbol={direction === 'inbound' ? IncomingCallMd : OutgoingCallMd}
              size="small"
              className={clsx(
                direction === 'inbound' ? 'text-primary-b' : 'text-success',
              )}
              data-sign={`direction-${direction}`}
            />
          )}

          {/* Contact name */}
          <span
            className="typography-subtitle text-neutral-b1 truncate"
            data-sign="contactName"
          >
            {displayName}
          </span>

          {/* Status badge */}
          {displayStatus && (
            <StatusBadge status={displayStatus} className="flex-shrink-0" />
          )}
        </div>

        {/* Phone number (if different from name) */}
        {showPhoneNumber && (
          <span
            className="typography-descriptor text-neutral-b2 truncate block"
            data-sign="phoneNumber"
          >
            {phoneNumber}
          </span>
        )}
      </div>

      {/* Action buttons */}
      {actions && <div className="flex-shrink-0 flex gap-1">{actions}</div>}
    </div>
  );
};
