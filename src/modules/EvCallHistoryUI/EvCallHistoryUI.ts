import { RcUIModuleV2 } from '@ringcentral-integration/core';
import { Module } from 'ringcentral-integration/lib/di';
import { callDirection } from 'ringcentral-integration/enums/callDirections';

import { Deps, EvCallHistoryUIState } from './EvCallHistoryUI.interface';

@Module({
  name: 'EvCallHistoryUI',
  deps: ['EvActivityCallUI', 'EvCallHistory', 'Locale'],
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

    const { calls } = this._deps.evCallHistory;
    const { activityCallLog } = this._deps.evActivityCallUI;

    let newCalls = calls;
    if (activityCallLog) {
      const { entity } = activityCallLog.showInfoMeta;

      const { basicInfo } = this._deps.evActivityCallUI;
      const firstCall = { ...calls[0] };
      if (firstCall.direction === callDirection.outbound) {
        firstCall.toName =
          entity === null
            ? firstCall.to.phoneNumber
            : basicInfo?.subject || firstCall.toName;
      } else {
        firstCall.fromName =
          entity === null
            ? firstCall.from.phoneNumber
            : basicInfo?.subject || firstCall.fromName;
      }
      newCalls = [firstCall, ...calls.slice(1)];
    }

    return {
      calls: newCalls,
      currentLocale,
    };
  }

  getUIFunctions() {
    return {};
  }
}

export { EvCallHistoryUI };
