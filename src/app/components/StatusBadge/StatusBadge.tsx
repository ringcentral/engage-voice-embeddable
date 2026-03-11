import { Tag } from '@ringcentral/spring-ui';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';

import type { CallStatus, StatusBadgeProps, StatusConfig } from './StatusBadge.interface';

/**
 * Status configuration mapping for call statuses
 */
const statusConfigMap: Record<CallStatus, StatusConfig> = {
  active: {
    label: 'Active',
    color: 'success',
    variant: 'filled',
  },
  onHold: {
    label: 'On Hold',
    color: 'warning',
    variant: 'filled',
  },
  inbound: {
    label: 'Inbound',
    color: 'primary',
    variant: 'outlined',
  },
  outbound: {
    label: 'Outbound',
    color: 'secondary',
    variant: 'outlined',
  },
  ringing: {
    label: 'Ringing',
    color: 'primary',
    variant: 'filled',
  },
  ended: {
    label: 'Ended',
    color: 'neutral',
    variant: 'outlined',
  },
};

/**
 * StatusBadge - Displays call status indicator badges
 *
 * Uses Spring UI Tag component with predefined colors for call statuses:
 * - active: green/success
 * - onHold: orange/warning
 * - inbound: blue/primary
 * - outbound: purple/secondary
 * - ringing: blue/primary filled
 * - ended: gray/neutral
 */
export const StatusBadge: FunctionComponent<StatusBadgeProps> = ({
  status,
  label,
  className,
  'data-sign': dataSign,
}) => {
  const config = statusConfigMap[status];

  return (
    <Tag
      label={label || config.label}
      color={config.color}
      variant={config.variant}
      className={clsx('flex-shrink-0', className)}
      data-sign={dataSign || `status-badge-${status}`}
    />
  );
};
