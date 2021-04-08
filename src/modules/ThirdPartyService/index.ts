import { Module } from 'ringcentral-integration/lib/di';
import MessageTransport from 'ringcentral-integration/lib/MessageTransport';
import { contactMatchIdentifyDecode } from '@ringcentral-integration/engage-voice-widgets/lib/contactMatchIdentify';

import {
  RcModuleV2,
  state,
  action,
} from '@ringcentral-integration/core/lib/RcModule';

import { Interface, Deps } from './interface';

import messageTypes from '../../enums/messageTypes';

@Module({
  deps: [
    'ContactMatcher',
    'ActivityMatcher',
    { dep: 'ThirdPartyServiceOptions', optional: true },
  ],
})
class ThirdPartyService extends RcModuleV2<Deps>
  implements Interface {
  public transport: MessageTransport;
  public messageTypes: typeof messageTypes;

  constructor(deps: Deps) {
    super({
      deps,
    });

    this.messageTypes = messageTypes;
    this.transport = new MessageTransport({
      targetWindow: this._deps.thirdPartyServiceOptions?.targetWindow ?? window.parent,
    } as any);
    this.addListeners();
  }

  @state
  service = {
    name: '',
    callLoggerEnabled: false,
    contactMatcherEnabled: false,
    callLogMatcherEnabled: false,
  };

  @action
  setService(service) {
    this.service = {
      name: service.name,
      callLoggerEnabled: service.callLoggerEnabled,
      contactMatcherEnabled: service.contactMatcherEnabled,
      callLogMatcherEnabled: service.callLogMatcherEnabled,
    };
  }

  addListeners() {
    // @ts-ignore
    this.transport.addListeners({
      push: async (payload): Promise<any> => {
        if (typeof payload !== 'object') return;
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

  register(data) {
    if (data.service && data.service.name) {
      this.setService(data.service);
      if (data.service.contactMatcherEnabled) {
        this.registerContactMatch();
        this._deps.contactMatcher.triggerMatch();
      }
      if (data.service.callLogMatcherEnabled) {
        this.registerActivityMatch();
        this._deps.activityMatcher.triggerMatch();
      }
    }
  }

  registerContactMatch() {
    if (this._deps.contactMatcher._searchProviders.has(this.service.name)) {
      return;
    }
    this._deps.contactMatcher.addSearchProvider({
      name: this.service.name,
      searchFn: async ({ queries }) => {
        const result = await this.matchContacts(queries);
        return result;
      },
      readyCheckFn: () => true,
    });
  }

  async matchContacts(queries: any[]) {
    try {
      const result = {};
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
      if (!data || Object.keys(data).length === 0) {
        return result;
      }
      queries.forEach((query) => {
        const decodedQuery = contactMatchIdentifyDecode(query);
        const phoneNumber = decodedQuery.phoneNumber;
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

  registerActivityMatch() {
    if (this._deps.activityMatcher._searchProviders.has(this.service.name))
      return;
    this._deps.activityMatcher.addSearchProvider({
      name: this.service.name,
      searchFn: async ({ queries }: any) => {
        const result = await this.matchActivities(queries);
        return result;
      },
      readyCheckFn: () => true,
    });
  }

  async matchActivities(queries: any[]) {
    try {
      const result = {};
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

  async logCall(data) {
    if (!this.service.callLoggerEnabled) {
      return;
    }
    await this.transport.request({
      payload: {
        requestType: this.messageTypes.logCall,
        data,
      },
    });
    if (this.service.callLogMatcherEnabled) {
      this._deps.activityMatcher.match({
        queries: [data.sessionId],
        ignoreCache: true
      });
    }
  }
}

export { ThirdPartyService };
