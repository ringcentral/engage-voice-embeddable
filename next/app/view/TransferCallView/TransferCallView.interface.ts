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

export type { TransferCallViewOptions, TransferCallViewProps };
