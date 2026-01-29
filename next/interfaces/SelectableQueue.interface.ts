import type { EvAvailableQueue } from '../app/services/EvClient';

export type AvailableQueue = Pick<EvAvailableQueue, 'gateId' | 'gateName'> & {
  checked: boolean;
};
