import {
  action,
  delegate,
  injectable,
  optional,
  PortManager,
  RcModule,
  Root,
  state,
  watch,
} from '@ringcentral-integration/next-core';

import { Adapter } from '../Adapter';

import type {
  SideWidgetId,
  SideWidgetItem,
  SideWidgetOptions,
} from './SideWidget.interface';

/**
 * Host for the app's expanded side area.
 *
 * Owns an ordered list of widgets rendered by `SideWidgetView` as tabs (tabs are
 * only shown once there is more than one widget).
 *
 * There are two independent questions here:
 *
 * - *Should the widget be on screen at all?* — `shouldShow`, i.e. some widget is
 *   registered and the agent has not hidden it. Widgets are registered and
 *   dropped by the owning services; `visible` is the agent's own intent and is
 *   deliberately separate, because those services react to `watch(...)` changes
 *   and would never re-open a widget the user had removed from the list.
 * - *Is there room to show it beside the main column?* — `expandLayout`. Only
 *   then do we expand the in-app layout (`Root.expanded`, consumed by
 *   `SpringAppRootView`) and ask the host page to widen the frame
 *   (`Adapter.setExpanded`). Otherwise `SideWidgetView` renders the same panels
 *   as an overlay on top of the app and the frame is left alone — asking a host
 *   that cannot grow only strands the widget off screen.
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
    private portManager: PortManager,
    @optional('SideWidgetOptions')
    private sideWidgetOptions?: SideWidgetOptions,
  ) {
    super();
    if (this.portManager?.shared) {
      this.portManager.onServer(() => this.initialize());
    } else {
      this.initialize();
    }
  }

  private initialize(): void {
    // A host can flip its opinion at any time, including after a widget has
    // already been registered, so re-apply the layout whenever it changes.
    watch(
      this,
      () => this.adapter.sideWidgetExtendedOverride,
      () => {
        void this._applyLayout();
      },
    );
  }

  /**
   * Set while a widget is registered but held back purely for lack of room, so
   * that room arriving later can show it - and so that a widget the agent put
   * away is never reopened behind their back.
   */
  private _hiddenForNoRoom = false;

  @state
  widgets: SideWidgetItem[] = [];

  @state
  currentWidgetId: SideWidgetId | null = null;

  /** Agent intent: whether a registered widget is shown or hidden away. */
  @state
  visible = true;

  /**
   * Whether the viewport is wide enough for the side-by-side layout, reported by
   * the client (`useSideWidgetLayout`) because only it can measure a window.
   */
  @state
  canExpandLayout = true;

  get hasWidgets(): boolean {
    return this.widgets.length > 0;
  }

  get shouldShow(): boolean {
    return this.hasWidgets && this.visible;
  }

  /**
   * Whether to lay the widget out beside the main column.
   *
   * A host that says so at runtime is taken at its word either way. Otherwise
   * the declared `enableSideWidget` support is enough on its own: it is a
   * promise that asking for the wider frame will be honoured, which is what
   * breaks the deadlock of only expanding once room has already appeared. The
   * measurement then covers hosts that make room without declaring anything.
   */
  get expandLayout(): boolean {
    const override = this.adapter.sideWidgetExtendedOverride;
    if (override !== null && override !== undefined) return override;
    return !!this.sideWidgetOptions?.enableSideWidget || this.canExpandLayout;
  }

  /** True while the widget covers the main app content instead of sitting beside it. */
  get overlayOpen(): boolean {
    return this.shouldShow && !this.expandLayout;
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

  @action
  private _setVisible(visible: boolean) {
    this.visible = visible;
  }

  @action
  private _setCanExpandLayout(canExpandLayout: boolean) {
    this.canExpandLayout = canExpandLayout;
  }

  @delegate('server')
  async openWidget(widget: SideWidgetItem): Promise<void> {
    if (this.expandLayout) {
      // There is room beside the main column, so a widget arriving for a new
      // call is worth showing even if the agent hid the previous one.
      this._hiddenForNoRoom = false;
      this._setVisible(true);
    } else if (!this.hasWidgets) {
      // Without that room the widget can only cover the call screen, which is
      // not something to do unasked - register it and let the agent open it
      // from the toggle. A widget joining one already on screen leaves it be.
      this._hiddenForNoRoom = true;
      this._setVisible(false);
    }
    // Move to front and dedupe by id, so re-opening an existing widget just
    // selects it instead of stacking a duplicate tab. Published before the
    // layout is applied so the host is told a widget exists, which is what may
    // win us the room to lay it out beside the main column.
    const widgets = [widget].concat(
      this.widgets.filter((w) => w.id !== widget.id),
    );
    this._setWidgets(widgets, widget.id);
    await this._syncLayout();
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
    await this._syncLayout();
  }

  @delegate('server')
  async setCurrentWidgetId(widgetId: SideWidgetId): Promise<void> {
    if (!this.hasWidget(widgetId)) return;
    this._setCurrentWidgetId(widgetId);
  }

  /**
   * Hide or re-show the widgets without dropping them: the services that own
   * them only react to availability changes, so removing entries here would
   * make the agent's own "close" permanent for the rest of the call.
   */
  @delegate('server')
  async setVisible(visible: boolean): Promise<void> {
    if (this.visible === visible) return;
    // The agent has taken a position; room arriving later must not override it.
    this._hiddenForNoRoom = false;
    this._setVisible(visible);
    await this._syncLayout();
  }

  @delegate('server')
  async toggleVisible(): Promise<void> {
    await this.setVisible(!this.visible);
  }

  @delegate('server')
  async setCanExpandLayout(canExpandLayout: boolean): Promise<void> {
    if (this.canExpandLayout === canExpandLayout) return;
    this._setCanExpandLayout(canExpandLayout);
    // With no widget registered there is no layout to re-apply, and touching
    // the frame here would fight the user's own resize.
    if (!this.hasWidgets) return;
    await this._applyLayout();
  }

  @delegate('server')
  async clearWidgets(): Promise<void> {
    if (this.widgets.length === 0) return;
    this._setWidgets([], null);
    this._hiddenForNoRoom = false;
    this._setVisible(true);
    await this._syncExpanded(false);
  }

  /**
   * React to the amount of room changing, from either the client's measurement
   * or the host's explicit override. A widget only held back because it had
   * nowhere to go is shown as soon as it does.
   */
  private async _applyLayout(): Promise<void> {
    if (this._hiddenForNoRoom && this.expandLayout && this.hasWidgets) {
      this._hiddenForNoRoom = false;
      this._setVisible(true);
    }
    await this._syncLayout();
  }

  private async _syncLayout(): Promise<void> {
    await this._syncExpanded(this.shouldShow);
  }

  private _lastNotified: string | null = null;

  private async _syncExpanded(show: boolean): Promise<void> {
    // What the host needs to hear is that a widget *wants* room, not that one is
    // already on screen. With no room we hold the widget back, so reporting
    // visibility alone would deadlock: the host never makes room, so the widget
    // never shows, so the host is never told to make room. `visible` rides along
    // for hosts that want to mirror the state.
    const open = this.hasWidgets;
    const notified = `${open}/${show}`;
    if (this._lastNotified !== notified) {
      this._lastNotified = notified;
      await this.adapter.notifySideWidgetOpen(open, show);
    }
    const expanded = show && this.expandLayout;
    await this.root.setExpanded(expanded);
    await this.adapter.setExpanded(expanded);
  }
}

export { SideWidget };
