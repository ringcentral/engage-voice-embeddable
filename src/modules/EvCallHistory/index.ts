import { Module } from 'ringcentral-integration/lib/di';
import { computed } from '@ringcentral-integration/core';
import { callDirection } from 'ringcentral-integration/enums/callDirections';

import { contactMatchIdentifyEncode } from '@ringcentral-integration/engage-voice-widgets/lib/contactMatchIdentify';
import { EvCallHistory as BaseEvCallHistory } from '@ringcentral-integration/engage-voice-widgets/modules/EvCallHistory';

@Module({
  deps: [],
})
class EvCallHistory extends BaseEvCallHistory {
  @computed((that: EvCallHistory) => [
    that.rawCalls,
    that.contactMatches,
    that.activityMatches,
  ])
  get formattedCalls() {
    const lastWeekDayTimestamp = this._getLastWeekDayTimestamp();
    // max 250 and 7 days
    const calls = this.rawCalls
      .slice(0, 250)
      .filter((call) => call.timestamp >= lastWeekDayTimestamp);

    return calls.map((call) => {
      const contactMatchIdentify = contactMatchIdentifyEncode({
        phoneNumber: call.ani,
        callType: call.callType,
      });

      const id = this._deps.evCallMonitor.getCallId(call.session);
      const direction =
        call.callType.toLowerCase() === 'outbound'
          ? callDirection.outbound
          : callDirection.inbound;
      const contactMatches = this.contactMatches[contactMatchIdentify] || [];
      const activityMatches = this.activityMatches[id] || [];
      const agent = {
        name: call.agentId,
        phoneNumber: this._formatPhoneNumber(call.agentId),
      };

      let name = '';
      if (contactMatches.length > 0) {
        name = contactMatches[0].name;
      }
      if (contactMatches.length && activityMatches.length) {
        const contactId = activityMatches[0]?.contactId;
        const matched = contactMatches.find(
          (match: { id: string }) => match.id === contactId,
        );
        if (matched) {
          name = matched.name;
        }
      }
      const contact = {
        name,
        phoneNumber: this._formatPhoneNumber(call.ani),
      };

      return {
        id,
        direction,
        from: direction === callDirection.outbound ? agent : contact,
        to: direction === callDirection.outbound ? contact : agent,
        fromName:
          direction === callDirection.outbound
            ? agent.name || agent.phoneNumber
            : contact.name || contact.phoneNumber,
        toName:
          direction === callDirection.outbound
            ? contact.name || contact.phoneNumber
            : agent.name || agent.phoneNumber,
        fromMatches: contactMatches,
        toMatches: contactMatches,
        activityMatches,
        startTime: call.timestamp,
      };
    });
  }
}

export { EvCallHistory };
