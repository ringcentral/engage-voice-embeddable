import {
  injectable,
  optional,
  RcModule,
  PortManager,
  delegate,
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';

import { EvCallbackTypes } from '../EvClient/enums/callbackTypes';
import type {
  EvClientCallBackValueType,
  EvClientCallMapping,
} from '../EvClient/interfaces';
import { EvClient } from '../EvClient';
import type { EvSubscriptionOptions } from './EvSubscription.interface';

function formatSipRequest(data: any) {
  return {
    body: data?.body,
    data: data?.data,
    from: data?.from,
    fromTag: data?.fromTag,
    friendlyName: data?.friendlyName,
    to: data?.to,
    toTag: data?.toTag,
    headers: data?.headers,
    method: data?.method,
    rurl: data?.url,
    callId: data?.callId,
    type: data?.type,
    via: data?.via,
    viaBranch: data?.viaBranch,
  };
}

const SIP_REQUEST_EVENTS = [
  EvCallbackTypes.SIP_ENDED,
  EvCallbackTypes.SIP_MUTE,
  EvCallbackTypes.SIP_RINGING,
  EvCallbackTypes.SIP_UNMUTE,
];

/**
 * EvSubscription module - Event subscription system
 * Wraps EvClient callbacks with EventEmitter for easier subscription management
 */
@injectable({
  name: 'EvSubscription',
})
class EvSubscription extends RcModule {
  protected eventEmitters = new EventEmitter();
  protected clientReady = false;
  private _boundEvents = new Set<EvClientCallBackValueType>();
  private _subscribedEvents = new Set<EvClientCallBackValueType>();

  constructor(
    protected evClient: EvClient,
    protected portManager: PortManager,
    @optional('EvSubscriptionOptions') protected evSubscriptionOptions?: EvSubscriptionOptions,
  ) {
    super();
    if (this.portManager?.shared) {
      this.portManager.onMainTab(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  initialize() {
    this.evClient.addListener(EvCallbackTypes.OPEN_SOCKET, async () => {
      this.clientReady = true;
      const events = Array.from(this._subscribedEvents);
      const serverEvents = await this.getSubscribedEventsFromServer();
      await this._bindEventsToClient([...events, ...serverEvents] as string[]);
    });
    this.evClient.addListener(EvCallbackTypes.CLOSE_SOCKET, () => {
      this.clientReady = false;
    });
  }

  /**
   * Bind a single event type to evClient, forwarding to local eventEmitters
   */
  private _bindEventToClient(event: EvClientCallBackValueType) {
    this._subscribedEvents.add(event);
    if (this._boundEvents.has(event)) return;
    if (this.portManager.isMainTab && this.clientReady) {
      this.evClient.on(event, (...args: any[]) => {
        if (SIP_REQUEST_EVENTS.includes(event)) {
          const data = args[0]?.data;
          this.emit(event, {
            message: args[0]?.message,
            data: data ? {
              request: data.request ? formatSipRequest(data.request) : undefined,
            } : undefined,
          });
          return;
        }
        this.emit(event, ...args);
      });
      this._boundEvents.add(event);
    }
  }

  @delegate('mainClient')
  private async _bindEventsToClient(events: string[]) {
    for (const event of events) {
      this._bindEventToClient(event as EvClientCallBackValueType);
    }
  }

  /**
   * Emit an event with a value
   * We transfer the event from main client to server. Other services should handle the event in server.
   */
  @delegate('server')
  async emit<T extends EvClientCallBackValueType, K extends EvClientCallMapping[T]>(
    event: T,
    ...args: K[]
  ) {
    this.eventEmitters.emit(event, ...args);
  }

  @delegate('server')
  async getSubscribedEventsFromServer() {
    // get from eventEmitters
    return Array.from(this.eventEmitters.eventNames() as EvClientCallBackValueType[]);
  }

  /**
   * Subscribe to an event
   */
  subscribe<
    T extends EvClientCallBackValueType,
    K extends EvClientCallMapping[T],
  >(event: T, listener: (data?: K) => any): this {
    this.eventEmitters.on(event, listener);
    this._bindEventsToClient([event]);
    return this;
  }

  /**
   * Subscribe to an event once
   */
  once<T extends EvClientCallBackValueType, K extends EvClientCallMapping[T]>(
    event: T,
    listener: (data?: K) => any,
  ) {
    this.eventEmitters.once(event, listener);
  }

  /**
   * Unsubscribe from an event
   */
  off<T extends EvClientCallBackValueType, K extends EvClientCallMapping[T]>(
    event: T,
    listener: (data?: K) => any,
  ) {
    this.eventEmitters.off(event, listener);
  }
}

export { EvSubscription };
