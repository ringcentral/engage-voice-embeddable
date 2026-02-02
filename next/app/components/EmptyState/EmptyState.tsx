import { EmptyState as SpringEmptyState } from '@ringcentral/spring-ui';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';

import type { EmptyStateProps } from './EmptyState.interface';

/**
 * EmptyState - Displays a centered "no data" message with optional icon and actions
 *
 * Wraps Spring UI EmptyState component with consistent styling for Engage Voice
 */
export const EmptyState: FunctionComponent<EmptyStateProps> = ({
  title,
  description,
  icon,
  actions,
  className,
  'data-sign': dataSign,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center h-full p-4',
        className,
      )}
      data-sign={dataSign}
    >
      <SpringEmptyState
        title={title}
        description={description}
        icon={icon}
        actions={actions}
      />
    </div>
  );
};
