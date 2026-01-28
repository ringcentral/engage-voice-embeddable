import { callDirection } from '@ringcentral-integration/commons/enums/callDirections';
import type { Locale } from '@ringcentral-integration/commons/modules/Locale';
import {
  computed,
  injectable,
  optional,
  RcModule,
  watch,
} from '@ringcentral-integration/next-core';

import { formatPhoneNumber } from '../../../lib/FormatPhoneNumber';
import { contactMatchIdentifyEncode } from '../../../lib/contactMatchIdentify';
import { makeCallsUniqueIdentifies } from '../../../lib/callUniqueIdentifies';
import type { EvPresence } from '../EvPresence';
import type { EvSubscription } from '../EvSubscription';
import type { EvAgentSession } from '../EvAgentSession';
import type {
  EvCallHistoryOptions,
  FormattedCall,
  ContactMatchMapping,
  ActivityMatchMapping,
} from './EvCallHistory.interface';

/**
 * EvCallHistory module - Call history management
 * Handles call logs, contact matching, and activity matching
 */
@injectable({
  name: 'EvCallHistory',
})
class EvCallHistory extends RcModule {
  private _contactMatches: ContactMatchMapping = {};
  private _activityMatches: ActivityMatchMapping = {};

  constructor(
    private evPresence: EvPresence,
    private evSubscription: EvSubscription,
    private evAgentSession: EvAgentSession,
    private locale: Locale,
    @optional('EvCallHistoryOptions')
    private evCallHistoryOptions?: EvCallHistoryOptions,
  ) {
    super();
  }

  get contactMatches(): ContactMatchMapping {
    return this._contactMatches;
  }

  get activityMatches(): ActivityMatchMapping {
    return this._activityMatches;
  }

  get rawCalls() {
    return this.evPresence.callLogs;
  }

  get callLogsIds(): string[] {
    return this.evPresence.callLogsIds;
  }

  get callsMapping() {
    return this.evPresence.callsMapping;
  }

  /**
   * Set contact matches for matching
   */
  setContactMatches(matches: ContactMatchMapping) {
    this._contactMatches = matches;
  }

  /**
   * Set activity matches for matching
   */
  setActivityMatches(matches: ActivityMatchMapping) {
    this._activityMatches = matches;
  }

  @computed((that: EvCallHistory) => [
    that.rawCalls,
    that.contactMatches,
    that.activityMatches,
    that.locale.currentLocale,
  ])
  get formattedCalls(): FormattedCall[] {
    return this.rawCalls.slice(0, 250).map((call: any) => {
      const contactMatchIdentify = contactMatchIdentifyEncode({
        phoneNumber: call.ani,
        callType: call.callType,
      });
      const id = this._getCallId(call.session);
      const direction =
        call.callType?.toLowerCase() === 'outbound'
          ? callDirection.outbound
          : callDirection.inbound;
      const contactMatches = this.contactMatches[contactMatchIdentify] || [];
      const activityMatches = this.activityMatches[id] || [];
      const agent = {
        name: call.agentId,
        phoneNumber: this._formatPhoneNumber(call.agentId),
      };
      // Get contact name from matches
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
        name: name || this._formatPhoneNumber(call.ani),
        phoneNumber: this._formatPhoneNumber(call.ani),
      };
      const from = direction === callDirection.outbound ? agent : contact;
      const to = direction === callDirection.outbound ? contact : agent;
      return {
        id,
        direction,
        from,
        to,
        fromName: from.name || from.phoneNumber,
        toName: to.name || to.phoneNumber,
        fromMatches: contactMatches,
        toMatches: contactMatches,
        activityMatches,
        startTime: call.timestamp,
        isDisposed: false,
      };
    });
  }

  private _formatPhoneNumber(phoneNumber: string): string {
    return formatPhoneNumber({
      phoneNumber,
      countryCode: 'US',
      currentLocale: this.locale.currentLocale,
    });
  }

  private _getCallId(session: any): string {
    if (!session) return '';
    const { uii, sessionId } = session;
    return `${uii}-${sessionId}`;
  }

  @computed((that: EvCallHistory) => [that.formattedCalls])
  get lastEndedCall(): FormattedCall | null {
    return this.formattedCalls.length > 0 ? this.formattedCalls[0] : null;
  }

  @computed((that: EvCallHistory) => [that.rawCalls])
  get uniqueIdentifies(): string[] {
    return makeCallsUniqueIdentifies(this.rawCalls);
  }

  override onInitOnce() {
    watch(
      this,
      () => this.evAgentSession.configSuccess,
      (configSuccess) => {
        if (configSuccess) {
          // Trigger any necessary call history updates
        }
      },
    );
  }
}

export { EvCallHistory };
