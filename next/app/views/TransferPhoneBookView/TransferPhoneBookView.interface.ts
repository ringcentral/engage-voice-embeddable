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

export type { TransferPhoneBookViewOptions, TransferPhoneBookViewProps };
