import {
  computed,
  injectable,
  optional,
  RcModule,
} from '@ringcentral-integration/next-core';

import type { EvAddSessionNotification, EvBaseCall } from '../EvClient/interfaces';
import { EvClient } from '../EvClient';
import { EvPresence } from '../EvPresence';
import { EvCallDataSource } from '../EvCallDataSource';
import { makeCallsUniqueIdentifies } from '../../../lib/callUniqueIdentifies';
import { contactMatchIdentifyEncode } from '../../../lib/contactMatchIdentify';
import type {
  EvCallMonitorOptions,
  EvCallData,
  OnCallRingingCallback,
  OnCallAnsweredCallback,
  OnCallEndedCallback,
} from './EvCallMonitor.interface';

// Import types for matchers - actual services come from micro-contacts
type ContactMatcher = {
  dataMapping: Record<string, any[]>;
  addQuerySource: (config: { getQueriesFn: () => string[]; readyCheckFn: () => boolean }) => void;
  forceMatchNumber: (params: { phoneNumber: string }) => Promise<void>;
};

type ActivityMatcher = {
  dataMapping: Record<string, any[]>;
  addQuerySource: (config: { getQueriesFn: () => string[]; readyCheckFn: () => boolean }) => void;
  match: (params: { queries: string[]; ignoreCache: boolean }) => Promise<void>;
  _getQueries: () => string[];
};

/**
 * EvCallMonitor module - Call monitoring with contact/activity matching
 * Enriches call data with contact and activity matches
 */
@injectable({
  name: 'EvCallMonitor',
})
class EvCallMonitor extends RcModule {
  constructor(
    private evClient: EvClient,
    private evPresence: EvPresence,
    private evCallDataSource: EvCallDataSource,
    @optional('ContactMatcher') private contactMatcher?: ContactMatcher,
    @optional('ActivityMatcher') private activityMatcher?: ActivityMatcher,
    @optional('EvCallMonitorOptions') private evCallMonitorOptions?: EvCallMonitorOptions,
  ) {
    super();
    this._registerMatcherQuerySources();
  }

  /**
   * Register query sources with matchers
   */
  private _registerMatcherQuerySources(): void {
    this.contactMatcher?.addQuerySource({
      getQueriesFn: () => this.uniqueIdentifies,
      readyCheckFn: () => this.evPresence.ready,
    });
    this.activityMatcher?.addQuerySource({
      getQueriesFn: () => this.callIds,
      readyCheckFn: () => this.evPresence.ready,
    });
  }

  /**
   * Force match contact for a call
   */
  async getMatcher({ ani, callType }: EvCallData): Promise<void> {
    if (this.contactMatcher) {
      const contactMatchIdentify = contactMatchIdentifyEncode({
        phoneNumber: ani,
        callType,
      });
      await this.contactMatcher.forceMatchNumber({
        phoneNumber: contactMatchIdentify,
      });
    }
  }

  /**
   * Check if agent is currently on a call
   */
  get isOnCall(): boolean {
    return this.calls.length > 0;
  }

  /**
   * Current agent calls
   */
  get calls(): EvBaseCall[] {
    return this.evPresence.calls || [];
  }

  /**
   * Other agent calls (transfer scenarios)
   */
  get otherCalls(): EvBaseCall[] {
    return this.evPresence.otherCalls || [];
  }

  /**
   * Call logs (ended calls)
   */
  get callLogs(): EvBaseCall[] {
    return this.evPresence.callLogs || [];
  }

  /**
   * Current agent call IDs
   */
  get callIds(): string[] {
    return this.evPresence.callIds || [];
  }

  /**
   * Other call IDs
   */
  get otherCallIds(): string[] {
    return this.evPresence.otherCallIds || [];
  }

  /**
   * Call log IDs
   */
  get callLogsIds(): string[] {
    return this.evPresence.callLogsIds || [];
  }

