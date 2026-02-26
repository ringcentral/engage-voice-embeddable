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

/**
 * TransferManualEntryView UI state props (returned by getUIProps)
 */
interface TransferManualEntryViewUIProps {
  initialNumber: string;
}

/**
 * TransferManualEntryView UI action functions (returned by getUIFunctions)
 */
interface TransferManualEntryViewUIFunctions {
  onNext: (phoneNumber: string) => void;
  onCancel: () => void;
}

export type {
  TransferManualEntryViewOptions,
  TransferManualEntryViewProps,
  TransferManualEntryViewUIProps,
  TransferManualEntryViewUIFunctions,
};
