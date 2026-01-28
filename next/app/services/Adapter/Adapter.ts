import type { Alert } from '@ringcentral-integration/commons/modules/Alert';
import {
  action,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
} from '@ringcentral-integration/next-core';

import { adapterMessageTypes } from '../../../enums';
import type { EvAuth } from '../EvAuth';
import type { EvCall } from '../EvCall';
import type { EvLeads } from '../EvLeads';
import type { EvPresence } from '../EvPresence';

/**
 * Adapter options for configuration
 */
export interface AdapterOptions {
  targetWindow?: Window;
}

/**
 * Size state
 */
export interface AdapterSize {
  width: number;
  height: number;
}

/**
 * Position state
 */
export interface AdapterPosition {
  translateX: number | null;
  translateY: number | null;
  minTranslateX: number | null;
  minTranslateY: number | null;
}

/**
 * Adapter module - Parent window communication
 * Handles click-to-dial, environment changes, and adapter state
 */
@injectable({
  name: 'Adapter',
})
class Adapter extends RcModule {
  private _lastClosed = false;
  private _lastMinimized = false;
  private _lastPosition: AdapterPosition = {
    translateX: null,
    translateY: null,
    minTranslateX: null,
    minTranslateY: null,
  };

  constructor(
    private evAuth: EvAuth,
    private evCall: EvCall,
    private evLeads: EvLeads,
    private evPresence: EvPresence,
    private alert: Alert,
    private storagePlugin: StoragePlugin,
    @optional('AdapterOptions') private adapterOptions?: AdapterOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    this._initTransport();
  }

  @storage
  @state
  closed = false;

  @storage
  @state
  minimized = false;

  @storage
  @state
  size: AdapterSize = { width: 300, height: 500 };

  @storage
  @state
  position: AdapterPosition = {
    translateX: null,
    translateY: null,
    minTranslateX: null,
    minTranslateY: null,
  };

  @action
  setClosed(closed: boolean) {
    this.closed = closed;
  }

  @action
  setMinimized(minimized: boolean) {
    this.minimized = minimized;
  }

  @action
  setSize(size: AdapterSize) {
    this.size = size;
  }

  @action
  setPosition(position: AdapterPosition) {
    this.position = position;
  }

  private _initTransport() {
    const targetWindow = this.adapterOptions?.targetWindow ?? window.parent;
    window.addEventListener('message', (event) => {
      if (event.source !== targetWindow) return;
      this._handleMessage(event.data);
    });
    this._postMessage({ type: adapterMessageTypes.init });
  }

  private _handleMessage(payload: any) {
    if (typeof payload !== 'object') return;
    switch (payload.type) {
      case adapterMessageTypes.syncClosed:
        this.setClosed(payload.closed);
        break;
      case adapterMessageTypes.syncMinimized:
        this.setMinimized(payload.minimized);
        break;
      case adapterMessageTypes.syncSize:
        this.setSize(payload.size);
        break;
      case adapterMessageTypes.syncPosition:
        this.setPosition(payload.position);
        break;
      case adapterMessageTypes.clickToDial:
        this.clickToDial(payload.phoneNumber);
        break;
      case adapterMessageTypes.setEnvironment:
        this.setEnvironment();
        break;
      case adapterMessageTypes.logout:
        this.evAuth.logout();
        break;
      case adapterMessageTypes.dialLead:
        this.dialLead(payload.lead, payload.destination);
        break;
      default:
        break;
    }
  }

  async clickToDial(phoneNumber: string): Promise<void> {
    await this.evCall.dialout(phoneNumber);
  }

  async dialLead(leadProps: any, destination: string): Promise<void> {
    const leads = this.evLeads.filteredLeads;
    const lead = leads.find((l) => {
      if (leadProps.leadId) return l.leadId === leadProps.leadId;
      if (leadProps.requestId) return l.requestId === leadProps.requestId;
      if (leadProps.externId) return l.externId === leadProps.externId;
      return false;
    });
    if (!lead) return;
    try {
      await this.evLeads.dialLead(lead, destination);
      this.onCallLead(lead, destination);
    } catch (error) {
      console.error('Error calling lead', error);
    }
  }

  setEnvironment(): void {
    if ((window as any).toggleEnv) {
      (window as any).toggleEnv();
    }
  }

  onNewCall(call: any): void {
    this._postMessage({ type: adapterMessageTypes.newCall, call });
  }

  onRingCall(call: any): void {
    this._postMessage({ type: adapterMessageTypes.ringCall, call });
  }

  onEndCall(call: any): void {
    this._postMessage({ type: adapterMessageTypes.endCall, call });
  }

  onCallLead(lead: any, destination: string): void {
    this._postMessage({ type: adapterMessageTypes.callLead, lead, destination });
  }

  onLoadLeads(leads: any[]): void {
    this._postMessage({ type: adapterMessageTypes.loadLeads, leads });
  }

  popUpWindow(): void {
    this.setMinimized(false);
  }

  private _postMessage(msg: any): void {
    const targetWindow = this.adapterOptions?.targetWindow ?? window.parent;
    targetWindow.postMessage(msg, '*');
  }
}

export { Adapter };
