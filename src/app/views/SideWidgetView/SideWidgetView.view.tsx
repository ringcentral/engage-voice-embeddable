import React, { useEffect, useRef, useState } from 'react';
import {
  injectable,
  RcViewModule,
  Root,
  useConnector,
  type UIFunctions,
  type UIProps,
} from '@ringcentral-integration/next-core';
import { AppExpandedContent } from '@ringcentral-integration/micro-core/src/app/components';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { Tab, TabContext, Tabs } from '@ringcentral/spring-ui';

import { EvAgentScript } from '../../services/EvAgentScript';
import { EvCall } from '../../services/EvCall';
import { EvCallMonitor } from '../../services/EvCallMonitor';
import { EvPresence } from '../../services/EvPresence';
import {
  SIDE_WIDGET_IDS,
  SideWidget,
  type SideWidgetId,
} from '../../services/SideWidget';
import { AgentScriptPanel } from '../../components/AgentScriptPanel';

import type {
  SideWidgetViewUIFunctions,
  SideWidgetViewUIProps,
} from './SideWidgetView.interface';
import i18n, { type I18nKey } from './i18n';

/**
 * SideWidgetView - host for the app's expanded side area.
 *
 * Portals into the `expandedContent` slot of `SpringAppRootView`, which only
 * exists while `Root.expanded` is true (`SideWidget` toggles it). Widgets are
 * rendered as tabs once there is more than one, matching RingCentral
 * Embeddable's side drawer.
 */
@injectable({
  name: 'SideWidgetView',
})
class SideWidgetView extends RcViewModule {
  constructor(
    private root: Root,
    private sideWidget: SideWidget,
    private evAgentScript: EvAgentScript,
    private evCall: EvCall,
    private evPresence: EvPresence,
    private evCallMonitor: EvCallMonitor,
  ) {
    super();
  }

  /**
   * The side widget outlives the active call route, so it tracks the call being
   * worked on rather than whatever call a view happens to display.
   */
  get callId(): string {
    return this.evCall.activityCallId;
  }

  get currentCall() {
    const id = this.callId;
    if (!id) return null;
    const call = this.evPresence.callsMapping[id];
    if (!call) return null;
    const monitorCallId = this.evCallMonitor.getCallId(call.session || {});
    return this.evCallMonitor.callsMapping[monitorCallId] || call;
  }

  getUIProps(): UIProps<SideWidgetViewUIProps> {
    const callId = this.callId;
    return {
      expanded: this.root.expanded,
      widgets: this.sideWidget.widgets,
      currentWidgetId: this.sideWidget.currentWidgetId,
      callId,
      currentCall: this.currentCall,
      agentScript: this.evAgentScript.getScriptForCall(callId),
      agentScriptLoading: this.evAgentScript.getScriptLoading(callId),
      agentScriptError: this.evAgentScript.getScriptError(callId),
    };
  }

  getUIFunctions(): UIFunctions<SideWidgetViewUIFunctions> {
    return {
      setCurrentWidgetId: (widgetId) =>
        this.sideWidget.setCurrentWidgetId(widgetId),
      onAgentScriptResult: (callId, result) =>
        this.evAgentScript.updateScriptResult(callId, result),
      onAgentScriptDisposition: (callId, disposition) =>
        this.evAgentScript.updateDisposition(callId, disposition),
      getKnowledgeBaseArticles: (callId, groupIds) =>
        this.evAgentScript.getKnowledgeBaseArticles(callId, groupIds),
    };
  }

  /**
   * Map a widget id to its panel.
   *
   * To add a widget (e.g. the AI Assistant): reserve an id in
   * `SIDE_WIDGET_IDS`, add a branch here, and have the owning service call
   * `SideWidget.openWidget()`. An iframe-backed panel also needs its page
   * registered in `project.config.json` `pages[]` — `src/agentAssistant.html`
   * is not built today.
   */
  private renderWidget(
    widgetId: SideWidgetId | null,
    uiProps: SideWidgetViewUIProps,
    uiFunctions: SideWidgetViewUIFunctions,
  ) {
    if (widgetId !== SIDE_WIDGET_IDS.agentScript) return null;
    if (!uiProps.currentCall) return null;
    return (
      <AgentScriptPanel
        callId={uiProps.callId}
        call={uiProps.currentCall}
        script={uiProps.agentScript}
        loading={uiProps.agentScriptLoading}
        error={uiProps.agentScriptError}
        onResultChange={uiFunctions.onAgentScriptResult}
        onDisposition={uiFunctions.onAgentScriptDisposition}
        getKnowledgeBaseArticles={uiFunctions.getKnowledgeBaseArticles}
      />
    );
  }

  component() {
    const { t } = useLocale(i18n);
    const { current: uiFunctions } = useRef(this.getUIFunctions());
    const uiProps = useConnector(() => this.getUIProps());
    const { expanded, widgets, currentWidgetId } = uiProps;

    // `AppExpandedContent` portals into the root view's expanded container, and
    // `PortalWithCheckAgain` only retries mounting when its `children`/container
    // change — so if we hand it children in the same commit that creates the
    // container, the ref is still null and the panel never appears. Waiting one
    // commit after expansion guarantees the container is in the DOM first.
    const [containerReady, setContainerReady] = useState(false);
    useEffect(() => {
      setContainerReady(expanded);
    }, [expanded]);

    if (!expanded || !containerReady || widgets.length === 0) return null;

    const currentWidget =
      widgets.find((widget) => widget.id === currentWidgetId) ?? widgets[0];

    return (
      <AppExpandedContent>
        {/* The expanded slot is `position: relative` and scrolls its own
            content; absolute positioning keeps the panel exactly full height. */}
        <div
          data-sign="sideWidget"
          className="absolute inset-0 flex min-h-0 min-w-0 flex-col overflow-hidden bg-neutral-base"
        >
          <TabContext
            defaultValue={currentWidget.id}
            value={currentWidget.id}
            onChange={(_, value) =>
              void uiFunctions.setCurrentWidgetId(value as SideWidgetId)
            }
          >
            {widgets.length > 1 && (
              <Tabs variant="moreMenu" className="h-7 flex-none">
                {widgets.map((widget) => (
                  <Tab
                    id={widget.id}
                    key={widget.id}
                    value={widget.id}
                    data-sign={`${widget.id}Tab`}
                    label={t(widget.nameKey as I18nKey)}
                    className="flex-1"
                    classes={{ root: 'h-7 p-0 pl-2 pr-2 flex items-center' }}
                  />
                ))}
              </Tabs>
            )}
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              {this.renderWidget(currentWidget.id, uiProps, uiFunctions)}
            </div>
          </TabContext>
        </div>
      </AppExpandedContent>
    );
  }
}

export { SideWidgetView };
