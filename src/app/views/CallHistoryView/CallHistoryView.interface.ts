import type { ComponentType, ReactNode } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import type { ViewCallsFilterType } from '@ringcentral-integration/micro-phone/src/app/views/CallsListViewSpring/CallsList.view.interface';
import type { HistoryAction } from '@ringcentral-integration/next-widgets/components/ActionMenuList/useHistoryActionButtons';
import type { FormattedCall } from '../../services/EvCallHistory/EvCallHistory.interface';

/**
 * CallHistoryView options for configuration
 */
interface CallHistoryViewOptions {
  // Optional configuration options
}

/**
 * UI state props returned by getUIProps
 */
interface CallHistoryViewUIProps {
  viewCalls: FormattedCall[];
  searchInput: string;
  viewCallsFilter: ViewCallsFilterType;
  lastPosition: StateSnapshot | undefined;
  viewCallsFilterSelections: { label: string; value: string }[];
}

/**
 * UI action functions returned by getUIFunctions
 */
interface CallHistoryViewUIFunctions {
  onSearchInputChange: (value: string) => void;
  setViewCallsFilter: (val: ViewCallsFilterType) => void;
  setLastPosition: (type: ViewCallsFilterType, val?: StateSnapshot) => void;
  onFocus: () => void;
  useCallHistoryItemInfo: (
    call: FormattedCall,
    options: { selectIndex: number; variant: 'list' | 'detail' },
  ) => { info: CallHistoryItemInfo; actions: HistoryAction[] };
  useActionsHandler: (
    call: FormattedCall,
    info: CallHistoryItemInfo,
    location: string,
  ) => (actionType: string) => Promise<void>;
}

/**
 * Shape of info object returned by useCallHistoryItemInfo
 */
interface CallHistoryItemInfo {
  Avatar: ComponentType<{ size?: 'small' | 'medium' | 'large' }>;
  DisplayName: ComponentType;
  Status: ComponentType<{ mode: 'icon' | 'text' }>;
  startTime: string;
  logged: ReactNode;
  answeredByDelegate: boolean;
  ringingElsewhere: boolean;
  renderInfo: {
    dialToPhoneNumber: string | undefined;
    matchedContact: null;
    type: string;
    metadata: { showMaybe: boolean };
  };
  formattedPhoneNumber: string | undefined;
  showViewLogIcon: boolean;
  isConferenceCall: boolean;
  getActionInfo: () => { phoneNumber: string | undefined; name: string };
  copyNumber: () => null;
}

export type {
  CallHistoryViewOptions,
  CallHistoryViewUIProps,
  CallHistoryViewUIFunctions,
  CallHistoryItemInfo,
};
