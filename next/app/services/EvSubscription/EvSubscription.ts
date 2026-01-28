import {
  injectable,
  optional,
  RcModule,
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';

import type {
  EvClientCallBackValueType,
  EvClientCallMapping,
} from '../../../lib/EvClient/interfaces';
import type { EvClient } from '../EvClient';
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

  constructor(
    private evClient: EvClient,
    @optional('EvSubscriptionOptions')
    private evSubscriptionOptions?: EvSubscriptionOptions,
  ) {
    super();
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
    if (!this.evClient.getEventCallback(event)) {
      this.evClient.on(event, (...args: any[]) => {
        this.eventEmitters.emit(event, ...args);
      });
    }
    this.eventEmitters.on(event, listener);
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
