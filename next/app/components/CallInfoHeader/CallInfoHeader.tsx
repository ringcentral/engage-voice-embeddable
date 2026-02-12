import { Icon, Avatar, IconButton, Tooltip } from '@ringcentral/spring-ui';
import { ProfileMd, IncomingCallMd, OutgoingCallMd, CopyMd } from '@ringcentral/spring-icon';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React, { useCallback, useState } from 'react';

import { StatusBadge } from '../StatusBadge';
import type { CallInfoHeaderProps } from './CallInfoHeader.interface';

/**
 * Copy text to clipboard and invoke callback
 */
const copyToClipboard = async (text: string, name: string, onCopySuccess?: (name: string) => void) => {
  try {
    await navigator.clipboard.writeText(text);
    onCopySuccess?.(name);
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    onCopySuccess?.(name);
  }
};

/**
 * CallInfoHeader - Displays call contact information with status
 *
 * Shows contact name, phone number, call direction, status badge,
 * follow-up info, and copyable call metadata.
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
  followInfos,
  callInfos,
  onCopySuccess,
}) => {
  const displayName = contactName || phoneNumber;
  const showPhoneNumber = contactName && phoneNumber !== contactName;
  const displayStatus = isOnHold ? 'onHold' : status;
  const [isExpanded, setIsExpanded] = useState(false);
  const hasCallInfos = callInfos && callInfos.length > 0;

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div
      className={clsx('border-b border-neutral-b4', className)}
      data-sign={dataSign || 'callInfoHeader'}
    >
      {/* Main header row */}
      <div className="flex items-center gap-3 p-3">
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
          {/* Follow infos (formatted number, queue name) */}
          {followInfos && followInfos.length > 0 && (
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {followInfos.map((info, index) => (
                <span
                  key={index}
                  className="typography-descriptor text-neutral-b3"
                  data-sign={`followInfo-${index}`}
                >
                  {info}
                  {index < followInfos.length - 1 && (
                    <span className="text-neutral-b4 mx-1">|</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Action buttons */}
        {actions && <div className="flex-shrink-0 flex gap-1">{actions}</div>}
      </div>
      {/* Expandable call info details */}
      {hasCallInfos && (
        <div className="px-3 pb-2">
          <button
            type="button"
            className="typography-descriptorMini text-primary-b hover:underline cursor-pointer"
            onClick={toggleExpanded}
            data-sign="toggleCallInfos"
          >
            {isExpanded ? 'Hide details' : 'Show details'}
          </button>
          {isExpanded && (
            <div className="mt-2 space-y-1" data-sign="callInfoDetails">
              {callInfos.map((info) => (
                <div
                  key={info.attr}
                  className="flex items-center justify-between gap-2"
                  data-sign={`callInfo-${info.attr}`}
                >
                  <span className="typography-descriptorMini text-neutral-b3 flex-shrink-0">
                    {info.name}
                  </span>
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="typography-descriptorMini text-neutral-b1 truncate">
                      {info.content}
                    </span>
                    {onCopySuccess && (
                      <Tooltip title="Copy">
                        <IconButton
                          symbol={CopyMd}
                          size="xsmall"
                          variant="plain"
                          onClick={() => copyToClipboard(info.content, info.name, onCopySuccess)}
                          data-sign={`copy-${info.attr}`}
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
