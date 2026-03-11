/**
 * Props passed to the SessionInfoView component
 */
interface SessionInfoViewProps {
  className?: string;
}

/**
 * Session info item for display
 */
interface SessionInfoItem {
  label: string;
  value: string;
}

export type { SessionInfoViewProps, SessionInfoItem };
