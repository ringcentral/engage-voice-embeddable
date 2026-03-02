import React, { useMemo, useRef } from 'react';
import {
  action,
  computed,
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  state,
  useConnector,
} from '@ringcentral-integration/next-core';
import type { UIFunctions, UIProps } from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { CallsListPage } from '@ringcentral-integration/micro-phone/src/app/views/CallsListViewSpring/CallsListPage';
import type { ViewCallsFilterType } from '@ringcentral-integration/micro-phone/src/app/views/CallsListViewSpring/CallsList.view.interface';
import type { HistoryAction } from '@ringcentral-integration/next-widgets/components/ActionMenuList/useHistoryActionButtons';
import {
  IncomingCallMd,
  OutgoingCallMd,
  CheckBoldMd,
} from '@ringcentral/spring-icon';
import { Avatar as SpringAvatar } from '@ringcentral/spring-ui';
import type { StateSnapshot } from 'react-virtuoso';
import dayjs from 'dayjs';

import { EvCallHistory } from '../../services/EvCallHistory';
import { DispositionView } from '../DispositionView';
import { callDirection } from '../../../enums';
import type { FormattedCall } from '../../services/EvCallHistory/EvCallHistory.interface';
import type {
  CallHistoryViewOptions,
  CallHistoryViewUIProps,
  CallHistoryViewUIFunctions,
} from './CallHistoryView.interface';
import i18n from './i18n';

/**
 * CallHistoryView module - Call history display
 * Shows call history list with filter and action menu using Spring UI
 */
@injectable({
  name: 'CallHistoryView',
})
class CallHistoryView extends RcViewModule {
  constructor(
    private evCallHistory: EvCallHistory,
    private dispositionView: DispositionView,
    private _router: RouterPlugin,
    @optional('CallHistoryViewOptions')
    private callHistoryViewOptions?: CallHistoryViewOptions,
  ) {
    super();
  }

  @state
  viewCallsFilter: ViewCallsFilterType = 'all';

  @state
  lastPositions: Record<string, StateSnapshot | undefined> = {};

  @action
  private _setViewCallsFilter(val: ViewCallsFilterType) {
    this.viewCallsFilter = val;
  }

  setViewCallsFilter = (val: ViewCallsFilterType) => {
    this._setViewCallsFilter(val);
  };

  @action
  private _setLastPosition(type: ViewCallsFilterType, val?: StateSnapshot) {
    const index = type || 'undefined';
    this.lastPositions[index] = val;
  }

  setLastPosition = (type: ViewCallsFilterType, val?: StateSnapshot) => {
    this._setLastPosition(type, val);
  };

  /**
   * Get calls with first call name updated from activity call if call ended
   */
  @computed((that: CallHistoryView) => [
    that.evCallHistory.latestCalls,
    that.dispositionView.callStatus,
    that.dispositionView.callId,
  ])
  get callsWithActivityUpdate(): FormattedCall[] {
    const calls = this.evCallHistory.latestCalls ?? [];
    if (calls.length === 0) return calls;
    const { callStatus, callId } = this.dispositionView;
    if (callStatus === 'callEnd' && callId && calls[0]?.id === callId) {
      const currentCall = this.dispositionView.currentCall;
      if (currentCall) {
        const firstCall = { ...calls[0] };
        const contactName = this.dispositionView.getContactName(currentCall);
        if (contactName) {
          if (firstCall.direction === callDirection.outbound) {
            firstCall.toName = contactName;
          } else {
            firstCall.fromName = contactName;
          }
        }
        return [firstCall, ...calls.slice(1)];
      }
    }
    return calls;
  }

  /**
   * Filter calls based on viewCallsFilter
   */
  @computed((that: CallHistoryView) => [
    that.callsWithActivityUpdate,
    that.viewCallsFilter,
  ])
  get viewCalls(): FormattedCall[] {
    const calls = this.callsWithActivityUpdate;
    switch (this.viewCallsFilter) {
      case 'outgoing':
        return calls.filter(
          (call) => call.direction === callDirection.outbound,
        );
      case 'incoming':
        return calls.filter(
          (call) => call.direction === callDirection.inbound,
        );
      case 'all':
      default:
        return calls;
    }
  }

  /**
   * Navigate to call history detail page
   */
  goToCallDetail(callId: string) {
    this._router.push(`/history/${callId}/detail`);
  }

  /**
   * Navigate to activity call page for creating/updating call log
   */
  goToCallLogPage(callId: string, method: 'create' | 'update') {
    this._router.push(`/history/${callId}/callLog/${method}`);
  }

