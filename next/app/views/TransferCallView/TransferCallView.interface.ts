import type { EvTransferType } from '../../../enums';

/**
 * Options for TransferCallView customization
 */
interface TransferCallViewOptions {
  onCancel?: () => void;
}

/**
 * Props passed to the TransferCallView component
 */
interface TransferCallViewProps {
  id?: string;
}

/**
 * Transfer type option used in the type selector
 */
interface TransferTypeOption {
  value: EvTransferType;
  label: string;
}

/**
 * TransferCallView UI state props (returned by getUIProps)
 */
interface TransferCallViewUIProps {
  transferType: EvTransferType;
  selectedRecipient: string;
  recipientNumber: string;
  isStayOnCall: boolean;
  isDisabled: boolean;
  isTransferring: boolean;
  typeOptions: TransferTypeOption[];
}

/**
 * TransferCallView UI action functions (returned by getUIFunctions)
 */
interface TransferCallViewUIFunctions {
  onTransferTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStayOnCallChange: () => void;
  onRecipientClick: () => void;
  onTransfer: () => Promise<void>;
  onCancel: () => void;
  onBack: () => void;
}

export type {
  TransferCallViewOptions,
  TransferCallViewProps,
  TransferTypeOption,
  TransferCallViewUIProps,
  TransferCallViewUIFunctions,
};
