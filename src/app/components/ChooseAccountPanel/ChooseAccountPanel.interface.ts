import type { EvAgent } from '../../services/EvClient/interfaces';

/**
 * Props for ChooseAccountPanel component
 */
interface ChooseAccountPanelProps {
  /** List of agents to display */
  agents: EvAgent[];
  /** Whether the panel is in loading state */
  isLoading?: boolean;
  /** Callback when an agent is selected */
  onSelectAgent: (agentId: string) => void;
  /** Logo URL to display in the header */
  logoUrl?: string;
  /** Brand name to display when logo is not available */
  brandName?: string;
  /** Title text for the panel */
  title: string;
}

export type { ChooseAccountPanelProps };
