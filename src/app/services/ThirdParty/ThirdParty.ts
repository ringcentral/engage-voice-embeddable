import {
  action,
  injectable,
  optional,
  PortManager,
  RcModule,
  state,
  delegate
} from '@ringcentral-integration/next-core';
import MessageTransport from '@ringcentral-integration/commons/lib/MessageTransport';
import {
  ContactMatcher,
} from '@ringcentral-integration/micro-contacts/src/app/services/ContactMatcher';
import {
  ActivityMatcher,
} from '@ringcentral-integration/micro-contacts/src/app/services/ActivityMatcher';

import { contactMatchIdentifyDecode } from '../../../lib/contactMatchIdentify';
import { thirdPartyMessageTypes } from '../../../enums';

/**
 * ThirdParty options for configuration
 */
export interface ThirdPartyOptions {
  targetWindow?: Window;
}

/**
 * Service configuration
 */
export interface ServiceConfig {
  name: string;
  callLoggerEnabled: boolean;
  contactMatcherEnabled: boolean;
  callLogMatcherEnabled: boolean;
  leadViewerEnabled: boolean;
}

/**
 * ThirdParty module - Contact/activity matching and call logging
 * Handles third-party integration via MessageTransport request/response pattern
 */
@injectable({
  name: 'ThirdParty',
})
class ThirdParty extends RcModule {
  public transport!: MessageTransport;
  public messageTypes = thirdPartyMessageTypes;

  constructor(
    protected portManager: PortManager,
    @optional() private contactMatcher?: ContactMatcher,
    @optional() private activityMatcher?: ActivityMatcher,
    @optional('ThirdPartyOptions')
    private thirdPartyOptions?: ThirdPartyOptions,
  ) {
    super();
    if (this.portManager?.shared) {
      this.portManager.onClient(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  initialize(): void {
    this.logger.info('initialize~~');
    if (typeof window === 'undefined') return;
    this.transport = new MessageTransport({
      targetWindow: this.thirdPartyOptions?.targetWindow ?? window.parent,
    } as any);
    this.addListeners();
    this.onAppStart();
  }

  /**
   * Called on app start to notify parent window
   */
  onAppStart() {
    this.transport._postMessage({
      type: this.messageTypes.init,
    });
  }

  @state
  service: ServiceConfig = {
    name: '',
    callLoggerEnabled: false,
    contactMatcherEnabled: false,
    callLogMatcherEnabled: false,
    leadViewerEnabled: false,
  };

  @action
  setService(service: Partial<ServiceConfig>): void {
    this.service = {
      name: service.name || '',
      callLoggerEnabled: service.callLoggerEnabled || false,
      contactMatcherEnabled: service.contactMatcherEnabled || false,
      callLogMatcherEnabled: service.callLogMatcherEnabled || false,
      leadViewerEnabled: service.leadViewerEnabled || false,
    };
  }

  get leadViewerEnabled(): boolean {
    return this.service.leadViewerEnabled;
  }

  /**
   * Add push listeners to handle messages from parent window
   */
  addListeners(): void {
    if (!this.transport) return;
    // @ts-ignore
    this.transport.addListeners({
      push: async (payload: any): Promise<void> => {
        if (typeof payload !== 'object') return;
        this.logger.info('push message~~', payload.type);
        switch (payload.type) {
          case this.messageTypes.register:
            this.register(payload);
            break;
          default:
            break;
        }
      },
    });
  }

  /**
   * Handle third-party service registration.
   * Registers contact/activity match providers when enabled.
   */
  @delegate('server')
  async register(data: any): Promise<void> {
    if (!data.service?.name) return;
    this.setService(data.service);
    if (data.service.contactMatcherEnabled) {
      this._registerContactMatch();
      this.contactMatcher?.triggerMatch();
    }
    if (data.service.callLogMatcherEnabled) {
      this._registerActivityMatch();
      this.activityMatcher?.triggerMatch();
    }
  }

  /**
   * Register a search provider with ContactMatcher
   */
  _registerContactMatch(): void {
    if (!this.contactMatcher) return;
    if ((this.contactMatcher as any)._searchProviders?.has(this.service.name)) {
      return;
    }
    this.contactMatcher.addSearchProvider({
      name: this.service.name,
      searchFn: async ({ queries }: { queries: string[] }) => {
        return this.matchContacts(queries);
      },
      readyCheckFn: () => true,
    });
  }

  /**
   * Register a search provider with ActivityMatcher
   */
  _registerActivityMatch(): void {
    if (!this.activityMatcher) return;
    if ((this.activityMatcher as any)._searchProviders?.has(this.service.name)) {
      return;
    }
    this.activityMatcher.addSearchProvider({
      name: this.service.name,
      searchFn: async ({ queries }: { queries: string[] }) => {
        return this.matchActivities(queries);
      },
      readyCheckFn: () => true,
    });
  }

  /**
   * Match contacts by phone numbers via parent window request/response
   */
  @delegate('mainClient')
  async matchContacts(queries: string[]): Promise<Record<string, any[]>> {
    try {
      const result: Record<string, any[]> = {};
      if (!this.service.contactMatcherEnabled) {
        return result;
      }
      const decodedQueries = queries.map((query) =>
        contactMatchIdentifyDecode(query),
      );
      const data = await this.transport.request({
        payload: {
          requestType: this.messageTypes.matchContacts,
          data: decodedQueries,
        },
      });
      this.logger.info('matchContacts data~~', data);
      if (!data || Object.keys(data).length === 0) {
        return result;
      }
      queries.forEach((query) => {
        const decodedQuery = contactMatchIdentifyDecode(query);
        const { phoneNumber } = decodedQuery;
        if (data[phoneNumber] && Array.isArray(data[phoneNumber])) {
          result[query] = data[phoneNumber];
        } else {
          result[query] = [];
        }
      });
      return result;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  /**
   * Match activities by session IDs via parent window request/response
   */
  @delegate('mainClient')
  async matchActivities(queries: string[]): Promise<Record<string, any[]>> {
    try {
      const result: Record<string, any[]> = {};
      if (!this.service.callLogMatcherEnabled) {
        return result;
      }
      const data = await this.transport.request({
        payload: {
          requestType: this.messageTypes.matchCallLogs,
          data: queries,
        },
      });
      if (!data || Object.keys(data).length === 0) {
        return result;
      }
      queries.forEach((query) => {
        if (data[query] && Array.isArray(data[query])) {
          result[query] = data[query];
        } else {
          result[query] = [];
        }
      });
      return result;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  /**
   * Log a call via parent window request/response.
   * Refreshes activity matches after successful logging.
   */
  @delegate('clients')
  async logCall(data: any): Promise<void> {
    if (!this.service.callLoggerEnabled) return;
    if (!this.portManager?.isActiveTab) return;
    await this.transport.request({
      payload: {
        requestType: this.messageTypes.logCall,
        data,
      },
    });
    if (this.service.callLogMatcherEnabled && this.activityMatcher) {
      this.activityMatcher.match({
        queries: [data.sessionId],
        ignoreCache: true,
      });
    }
  }

  /**
   * View a lead via parent window request/response
   */
  @delegate('clients')
  async viewLead(data: any): Promise<void> {
    if (!this.service.leadViewerEnabled) return;
    if (!this.portManager?.isActiveTab) return;
    await this.transport.request({
      payload: {
        requestType: this.messageTypes.viewLead,
        data,
      },
    });
  }
}

export { ThirdParty };
