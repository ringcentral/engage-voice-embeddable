import { Module } from 'ringcentral-integration/lib/di';
import { computed } from '@ringcentral-integration/core';
import { format } from '@ringcentral-integration/phone-number';

import {
  EvCurrentLog,
  EvActivityCallUIProps,
} from '@ringcentral-integration/engage-voice-widgets/interfaces/EvActivityCallUI.interface';
import i18n from '@ringcentral-integration/engage-voice-widgets/modules/EvActivityCallUI/i18n';
import { EvActivityCallUI as BaseActivityCallUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvActivityCallUI';
import { logTypes, tabManagerEvents } from '@ringcentral-integration/engage-voice-widgets/enums';

import { getCallInfos } from './utils/getCallInfos';
import { Deps } from './interface';

@Module({
  deps: ['Storage', 'ThirdPartyService', 'ContactMatcher', 'AppConfig'],
})
class EvActivityCallUI extends BaseActivityCallUI<Deps> {
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
    const dispositionPickList = this.dispositionPickList;
    if (dispositionPickList.length === 0) {
      if (!this._deps.appConfig.hideCallNote) {
        return [notes];
      }
      return [];
    }
    const disposition = {
      label: 'Disposition',
      sort: 5,
      type: 'picklist',
      value: 'dispositionId',
      placeholder: i18n.getString(
        'pleaseSelect',
        this._deps.locale.currentLocale,
      ),
      required: true,
      picklistOptions: dispositionPickList,
      defaultValue: 'None',
      error: !validated.dispositionId,
      helperText: !validated.dispositionId
        ? i18n.getString('dispositionError', this._deps.locale.currentLocale)
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
    if (this._deps.appConfig.hideCallNote) {
      return [disposition];
    }
    return [notes, disposition];
  }

  @computed((that: EvActivityCallUI) => [
    that.callId,
    that.currentEvCall,
    that._deps.evCallDisposition.callsMapping[that.callId],
    that.validated,
    that.required,
    that._deps.locale.currentLocale,
    that.dispositionPickList,
  ])
  get myActivityCallLog() : EvCurrentLog {
    const currentCall = this.currentEvCall;
    if (!currentCall) {
      return null;
    }
    const { contactMatches = [], callType } = this.currentEvCall;
    const callId = this.callId;
    const callDisposition = this._deps.evCallDisposition.callsMapping[callId];
    const { dispositionId, notes } = callDisposition || {};
    const name = contactMatches[0] && contactMatches[0].name;
    return {
      ...this.activityCallLog,
      call: {
        ...this.activityCallLog.call,
        to: {
          ...this.activityCallLog.call.to,
          name:
            callType === 'OUTBOUND'
              ? name
              : this.activityCallLog.call.to.name,
        },
        from: {
          ...this.activityCallLog.call.from,
          name:
            callType !== 'OUTBOUND'
              ? name
              : this.activityCallLog.call.from.name,
        },
        recordingUrl: this.activityCallLog.currentEvRawCall?.session?.recordingUrl,
      },
      showInfoMeta: {
        title: '',
        entity: null,
      },
      customLogFields: this.getCustomLogFields({ required: this.required, validated: this.validated }),
      task: {
        // TODO fix Task interface with generic type
        // @ts-ignore
        dispositionId,
        notes,
      },
    };
  }

  @computed((that: EvActivityCallUI) => [
    that.currentEvCall,
    that.myActivityCallLog,
    that._deps.locale.currentLocale,
  ])
  get basicInfo() {
    if (!this.currentEvCall) return null;
    const currentEvCall = this.currentEvCall;
    const { call } = this.myActivityCallLog;
    const isInbound = call.direction === 'INBOUND';
    const fromMatchName = call.from.name || call.from.phoneNumber;
    const toMatchName = call.to.name || call.to.phoneNumber;
    const phoneNumber = isInbound ? call.from.phoneNumber : call.to.phoneNumber;
    const formattedNumber = format({
      phoneNumber,
      countryCode: 'US',
    });

    return {
      subject: isInbound ? fromMatchName : toMatchName,
      callInfos: getCallInfos(currentEvCall, this._deps.locale.currentLocale),
      followInfos: [
        formattedNumber,
        ...(currentEvCall ? [currentEvCall.queue.name] : []),
      ],
    };
  }

  private async _submitData(id: string) {
    try {
      const saveFields = this._deps.evCallDisposition.callsMapping[id];
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
      this._sendTabManager(tabManagerEvents.CALL_DISPOSITION_SUCCESS);
      this._dispositionSuccess();
    } catch (e) {
      this._deps.alert.danger({
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
      const callLog = this.myActivityCallLog;
      await this._deps.thirdPartyService.logCall({
        call: callLog.call,
        task: callLog.task,
        sessionId: callLog.currentSessionId,
      });
    } catch (e) {
      console.error(e);
    }
    await super.disposeCall();
  }

  get showSubmitStep() {
    if (!this._deps.appConfig.hideCallNote) {
      return true;
    }
    const dispositionPickList = this.dispositionPickList;
    if (dispositionPickList.length === 0) {
      return false;
    }
    const activityCallLog = this.myActivityCallLog;
    if (activityCallLog.call.direction === 'INBOUND') {
      return true;
    }
    return false;
  }

  async gotoDialWithoutSubmit() {
    await this.disposeCall();
    this._deps.evWorkingState.setIsPendingDisposition(false);
    this.goDialer();
  }

  getUIProps({ id }): EvActivityCallUIProps {
    const originalProps = super.getUIProps({ id });
    return {
      ...originalProps,
      currentLog: this.myActivityCallLog,
      basicInfo: this.basicInfo,
    };
  }
}

export { EvActivityCallUI };