  /**
   * Raw calls data mapping from presence
   */
  get callsDataMapping(): Record<string, EvBaseCall> {
    return this.evPresence.callsMapping || {};
  }

  /**
   * Contact matches from ContactMatcher
   */
  get contactMatches(): Record<string, any[]> {
    return (this.contactMatcher?.dataMapping as Record<string, any[]>) || {};
  }

  /**
   * Activity matches from ActivityMatcher
   */
  get activityMatches(): Record<string, any[]> {
    return this.activityMatcher?.dataMapping || {};
  }

  /**
   * Calls mapping enriched with contact and activity matches
   */
  @computed((that: EvCallMonitor) => [
    that.callsDataMapping,
    that.contactMatches,
    that.activityMatches,
  ])
  get callsMapping(): Record<string, EvCallData> {
    const { callsDataMapping, contactMatches, activityMatches } = this;

    return Object.entries(callsDataMapping).reduce<Record<string, EvCallData>>(
      (mapping, [key, call]) => {
        const contactMatchIdentify = contactMatchIdentifyEncode({
          phoneNumber: call.ani,
          callType: call.callType,
        });

        const id = call.session ? this.getCallId(call.session) : null;
        const recordingUrl = call.session?.recordingUrl;
        const { agentFirstName, agentLastName } = call.baggage || {};

        const agentName =
          agentFirstName && agentLastName
            ? `${agentFirstName} ${agentLastName}`
            : null;

        return {
          ...mapping,
          [key]: {
            ...call,
            recordingUrl,
            agentName,
            contactMatches: contactMatches[contactMatchIdentify] || [],
            activityMatches:
              id && activityMatches[id] ? activityMatches[id] : [],
          } as EvCallData,
        };
      },
      {},
    );
  }

  /**
   * Unique identifiers for contact matching
   */
  @computed((that: EvCallMonitor) => [that.calls])
  get uniqueIdentifies(): string[] {
    return makeCallsUniqueIdentifies(this.calls);
  }

  /**
   * Get main call by UII
   */
  getMainCall(uii: string): EvBaseCall | undefined {
    return this.evPresence.getMainCall(uii);
  }

  /**
   * Check if calls are limited
   */
  get callsLimited(): boolean {
    return this.evCallDataSource.callsLimited;
  }

  /**
   * Limit calls in data source
   */
  limitCalls(): void {
    this.evCallDataSource.limitCalls();
  }

  /**
   * Get call ID from session info
   */
  getCallId({ uii, sessionId }: Partial<EvAddSessionNotification>): string {
    return this.evClient.encodeUii({ uii, sessionId });
  }

  /**
   * Get active call list for a given call ID
   */
  getActiveCallList(
    callIds: string[],
    otherCallIds: string[],
    callsMapping: Record<string, EvCallData>,
    id: string,
  ): EvCallData[] {
    return this.evPresence.getActiveCallList(
      callIds,
      otherCallIds,
      callsMapping,
      id,
    ) as EvCallData[];
  }

  /**
   * Update activity matches
   */
  async updateActivityMatches({ forceMatch = false } = {}): Promise<void> {
    if (this.activityMatcher) {
      await this.activityMatcher.match({
        queries: this.activityMatcher._getQueries(),
        ignoreCache: forceMatch,
      });
    }
  }

  /**
   * Register callback for call ringing events
   */
  onCallRinging(callback: OnCallRingingCallback): this {
    this.evPresence.onCallRinging(callback);
    return this;
  }

  /**
   * Register callback for call answered events
   */
  onCallAnswered(callback: OnCallAnsweredCallback): this {
    this.evPresence.onCallAnswered(callback);
    return this;
  }

  /**
   * Register callback for call ended events
   */
  onCallEnded(callback: OnCallEndedCallback): this {
    this.evPresence.onCallEnded(callback);
    return this;
  }
}

export { EvCallMonitor };
