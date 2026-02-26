import type { EvDirectAgentListItem } from '../../services/EvTransferCall/EvTransferCall.interface';

/**
 * Options for TransferInternalView customization
 */
interface TransferInternalViewOptions {
  onTransferComplete?: () => void;
  onCancel?: () => void;
}

/**
 * Props passed to the TransferInternalView component
 */
interface TransferInternalViewProps {
  id?: string;
}

/**
 * TransferInternalView UI state props (returned by getUIProps)
 */
interface TransferInternalViewUIProps {
  agentList: EvDirectAgentListItem[];
}

/**
 * TransferInternalView UI action functions (returned by getUIFunctions)
 */
interface TransferInternalViewUIFunctions {
  onSelectAgent: (agentId: string) => void;
  onCancel: () => void;
  fetchAgentList: () => void;
}

export type {
  TransferInternalViewOptions,
  TransferInternalViewProps,
  TransferInternalViewUIProps,
  TransferInternalViewUIFunctions,
};
