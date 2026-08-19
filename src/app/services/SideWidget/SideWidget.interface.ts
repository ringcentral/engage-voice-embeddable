/**
 * Ids of the widgets that can be hosted in the app's expanded side area.
 *
 * Adding a widget means: register an id here, teach `SideWidgetView` how to
 * render it, and have the owning service call `SideWidget.openWidget()`.
 */
export const SIDE_WIDGET_IDS = {
  agentScript: 'agentScript',
  agentAssistant: 'agentAssistant',
} as const;

export type SideWidgetId = (typeof SIDE_WIDGET_IDS)[keyof typeof SIDE_WIDGET_IDS];

export interface SideWidgetOptions {
  /**
   * The embedding page declares that it grows the frame when the widget asks
   * for the wider layout, so the widget can lay itself out beside the main
   * column right away instead of first measuring whether the room appeared.
   *
   * Set from the `enableSideWidget` URL parameter.
   */
  enableSideWidget?: boolean;
}

export interface SideWidgetItem {
  id: SideWidgetId;
  /**
   * i18n key resolved by `SideWidgetView`, not a literal label. The widget list
   * lives in shared (worker) state, so it must stay locale independent.
   */
  nameKey: string;
  params?: Record<string, unknown>;
}
