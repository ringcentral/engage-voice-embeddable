/**
 * Options for SessionUpdateView customization
 */
interface SessionUpdateViewOptions {
  onUpdateComplete?: () => void;
  onCancel?: () => void;
}

/**
 * Props passed to the SessionUpdateView component
 */
interface SessionUpdateViewProps {
  className?: string;
}

export type { SessionUpdateViewOptions, SessionUpdateViewProps };
