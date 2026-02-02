import { ListItem, ListItemText, IconButton, Button, Tooltip } from '@ringcentral/spring-ui';
import { CallMd, ViewMd, MissedCallMd } from '@ringcentral/spring-icon';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';

import type { LeadItemProps } from './LeadItem.interface';

/**
 * LeadItem - Displays a lead with contact info and action buttons
 *
 * Shows lead name, phone numbers, and action buttons for:
 * - Dialing (single phone number)
 * - View lead
 * - Manual pass
 */
export const LeadItem: FunctionComponent<LeadItemProps> = ({
  lead,
  phoneNumbers,
  displayName,
  allowDial = true,
  isDialing = false,
  disabled = false,
  onDial,
  onViewLead,
  onManualPass,
  showViewLeadButton = false,
  showManualPassButton = false,
  disableManualPass = false,
  hoverActions,
  className,
  'data-sign': dataSign,
}) => {
  const isButtonDisabled = disabled || isDialing || !allowDial;

  const defaultHoverActions = (
    <div className="flex items-center gap-1">
      {/* Single dial button when only one phone number */}
      {phoneNumbers.length === 1 && onDial && (
        <Tooltip content="Call">
          <IconButton
            symbol={CallMd}
            size="small"
            variant="contained"
            color="success"
            disabled={isButtonDisabled}
            onClick={() => onDial(phoneNumbers[0].destination)}
            data-sign="dialButton"
          />
        </Tooltip>
      )}

      {/* View lead button */}
      {showViewLeadButton && onViewLead && (
        <Tooltip content="View Lead">
          <IconButton
            symbol={ViewMd}
            size="small"
            variant="outlined"
            color="neutral"
            onClick={onViewLead}
            data-sign="viewLeadButton"
          />
        </Tooltip>
      )}

      {/* Manual pass button */}
      {showManualPassButton && onManualPass && (
        <Tooltip content="Manual Pass">
          <IconButton
            symbol={MissedCallMd}
            size="small"
            variant="outlined"
            color="danger"
            disabled={disableManualPass || isButtonDisabled}
            onClick={onManualPass}
            data-sign="manualPassButton"
          />
        </Tooltip>
      )}
    </div>
  );

  return (
    <ListItem
      className={clsx('border-b border-neutral-b4', className)}
      data-sign={dataSign || `leadItem-${lead.leadId}`}
      hoverable
      hoverActions={hoverActions || defaultHoverActions}
      divider={false}
    >
      <ListItemText
        primary={
          <span className="typography-subtitle text-neutral-b1 truncate">
            {displayName || 'Unknown'}
          </span>
        }
        secondary={
          <div className="flex flex-col gap-0.5 mt-1">
            {phoneNumbers.map((phone) => (
              <Button
                key={phone.destination}
                variant="text"
                size="small"
                onClick={() => onDial?.(phone.destination)}
                disabled={isButtonDisabled}
                className="justify-start p-0 text-left"
                data-sign="phoneNumberButton"
              >
                <span className="typography-descriptor text-primary-b hover:underline">
                  {phone.formatted}
                </span>
              </Button>
            ))}
          </div>
        }
      />
    </ListItem>
  );
};
