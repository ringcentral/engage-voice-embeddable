import {
  action,
  injectable,
  optional,
  RcModule,
  state,
} from '@ringcentral-integration/next-core';

import { contactMatchIdentifyDecode } from '../../../lib/contactMatchIdentify';
import { thirdPartyMessageTypes } from '../../../enums';

/**
 * ThirdPartyService options for configuration
 */
export interface ThirdPartyServiceOptions {
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
 * ThirdPartyService module - Contact/activity matching
 * Handles third-party integration for contact matching and call logging
 */
@injectable({
  name: 'ThirdPartyService',
})
class ThirdPartyService extends RcModule {
  private _contactMatches: Record<string, any[]> = {};
  private _activityMatches: Record<string, any[]> = {};

  constructor(
    @optional('ThirdPartyServiceOptions')
    private thirdPartyServiceOptions?: ThirdPartyServiceOptions,
  ) {
    super();
    this._initTransport();
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
  setService(service: Partial<ServiceConfig>) {
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

  get contactMatches(): Record<string, any[]> {
    return this._contactMatches;
  }

  get activityMatches(): Record<string, any[]> {
    return this._activityMatches;
  }

  private _initTransport(): void {
    // TODO: Handle worker mode
    if (typeof window === 'undefined') return;
    const targetWindow = this.thirdPartyServiceOptions?.targetWindow ?? window.parent;
    window.addEventListener('message', (event) => {
      if (event.source !== targetWindow) return;
      this._handleMessage(event.data);
    });
  }

  private _handleMessage(payload: any): void {
    if (typeof payload !== 'object') return;
    switch (payload.type) {
      case thirdPartyMessageTypes.register:
        this.register(payload);
        break;
      default:
        break;
    }
  }

  register(data: any): void {
    if (data.service && data.service.name) {
      this.setService(data.service);
    }
  }

  /**
   * Match contacts by phone numbers
   */
  async matchContacts(queries: string[]): Promise<Record<string, any[]>> {
    if (!this.service.contactMatcherEnabled) {
      return {};
    }
    // Would send request to parent window and wait for response
    return {};
  }

  /**
   * Match activities by session IDs
   */
  async matchActivities(queries: string[]): Promise<Record<string, any[]>> {
    if (!this.service.callLogMatcherEnabled) {
      return {};
    }
    // Would send request to parent window and wait for response
    return {};
  }

  /**
   * Log a call
   */
  async logCall(data: any): Promise<void> {
    if (!this.service.callLoggerEnabled) return;
    const targetWindow = this.thirdPartyServiceOptions?.targetWindow ?? window.parent;
    targetWindow.postMessage({
      type: thirdPartyMessageTypes.logCall,
      data,
    }, '*');
  }

  /**
   * View a lead
   */
  async viewLead(data: any): Promise<void> {
    if (!this.service.leadViewerEnabled) return;
    const targetWindow = this.thirdPartyServiceOptions?.targetWindow ?? window.parent;
    targetWindow.postMessage({
      type: thirdPartyMessageTypes.viewLead,
      data,
    }, '*');
  }
}

export { ThirdPartyService };
