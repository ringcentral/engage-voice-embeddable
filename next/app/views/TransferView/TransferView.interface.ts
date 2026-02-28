import type { EvTransferType } from '../../../enums';
import type { EvDirectAgentListItem, EvTransferPhoneBookItem } from '../../services/EvTransferCall/EvTransferCall.interface';
import type { EvAvailableRequeueQueue } from '../../services/EvClient';

/**
 * Options for TransferView customization
 */
interface TransferViewOptions {
  onCancel?: () => void;
}

/**
 * Props passed to the TransferView component
 */
interface TransferViewProps {
  id?: string;
}

/**
 * Tab definition for the transfer type tabs.
 * All tabs are always shown; unavailable ones are disabled.
 */
interface TransferTab {
  value: EvTransferType;
  label: string;
  disabled: boolean;
}

/**
 * TransferView UI state props
 */
interface TransferViewUIProps {
  transferType: EvTransferType;
  isStayOnCall: boolean;
  isTransferring: boolean;
  isDisabled: boolean;
  allTabs: TransferTab[];
  defaultTab: EvTransferType | null;
  agentList: EvDirectAgentListItem[];
  phoneBook: EvTransferPhoneBookItem[];
  selectedAgentId: string | null;
  selectedPhoneBookIndex: number | null;
  manualEntryNumber: string;
  queueGroups: EvAvailableRequeueQueue[];
  selectedQueueGroupId: string;
  selectedGateId: string;
}

/**
 * TransferView UI action functions
 */
interface TransferViewUIFunctions {
  onTabChange: (type: EvTransferType) => void;
  onStayOnCallChange: () => void;
  onSelectAgent: (agentId: string) => void;
  onSelectPhoneBookContact: (index: number) => void;
  onManualEntryChange: (value: string) => void;
  onQueueGroupChange: (groupId: string) => void;
  onGateChange: (gateId: string) => void;
  onTransfer: () => Promise<void>;
  onCancel: () => void;
  onBack: () => void;
  fetchAgentList: () => void;
}

export type {
  TransferViewOptions,
  TransferViewProps,
  TransferTab,
  TransferViewUIProps,
  TransferViewUIFunctions,
};
