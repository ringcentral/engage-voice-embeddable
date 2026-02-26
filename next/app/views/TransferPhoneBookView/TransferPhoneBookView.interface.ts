import type { EvTransferPhoneBookItem } from '../../services/EvTransferCall/EvTransferCall.interface';

/**
 * Options for TransferPhoneBookView customization
 */
interface TransferPhoneBookViewOptions {
  onTransferComplete?: () => void;
  onCancel?: () => void;
}

/**
 * Props passed to the TransferPhoneBookView component
 */
interface TransferPhoneBookViewProps {
  id?: string;
}

/**
 * TransferPhoneBookView UI state props (returned by getUIProps)
 */
interface TransferPhoneBookViewUIProps {
  phoneBook: EvTransferPhoneBookItem[];
}

/**
 * TransferPhoneBookView UI action functions (returned by getUIFunctions)
 */
interface TransferPhoneBookViewUIFunctions {
  onSelectContact: (index: number) => void;
  onCancel: () => void;
}

export type {
  TransferPhoneBookViewOptions,
  TransferPhoneBookViewProps,
  TransferPhoneBookViewUIProps,
  TransferPhoneBookViewUIFunctions,
};
