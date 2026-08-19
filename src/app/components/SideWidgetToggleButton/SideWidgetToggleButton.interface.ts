export interface SideWidgetToggleButtonProps {
  /** Whether the side widget is currently shown. */
  visible: boolean;
  onToggle: () => void;
  /** Tooltip and accessible label, resolved by the hosting view. */
  label: string;
}
