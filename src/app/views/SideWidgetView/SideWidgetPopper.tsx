import React, { useContext, useRef, useState } from 'react';
import type { FunctionComponent, ReactNode } from 'react';
import { Popper, useOnReRender } from '@ringcentral/spring-ui';
import type { PopperActions } from '@ringcentral/spring-ui';
import {
  AppContext,
  AppExpandedContent,
  useAnnouncementHeight,
} from '@ringcentral-integration/micro-core/src/app/components';

/**
 * Container for the side widget panels.
 *
 * A local variant of micro-core's `ExpandedLayoutPopper`: one popper holding one
 * panel tree, anchored either to a probe placed in the root view's expanded slot
 * (`expanded`, i.e. there is room beside the main column) or to the app's
 * announcement anchor, where it covers the app instead.
 *
 * The addition is `visible`. Hiding the widget must not unmount the panels -
 * they own a live assistant iframe and in-progress script answers, and the agent
 * expects them exactly as they left them when they open the widget again - so a
 * hidden widget is display-none rather than removed. The popper cannot measure
 * itself while hidden, hence the explicit reposition when it comes back.
 */
export const SideWidgetPopper: FunctionComponent<{
  children?: ReactNode;
  expanded: boolean;
  visible: boolean;
}> = ({ children, expanded, visible }) => {
  const [expandedElm, setExpandedElm] = useState<HTMLDivElement | null>(null);
  const { announcementBottomAnchorRef } = useContext(AppContext);
  const announcementHeight = useAnnouncementHeight();
  const actionsRef = useRef<PopperActions>(null);

  useOnReRender(() => {
    actionsRef.current?.update();
  }, [announcementHeight, expanded, visible]);

  return (
    <>
      <Popper
        anchorEl={() =>
          expanded ? expandedElm : announcementBottomAnchorRef.current
        }
        placement="bottom"
        offset={0}
        matchAnchorWidth
        className={`z-drawer overflow-hidden bg-neutral-base ${
          visible ? '' : 'hidden'
        }`}
        style={{ height: `calc(100vh - ${announcementHeight}px)` }}
        actions={actionsRef}
        onClick={(e) => {
          // Matches micro-core: without this the host item behind the popper
          // receives the click too.
          e.stopPropagation();
        }}
      >
        {children}
      </Popper>

      <AppExpandedContent>
        <div
          ref={(elm) => {
            setExpandedElm(elm);
          }}
          className="h-0 w-full"
        ></div>
      </AppExpandedContent>
    </>
  );
};
