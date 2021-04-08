import { RcUIModuleV2 } from '@ringcentral-integration/core';
import { Module } from 'ringcentral-integration/lib/di';
import { callDirection } from 'ringcentral-integration/enums/callDirections';
import { callLogMethods } from '@ringcentral-integration/engage-voice-widgets/interfaces/EvActivityCallUI.interface';
import { NewNote } from '@ringcentral/juno/icon';

import {
  CallLog,
  CallLogMenu,
} from 'ringcentral-integration/interfaces/CallLog.interface';

import EditCallLogSvg from '../../assets/icon-edit-call-log.svg'; // TODO: wait for edit_note icon

import { Deps, EvCallHistoryUIState } from './EvCallHistoryUI.interface';
import i18n from './i18n';
@Module({
  name: 'EvCallHistoryUI',
  deps: [
    'EvActivityCallUI',
    'EvCallDisposition',
    'EvCallHistory',
    'Locale',
    'RouterInteraction'
  ],
})
class EvCallHistoryUI
  extends RcUIModuleV2<Deps>
  implements EvCallHistoryUIState {
  constructor(deps: Deps) {
    super({
      deps,
    });
  }

  getUIProps() {
    const { currentLocale } = this._deps.locale;

    const { formattedCalls } = this._deps.evCallHistory;
    const { activityCallLog, callStatus } = this._deps.evActivityCallUI;

    let newCalls = formattedCalls;
    if (activityCallLog && callStatus === 'callEnd') {
      const { basicInfo } = this._deps.evActivityCallUI;
      const firstCall = { ...formattedCalls[0] };
      if (firstCall.direction === callDirection.outbound) {
        firstCall.toName = basicInfo?.subject || firstCall.toName;
      } else {
        firstCall.fromName = basicInfo?.subject || firstCall.fromName;
      }
      newCalls = [firstCall, ...formattedCalls.slice(1)];
    }

    // get isDisposed for every call log
    newCalls = newCalls.map((call) => {
      const dispositionCall = this._deps.evCallDisposition
        .dispositionStateMapping[call.id];
      const isDisposed =
        Boolean(dispositionCall && dispositionCall?.disposed) ||
        call.activityMatches.length > 0
      return {
        ...call,
        isDisposed,
      };
    });

    return {
      calls: newCalls,
      currentLocale,
    };
  }

  getUIFunctions() {
    return {
      getActionMenu: (call: CallLog) => this.getActionMenu(call),
    };
  }

  createUpdateCallLog(id: string, isDisposed: boolean) {
    this._deps.evActivityCallUI.changeSavingStatus(
      isDisposed ? callLogMethods.update : callLogMethods.create,
    );
    const url = `/history/callLog/${id}/${
      isDisposed ? callLogMethods.update : callLogMethods.create
    }`;
    this._deps.routerInteraction.push(url);
  }

  getActionMenu(call: CallLog): CallLogMenu {
    const { isDisposed, id } = call;
    const { currentLocale } = this._deps.locale;

    return [
      {
        icon: isDisposed ? EditCallLogSvg : NewNote,
        label: i18n.getString(
          `${isDisposed ? 'update' : 'create'}CallLog`,
          currentLocale,
        ),
        action: () => this.createUpdateCallLog(id, isDisposed),
      },
    ];
  }
}

export { EvCallHistoryUI };