  /**
   * Hook that provides call history item info for rendering
   */
  useCallHistoryItemInfo = (
    call: FormattedCall,
    _options: { selectIndex: number; variant: 'list' | 'detail' },
  ) => {
    const { t } = useLocale(i18n);
    const isOutbound = call.direction === callDirection.outbound;
    const displayName = isOutbound ? call.toName : call.fromName;
    const phoneNumber = isOutbound
      ? call.to?.phoneNumber
      : call.from?.phoneNumber;
    const startTime = useMemo(() => {
      if (!call.startTime) return '';
      const now = dayjs();
      const callTime = dayjs(call.startTime);
      if (callTime.isSame(now, 'day')) {
        return callTime.format('h:mm A');
      }
      if (callTime.isSame(now.subtract(1, 'day'), 'day')) {
        return t('yesterday') || 'Yesterday';
      }
      return callTime.format('MM/DD/YYYY');
    }, [call.startTime, t]);
    const Avatar = useMemo(
      () =>
        function CallAvatar({ size = 'small' }: { size?: 'small' | 'medium' | 'large' }) {
          const IconSymbol = isOutbound ? OutgoingCallMd : IncomingCallMd;
          return (
            <SpringAvatar size={size} classes={{ content: 'bg-transparent text-neutral-b2' }}>
              <IconSymbol />
            </SpringAvatar>
          );
        },
      [isOutbound],
    );
    const DisplayName = useMemo(
      () =>
        function CallDisplayName() {
          return (
            <span className="typography-subtitle truncate">
              {displayName || phoneNumber || t('unknown')}
            </span>
          );
        },
      [displayName, phoneNumber, t],
    );
    const Status = useMemo(() => {
      return function CallStatus({ mode }: { mode: 'icon' | 'text' }) {
        if (mode === 'icon') {
          const IconSymbol = isOutbound ? OutgoingCallMd : IncomingCallMd;
          return (
            <span className="inline-flex items-center text-neutral-b2">
              <IconSymbol />
            </span>
          );
        }
        return (
          <span className="typography-descriptor text-neutral-b2">
            {isOutbound ? t('outbound') : t('inbound')}
          </span>
        );
      };
    }, [isOutbound, t]);
    const logged = useMemo(() => {
      if (!call.isDisposed) return null;
      return (
        <span className="text-success ml-1 inline-flex" title={t('logged')}>
          <CheckBoldMd />
        </span>
      );
    }, [call.isDisposed, t]);
    const actions: HistoryAction[] = useMemo(() => {
      return [
        {
          type: call.isDisposed ? 'viewLog' : 'createLog',
          label: call.isDisposed ? t('updateCallLog') : t('createCallLog'),
        },
      ];
    }, [call.isDisposed, t]);
    const info = {
      Avatar,
      DisplayName,
      Status,
      startTime,
      logged,
      answeredByDelegate: false,
      ringingElsewhere: false,
      renderInfo: {
        dialToPhoneNumber: phoneNumber,
        matchedContact: null,
        type: 'phoneNumber',
        metadata: { showMaybe: false },
      },
      formattedPhoneNumber: phoneNumber,
      showViewLogIcon: call.isDisposed,
      isConferenceCall: false,
      getActionInfo: () => ({
        phoneNumber,
        name: displayName,
      }),
      copyNumber: () => null,
    };
    return { info, actions };
  };

  /**
   * Hook that handles actions from the call history list
   */
  useActionsHandler = (
    call: FormattedCall,
    _info: ReturnType<typeof this.useCallHistoryItemInfo>['info'],
    _location: string,
  ) => {
    return async (actionType: string) => {
      switch (actionType) {
        case 'createLog':
          this.goToCallLogPage(call.id, 'create');
          break;
        case 'viewLog':
          this.goToCallLogPage(call.id, 'update');
          break;
        case 'viewDetail':
          this.goToCallDetail(call.id);
          break;
        default:
          this.logger.warn(`Unknown action type: ${actionType}`);
      }
    };
  };

  /**
   * Get reactive UI state props for the component
   */
  getUIProps(t: (key: string) => string): UIProps<CallHistoryViewUIProps> {
    const index = this.viewCallsFilter || 'undefined';
    return {
      viewCalls: this.viewCalls,
      searchInput: this.evCallHistory.searchInput,
      viewCallsFilter: this.viewCallsFilter,
      lastPosition: this.lastPositions[index],
      viewCallsFilterSelections: [
        { label: t('callsFilterAll'), value: 'all' },
        { label: t('callsFilterOutgoing'), value: 'outgoing' },
        { label: t('callsFilterIncoming'), value: 'incoming' },
      ],
    };
  }

  /**
   * Get stable UI action functions for the component
   */
  getUIFunctions(): UIFunctions<CallHistoryViewUIFunctions> {
    return {
      onSearchInputChange: (value: string) => {
        this.evCallHistory.updateSearchInput(value);
        this.evCallHistory.debouncedSearch();
      },
      setViewCallsFilter: this.setViewCallsFilter,
      setLastPosition: this.setLastPosition,
      onFocus: () => {
        this.evCallHistory.updateLastCheckTimeStamp();
      },
      useCallHistoryItemInfo: this.useCallHistoryItemInfo as any,
      useActionsHandler: this.useActionsHandler as any,
    };
  }

  component() {
    const { t } = useLocale(i18n);
    const { current: uiFunctions } = useRef(this.getUIFunctions());

    const {
      viewCalls,
      searchInput,
      viewCallsFilter,
      lastPosition,
      viewCallsFilterSelections,
    } = useConnector(() => this.getUIProps(t));

    return (
      <div className="flex flex-col h-full bg-neutral-base">
        <CallsListPage
          calls={viewCalls as any}
          searchInput={searchInput}
          onSearchInputChange={uiFunctions.onSearchInputChange}
          viewCallsFilter={viewCallsFilter}
          setViewCallsFilter={uiFunctions.setViewCallsFilter}
          viewCallsFilterSelections={viewCallsFilterSelections}
          useCallHistoryItemInfo={uiFunctions.useCallHistoryItemInfo}
          useActionsHandler={uiFunctions.useActionsHandler}
          setLastPosition={uiFunctions.setLastPosition}
          lastPosition={lastPosition}
          onFocus={uiFunctions.onFocus}
        />
      </div>
    );
  }
}

export { CallHistoryView };
