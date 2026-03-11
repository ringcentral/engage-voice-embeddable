/**
 * Options for ChooseAccountView customization
 */
interface ChooseAccountViewOptions {
  onAccountSelected?: (agentId: string) => void;
}

/**
 * Props passed to the ChooseAccountView component
 */
interface ChooseAccountViewProps {
  className?: string;
}

export type { ChooseAccountViewOptions, ChooseAccountViewProps };
