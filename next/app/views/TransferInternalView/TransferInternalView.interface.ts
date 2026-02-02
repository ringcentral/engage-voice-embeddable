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

export type { TransferInternalViewOptions, TransferInternalViewProps };
