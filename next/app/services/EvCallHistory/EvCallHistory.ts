import { Locale } from '@ringcentral-integration/micro-core/src/app/services';

import { callDirection } from '../../../enums';
import {
  action,
  computed,
  injectable,
  optional,
  RcModule,
  state,
  watch,
} from '@ringcentral-integration/next-core';

import { formatPhoneNumber } from '../../../lib/FormatPhoneNumber';
import { contactMatchIdentifyEncode } from '../../../lib/contactMatchIdentify';
import { makeCallsUniqueIdentifies } from '../../../lib/callUniqueIdentifies';
import { EvPresence } from '../EvPresence';
import { EvSubscription } from '../EvSubscription';
import { EvAgentSession } from '../EvAgentSession';
import { EvCallDisposition } from '../EvCallDisposition';
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
  private _searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private evPresence: EvPresence,
    private evSubscription: EvSubscription,
    private evAgentSession: EvAgentSession,
    private evCallDisposition: EvCallDisposition,
    private locale: Locale,
    @optional('EvCallHistoryOptions')
    private evCallHistoryOptions?: EvCallHistoryOptions,
  ) {
    super();
  }

  @state
  searchInput = '';

  @action
  updateSearchInput(value: string) {
    this.searchInput = value;
  }

  /**
   * Debounced search - triggers search after delay
   */
  debouncedSearch() {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
    }
    this._searchDebounceTimer = setTimeout(() => {
      // Search is applied via computed property filtering
      this._searchDebounceTimer = null;
    }, 300);
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
    that.evCallDisposition.dispositionStateMapping,
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
      // Get contact name from matches (enhanced matching from old module)
      let name = '';
      if (contactMatches.length > 0) {
        name = contactMatches[0].name;
      }
      // Enhanced: when both contactMatches and activityMatches exist, find the matched contact
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
      // Calculate isDisposed from evCallDisposition or activityMatches
      const isDisposed =
        this.evCallDisposition.isDisposed(id) || activityMatches.length > 0;
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
        isDisposed,
        isLogged: isDisposed,
        result: call.result || undefined,
        telephonySessionId: call.session?.uii,
        sessionId: call.session?.sessionId,
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

  /**
   * Latest calls - filtered by search input if provided
   */
  @computed((that: EvCallHistory) => [that.formattedCalls, that.searchInput])
  get latestCalls(): FormattedCall[] {
    if (!this.searchInput || this.searchInput.trim() === '') {
      return this.formattedCalls;
    }
    const searchTerm = this.searchInput.toLowerCase().trim();
    return this.formattedCalls.filter((call) => {
      const fromName = call.fromName?.toLowerCase() || '';
      const toName = call.toName?.toLowerCase() || '';
      const fromPhone = call.from?.phoneNumber?.toLowerCase() || '';
      const toPhone = call.to?.phoneNumber?.toLowerCase() || '';
      return (
        fromName.includes(searchTerm) ||
        toName.includes(searchTerm) ||
        fromPhone.includes(searchTerm) ||
        toPhone.includes(searchTerm)
      );
    });
  }

  @computed((that: EvCallHistory) => [that.rawCalls])
  get uniqueIdentifies(): string[] {
    return makeCallsUniqueIdentifies(this.rawCalls);
  }

  /**
   * Update last check timestamp - called on focus
   */
  updateLastCheckTimeStamp() {
    // Placeholder for any timestamp tracking logic
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
