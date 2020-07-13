import { Module } from 'ringcentral-integration/lib/di';
import { createSelector } from '@ringcentral-integration/core';

import {
  EvCurrentLog,
  EvActivityCallUIProps,
} from '@ringcentral-integration/engage-voice-widgets/interfaces/EvActivityCallUI.interface';
import i18n from '@ringcentral-integration/engage-voice-widgets/modules/EvActivityCallUI/i18n';
import { EvActivityCallUI as BaseActivityCallUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvActivityCallUI';
import { EvCall } from '@ringcentral-integration/engage-voice-widgets/interfaces/EvData.interface';
import { logTypes } from '@ringcentral-integration/engage-voice-widgets/enums/logTypes';

import { formatCallFromEVCall } from '../../lib/formatCallFromEVCall';

import { getCallInfos } from './utils/getCallInfos';
import { DepsModules, State } from './interface';

type EvActivityCallUIState = RcModuleState<EvActivityCallUI, State>;

@Module({
  deps: ['ThirdPartyService', 'Storage', 'ContactMatcher', 'AppConfig'],
})
class EvActivityCallUI extends BaseActivityCallUI<DepsModules, EvActivityCallUIState> {
  constructor({
    thirdPartyService,
    enableCache = true,
    storage,
    contactMatcher,
    appConfig,
    ...options
  }) {
    super({
      modules: {
        thirdPartyService,
        storage,
        contactMatcher,
        appConfig,
      },
      enableCache,
      storageKey: 'EvActivityCallUI',
      ...options,
    } as any);
  }

  getCustomLogFields({ required, validated }) {
    const notes = {
      label: 'Notes',
      sort: 3,
      type: 'textarea',
      value: 'notes',
      maxLength: 32000,
      required: required.notes,
      error: !validated.notes,
      onChange: (value: string) => {
        if (required.notes) {
          this.changeFormStatus({ validated: { notes: !!value } });
        } else {
          this.changeFormStatus({ validated: { notes: true } });
        }
      },
    };
    const dispositionPickList = this.getDispositionPickList();
    if (dispositionPickList.length === 0) {
      if (!this._modules.appConfig.hideCallNote) {
        return [notes];
      }
      return [];
    }
    const disposition = {
      label: 'Disposition',
      sort: 5,
      type: 'picklist',
      value: 'dispositionId',
      required: true,
      picklistOptions: dispositionPickList,
      defaultValue: 'None',
      error: !validated.dispositionId,
      helperText: !validated.dispositionId
        ? i18n.getString('dispositionError', this._modules.locale.currentLocale)
        : undefined,
      onChange: (value: string) => {
        const currentDisposition = dispositionPickList.find(
          (item) => item.value === value,
        );

        const noteRequired =
          currentDisposition && currentDisposition.requireNote;

        this.changeFormStatus({
          validated: {
            dispositionId: !!value,
            notes: !noteRequired || (noteRequired && notes),
          },
          required: {
            notes: noteRequired,
          },
        });
      },
    };
    if (this._modules.appConfig.hideCallNote) {
      return [disposition];
    }
    return [notes, disposition];
  }

  getActivityCallLog = createSelector(
    () => this.callId,
    () => this.currentEvCall,
    () => this._modules.evCallDisposition.callsMapping[this.callId],
    () => this.validated,
    () => this.required,
    () => this._modules.contactMatcher.dataMapping,
    (
      callId,
      currentCall,
      callDisposition,
      validated,
      required,
      contactMapping: any,
    ): EvCurrentLog => {
      if (!currentCall) {
        return undefined;
      }
      const { dispositionId, notes } = callDisposition || {};
      return {
        currentEvRawCall: currentCall,
        // the call which maps for rc component
        call: formatCallFromEVCall(currentCall, contactMapping),
        currentSessionId: callId,
        // TODO: this will be remove when api can using.
        currentLogCall: {
          isFailed: false,
          isAutoSave: false,
          isCreated: false,
        },
        customLogFields: this.getCustomLogFields({ required, validated }),
        task: {
          // TODO fix Task interface with generic type
          // @ts-ignore
          dispositionId,
          notes,
        },
      };
    },
  )

  getBasicInfo = createSelector(
    () => this.currentEvCall,
    () => this.getActivityCallLog(),
    (
      currentEvCall: EvCall,
      { call }: EvCurrentLog,
    ) => {
      const isInbound = call.direction === 'INBOUND';
      const fromMatchName = call.from.name || call.from.phoneNumber;
      const toMatchName = call.to.name || call.to.phoneNumber;

      return {
        subject: isInbound ? fromMatchName : toMatchName,
        callInfos: getCallInfos(currentEvCall),
        followInfos: [
          isInbound ? call.from.phoneNumber : call.to.phoneNumber,
          ...(currentEvCall ? [currentEvCall.queue.name] : []),
        ],
      };
    },
  );

  private async _submitData(id: string) {
    try {
      const saveFields = this._modules.evCallDisposition.callsMapping[id];
      if (saveFields) {
        this.changeFormStatus({
          validated: {
            notes:
              !this.required.notes || (this.required.notes && saveFields.notes),
          },
        });
      }

      if (this._hasError()) {
        return;
      }
      this.changeSavingStatus('saving');
      await this.disposeCall(id);
      this.changeSavingStatus('saved');
      if (!this.tabManagerEnabled) {
        this._modules.alert.success({
          message: logTypes.CALL_DISPOSITION_SUCCESS,
        });
        // delay for animation with loading ui.
        setTimeout(() => this.goDialer(), 1000);
      }
      this._modules.evWorkingState.setIsPendingDisposition(false);
    } catch (error) {
      this._modules.alert.danger({
        message: logTypes.CALL_DISPOSITION_FAILURE,
        ttl: 0,
      });
      this.changeSavingStatus('submit');
      throw e;
    }
  }

  private _hasError() {
    return Object.keys(this.validated).some((key) => {
      return !this.validated[key];
    });
  }

  async disposeCall() {
    try {
      const callLog = this.getActivityCallLog()
      await this._modules.thirdPartyService.logCall({
        call: callLog.call,
        task: callLog.task,
      });
    } catch (e) {
      console.error(e);
    }
    await this._modules.evCallDisposition.disposeCall(this.callId);
  }

  async disposeCurrentCall() {
    await this.disposeCall();
  }

  get showSubmitStep() {
    if (!this._modules.appConfig.hideCallNote) {
      return true;
    }
    const dispositionPickList = this.getDispositionPickList();
    if (dispositionPickList.length === 0) {
      return false;
    }
    const activityCallLog = this.getActivityCallLog();
    if (activityCallLog.call.direction === 'INBOUND') {
      return true;
    }
    return false;
  }

  getUIProps({ id }): EvActivityCallUIProps {
    return {
      ...super.getUIProps({ id }),
      currentLog: this.getActivityCallLog(),
      basicInfo: this.getBasicInfo(),
    };
  }
}

export { EvActivityCallUI };
