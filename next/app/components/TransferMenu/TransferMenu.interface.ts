/**
 * Transfer menu option types
 */
export type TransferOption = 'internal' | 'phoneBook' | 'queue' | 'manualEntry';

/**
 * Props for TransferMenu component
 */
export interface TransferMenuProps {
  /** Reference element for positioning the menu */
  anchorEl: HTMLElement | null;
  /** Whether the menu is open */
  isOpen: boolean;
  /** Called when the menu should close */
  onClose: () => void;
  /** Called when a transfer option is selected */
  onSelect: (option: TransferOption) => void;
  /** Whether transfer call is allowed */
  allowTransferCall?: boolean;
  /** Whether requeue call is allowed */
  allowRequeueCall?: boolean;
  /** Whether internal transfer is disabled */
  disableInternalTransfer?: boolean;
  /** Labels for the transfer options */
  labels?: {
    internalTransfer?: string;
    phoneBookTransfer?: string;
    queueTransfer?: string;
    enterANumber?: string;
  };
  /** Data sign for testing */
  'data-sign'?: string;
}
