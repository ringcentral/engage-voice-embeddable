import {
  action,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
} from '@ringcentral-integration/next-core';

import { EvClient } from '../EvClient';
import { EvPresence } from '../EvPresence';
import type {
  EvCallDispositionOptions,
  EvCallDispositionData,
  EvCallDispositionMapping,
  EvDispositionState,
  EvDispositionStateMapping,
} from './EvCallDisposition.interface';

/**
 * EvCallDisposition module - Call disposition management
 * Handles call disposition selection and submission
 */
@injectable({
  name: 'EvCallDisposition',
})
class EvCallDisposition extends RcModule {
  constructor(
    private evClient: EvClient,
    private evPresence: EvPresence,
    private storagePlugin: StoragePlugin,
    @optional('EvCallDispositionOptions')
    private evCallDispositionOptions?: EvCallDispositionOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

  @storage
  @state
  callsMapping: EvCallDispositionMapping = {};

  @storage
  @state
  dispositionStateMapping: EvDispositionStateMapping = {};

  @action
  setDisposition(id: string, data: EvCallDispositionData) {
    this.callsMapping[id] = data;
  }

  @action
  removeDisposition(id: string) {
    delete this.callsMapping[id];
  }

  @action
  setDispositionState(id: string, state: EvDispositionState) {
    this.dispositionStateMapping[id] = state;
  }

  override onInitOnce() {
    // Set default disposition when call is answered
    // This would typically be connected to EvCallMonitor events
  }

  /**
   * Dispose a call with the selected disposition
   * Includes safety check to ensure callDisposition exists
   */
  disposeCall(id: string) {
    const call = this.evPresence.callsMapping[id];
    const callDisposition = this.callsMapping[id];
    // Safety check - return early if no disposition data
    if (!callDisposition) {
      return;
    }
    const isDisposed =
      this.dispositionStateMapping[id] &&
      this.dispositionStateMapping[id].disposed;
    if (!call?.outdialDispositions || isDisposed) {
      return;
    }
    this.evClient.dispositionCall({
      uii: call.uii,
      dispId: callDisposition.dispositionId || '',
      notes: callDisposition.notes,
    });
    this.setDispositionState(id, { disposed: true });
  }

  /**
   * Initialize disposition for a call with default value
   */
  initDisposition(callId: string, outdialDispositions: any) {
    if (outdialDispositions) {
      const disposition = outdialDispositions.dispositions?.find(
        (d: any) => d.isDefault,
      );
      this.setDisposition(callId, {
        dispositionId: disposition ? disposition.dispositionId : null,
        notes: '',
      });
    }
  }

  /**
   * Get disposition for a specific call
   */
  getDisposition(id: string): EvCallDispositionData | undefined {
    return this.callsMapping[id];
  }

  /**
   * Check if a call has been disposed
   */
  isDisposed(id: string): boolean {
    return this.dispositionStateMapping[id]?.disposed || false;
  }
}

export { EvCallDisposition };
