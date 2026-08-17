import {
  action,
  delegate,
  injectable,
  RcModule,
  Root,
  state,
} from '@ringcentral-integration/next-core';

import { Adapter } from '../Adapter';

import type { SideWidgetId, SideWidgetItem } from './SideWidget.interface';

/**
 * Host for the app's expanded side area.
 *
 * Owns an ordered list of widgets rendered by `SideWidgetView` as tabs (tabs are
 * only shown once there is more than one widget). Opening the first widget
 * expands both the in-app layout (`Root.expanded`, consumed by
 * `SpringAppRootView`) and the host page frame (`Adapter.setExpanded`); closing
 * the last one collapses them again.
 *
 * State is shared, so every browser tab connected to the shared worker shows the
 * same widgets. Mutations are delegated to the server for that reason.
 */
@injectable({
  name: 'SideWidget',
})
class SideWidget extends RcModule {
  constructor(
    private root: Root,
    private adapter: Adapter,
  ) {
    super();
  }

  @state
  widgets: SideWidgetItem[] = [];

  @state
  currentWidgetId: SideWidgetId | null = null;

  get expanded(): boolean {
    return this.widgets.length > 0;
  }

  get currentWidget(): SideWidgetItem | null {
    return this.widgets.find((w) => w.id === this.currentWidgetId) ?? null;
  }

  hasWidget(widgetId: SideWidgetId): boolean {
    return this.widgets.some((w) => w.id === widgetId);
  }

  @action
  private _setWidgets(widgets: SideWidgetItem[], currentWidgetId: SideWidgetId | null) {
    this.widgets = widgets;
    this.currentWidgetId = currentWidgetId;
  }

  @action
  private _setCurrentWidgetId(widgetId: SideWidgetId | null) {
    this.currentWidgetId = widgetId;
  }

  @delegate('server')
  async openWidget(widget: SideWidgetItem): Promise<void> {
    // Expand before publishing the widget so the expanded container is already
    // on screen when `SideWidgetView` portals into it.
    await this._syncExpanded(true);
    // Move to front and dedupe by id, so re-opening an existing widget just
    // selects it instead of stacking a duplicate tab.
    const widgets = [widget].concat(
      this.widgets.filter((w) => w.id !== widget.id),
    );
    this._setWidgets(widgets, widget.id);
  }

  @delegate('server')
  async closeWidget(widgetId: SideWidgetId): Promise<void> {
    const index = this.widgets.findIndex((w) => w.id === widgetId);
    if (index === -1) return;

    const widgets = this.widgets.filter((w) => w.id !== widgetId);
    let currentWidgetId = this.currentWidgetId;
    if (currentWidgetId === widgetId) {
      // Select the neighbour that took the closed widget's place, else the last.
      currentWidgetId =
        widgets.length === 0
          ? null
          : widgets[Math.min(index, widgets.length - 1)].id;
    }
    this._setWidgets(widgets, currentWidgetId);
    await this._syncExpanded(this.expanded);
  }

  @delegate('server')
  async setCurrentWidgetId(widgetId: SideWidgetId): Promise<void> {
    if (!this.hasWidget(widgetId)) return;
    this._setCurrentWidgetId(widgetId);
  }

  @delegate('server')
  async clearWidgets(): Promise<void> {
    if (this.widgets.length === 0) return;
    this._setWidgets([], null);
    await this._syncExpanded(false);
  }

  private async _syncExpanded(expanded: boolean): Promise<void> {
    await this.root.setExpanded(expanded);
    await this.adapter.setExpanded(expanded);
  }
}

export { SideWidget };
