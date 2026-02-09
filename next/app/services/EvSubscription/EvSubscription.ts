import {
  injectable,
  optional,
  RcModule,
  PortManager,
  isSharedWorker
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';

import { EvCallbackTypes } from '../EvClient/enums/callbackTypes';
import type {
  EvClientCallBackValueType,
  EvClientCallMapping,
} from '../EvClient/interfaces';
import { EvClient } from '../EvClient';
import type { EvSubscriptionOptions } from './EvSubscription.interface';

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

  constructor(
    protected evClient: EvClient,
    protected portManager: PortManager,
    @optional('EvSubscriptionOptions') protected evSubscriptionOptions?: EvSubscriptionOptions,
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

  initialize() {
    this.evClient.addListener(EvCallbackTypes.OPEN_SOCKET, () => {
      this.clientReady = true;
      this._bindUnboundEvents();
    });
    this.evClient.addListener(EvCallbackTypes.CLOSE_SOCKET, () => {
      this.clientReady = false;
    });
  }

  /**
   * Bind a single event type to evClient, forwarding to local eventEmitters
   */
  private _bindEventToClient(event: EvClientCallBackValueType) {
    if (this._boundEvents.has(event)) return;
    this.evClient.on(event, (...args: any[]) => {
      this.eventEmitters.emit(event, ...args);
    });
    this._boundEvents.add(event);
  }

  /**
   * Bind all registered events that EvSubscription hasn't bound yet
   */
  private _bindUnboundEvents() {
    for (const event of this.eventEmitters.eventNames()) {
      this._bindEventToClient(event as EvClientCallBackValueType);
    }
  }

  /**
   * Emit an event with a value
   */
  emit<T extends EvClientCallBackValueType, K extends EvClientCallMapping[T]>(
    event: T,
    value: K,
  ) {
    this.eventEmitters.emit(event, value);
  }

  /**
   * Subscribe to an event
   */
  subscribe<
    T extends EvClientCallBackValueType,
    K extends EvClientCallMapping[T],
  >(event: T, listener: (data?: K) => any): this {
    // TODO: Handle shared worker mode
    if (isSharedWorker) {
      return this;
    }
    this.eventEmitters.on(event, listener);
    if (this.clientReady) {
      this._bindEventToClient(event);
    }
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
