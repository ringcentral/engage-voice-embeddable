/**
 * Options for TransferManualEntryView customization
 */
interface TransferManualEntryViewOptions {
  onTransferComplete?: () => void;
  onCancel?: () => void;
}

/**
 * Props passed to the TransferManualEntryView component
 */
interface TransferManualEntryViewProps {
  id?: string;
}

export type { TransferManualEntryViewOptions, TransferManualEntryViewProps };
