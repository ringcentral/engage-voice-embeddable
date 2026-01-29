/**
 * Options for SettingsView customization
 */
interface SettingsViewOptions {
  version?: string;
  onLogout?: () => void;
}

/**
 * Props passed to the SettingsView component
 */
interface SettingsViewProps {
  className?: string;
}

export type { SettingsViewOptions, SettingsViewProps };
