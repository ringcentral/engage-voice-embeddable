import React from 'react';
import type { FunctionComponent } from 'react';
import { IconButton } from '@ringcentral/spring-ui';
import { CollapseLeftMd, CollapseRightMd } from '@ringcentral/spring-icon';

import type { SideWidgetToggleButtonProps } from './SideWidgetToggleButton.interface';

/**
 * Header action that shows or hides the side widget.
 *
 * Rendered on the routes an agent works a call from, so a widget hidden on one
 * of them can be brought back from any of the others - the owning services only
 * re-open a widget when its availability changes, never because the agent moved
 * between screens.
 */
export const SideWidgetToggleButton: FunctionComponent<
  SideWidgetToggleButtonProps
> = ({ visible, onToggle, label }) => (
  <IconButton
    // The arrow points where the click sends the widget: out to the right when
    // it is on screen, back in from the right when it is not.
    symbol={visible ? CollapseLeftMd : CollapseRightMd}
    onClick={onToggle}
    size="medium"
    variant="contained"
    color="secondary"
    data-sign="toggleSideWidgetButton"
    TooltipProps={{ title: label }}
  />
);
