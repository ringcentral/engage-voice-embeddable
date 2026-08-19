import React, { useEffect, useRef, useState } from 'react';
import {
  injectable,
  RcViewModule,
  Root,
  useConnector,
  type UIFunctions,
  type UIProps,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { IconButton, Tab, TabContext, Tabs } from '@ringcentral/spring-ui';
import { CaretLeftMd } from '@ringcentral/spring-icon';
import { PageHeader } from '@ringcentral-integration/next-widgets/components';

import { EvAgentAssistant } from '../../services/EvAgentAssistant';
import { EvAgentScript } from '../../services/EvAgentScript';
import { EvCall } from '../../services/EvCall';
import { EvCallMonitor } from '../../services/EvCallMonitor';
import { EvPresence } from '../../services/EvPresence';
import {
  SIDE_WIDGET_IDS,
  SideWidget,
  type SideWidgetId,
} from '../../services/SideWidget';
import { AgentAssistantPanel } from '../../components/AgentAssistantPanel';
import { AgentScriptPanel } from '../../components/AgentScriptPanel';

import type {
  SideWidgetViewUIFunctions,
  SideWidgetViewUIProps,
} from './SideWidgetView.interface';
import { SideWidgetPopper } from './SideWidgetPopper';
import { useSideWidgetLayout } from './useSideWidgetLayout';
import i18n, { type I18nKey } from './i18n';

/**
 * SideWidgetView - host for the app's expanded side area.
 *
 * `ExpandedLayoutPopper` renders one panel tree either into the root view's
 * `expandedContent` slot (when `Root.expanded`, i.e. the frame has room beside
 * the main column) or as a full-app overlay when it does not. Because it is the
 * same tree in both cases, switching between the two only repositions the popper
 * — nothing remounts, which matters for panels holding a live iframe session.
 *
 * Widgets are rendered as tabs once there is more than one, matching RingCentral
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
    private evAgentAssistant: EvAgentAssistant,
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
      visible: this.sideWidget.visible,
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
      setVisible: (visible) => this.sideWidget.setVisible(visible),
      setCanExpandLayout: (canExpandLayout) =>
        this.sideWidget.setCanExpandLayout(canExpandLayout),
      onAgentScriptResult: (callId, result) =>
        this.evAgentScript.updateScriptResult(callId, result),
      onAgentScriptDisposition: (callId, disposition) =>
        this.evAgentScript.updateDisposition(callId, disposition),
      getKnowledgeBaseArticles: (callId, groupIds) =>
        this.evAgentScript.getKnowledgeBaseArticles(callId, groupIds),
      getAgentAssistantParams: (callId) =>
        this.evAgentAssistant.getFrameParams(callId),
    };
  }

  /**
   * Map a widget id to its panel.
   *
   * To add a widget: reserve an id in `SIDE_WIDGET_IDS`, add a branch here, and
   * have the owning service call `SideWidget.openWidget()`. A panel backed by a
   * local page also needs that page shipped by `project.config.json`.
   *
   * Panels never draw their own title here: this view owns the header row, so a
   * panel heading would just repeat the tab label or the title above it.
   */
  private renderWidget(
    widgetId: SideWidgetId | null,
    uiProps: SideWidgetViewUIProps,
    uiFunctions: SideWidgetViewUIFunctions,
  ) {
    if (!uiProps.callId) return null;

    if (widgetId === SIDE_WIDGET_IDS.agentAssistant) {
      return (
        <AgentAssistantPanel
          key={uiProps.callId}
          callId={uiProps.callId}
          showTitle={false}
          getParams={uiFunctions.getAgentAssistantParams}
        />
      );
    }

    if (widgetId !== SIDE_WIDGET_IDS.agentScript) return null;
    if (!uiProps.currentCall) return null;
    return (
      <AgentScriptPanel
        callId={uiProps.callId}
        call={uiProps.currentCall}
        showTitle={false}
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
    const { expanded, visible, widgets, currentWidgetId } = uiProps;

    useSideWidgetLayout(uiFunctions.setCanExpandLayout);

    const currentWidget = widgets.length
      ? (widgets.find((widget) => widget.id === currentWidgetId) ?? widgets[0])
      : null;

    // A panel is mounted the first time its tab is selected and then kept in the
    // DOM (hidden) while another tab is on top: panels hold live state - an
    // assistant session, script answers - that a remount would throw away.
    const [mountedIds, setMountedIds] = useState<SideWidgetId[]>([]);
    const currentId = currentWidget?.id;
    useEffect(() => {
      if (!currentId) return;
      setMountedIds((ids) =>
        ids.includes(currentId) ? ids : [...ids, currentId],
      );
    }, [currentId]);

    // Rendered whenever a widget is registered, hidden or not: `SideWidgetPopper`
    // hides it with display-none so the panels keep their live state.
    if (!currentWidget) return null;

    const showTabs = widgets.length > 1;

    return (
      <SideWidgetPopper expanded={!!expanded} visible={!!visible}>
        <div
          data-sign="sideWidget"
          className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-neutral-base"
        >
          <TabContext
            defaultValue={currentWidget.id}
            value={currentWidget.id}
            onChange={(_, value) =>
              void uiFunctions.setCurrentWidgetId(value as SideWidgetId)
            }
          >
            {/* Beside the main column the widget is part of the layout and the
                call screen's own toggle puts it away, so it needs no dismissal
                of its own. Over the app it is a page the agent navigated into,
                and backing out of it is the expected way home - but a full
                header just to hold a back arrow wastes the top of a panel that
                is already short, so with tabs the arrow rides the tab row. */}
            {!expanded && !showTabs && (
              <PageHeader
                className="flex-none border-b border-neutral-b4"
                onBackClick={() => void uiFunctions.setVisible(false)}
              >
                {t(currentWidget.nameKey as I18nKey)}
              </PageHeader>
            )}
            {showTabs ? (
              <div className="flex flex-none items-center border-b border-neutral-b4">
                {!expanded && (
                  <IconButton
                    symbol={CaretLeftMd}
                    size="small"
                    variant="icon"
                    color="neutral"
                    onClick={() => void uiFunctions.setVisible(false)}
                    data-sign="sideWidgetBackButton"
                    TooltipProps={{ title: t('back') }}
                    className="mx-1 flex-none"
                  />
                )}
                <Tabs variant="moreMenu" className="h-7 min-w-0 flex-auto">
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
              </div>
            ) : (
              expanded && (
                <div className="flex h-12 flex-none items-center border-b border-neutral-b4 px-4">
                  <h2 className="typography-title text-neutral-b0">
                    {t(currentWidget.nameKey as I18nKey)}
                  </h2>
                </div>
              )
            )}
            {widgets
              .filter((widget) => mountedIds.includes(widget.id))
              .map((widget) => (
                <div
                  key={widget.id}
                  className={`min-h-0 min-w-0 flex-1 overflow-hidden ${
                    widget.id === currentWidget.id ? 'flex' : 'hidden'
                  }`}
                >
                  {this.renderWidget(widget.id, uiProps, uiFunctions)}
                </div>
              ))}
          </TabContext>
        </div>
      </SideWidgetPopper>
    );
  }
}

export { SideWidgetView };
