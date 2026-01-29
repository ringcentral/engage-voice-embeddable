import { Toast } from '@ringcentral-integration/micro-core/src/app/services';
import {
  action,
  computed,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
} from '@ringcentral-integration/next-core';

import { EvCallbackTypes } from '../EvClient/enums';
import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import { EvSubscription } from '../EvSubscription';
import { EvCall } from '../EvCall';
import type { EvLeadsOptions, Lead, ManualPassParams } from './EvLeads.interface';

// Available to show in the leads panel
export const AVAILABLE_LEAD_STATES = [
  'PENDING',
  'DIALING',
  'RINGING',
  'NOANSWER',
  'BUSY',
  'MACHINE',
  'HANGUP',
  'INTERCEPT',
  'DISCONNECT',
  'ABANDON',
  'CONGESTION',
  'APP-DNC',
  'OTHER',
];

// Available to dial
export const ALLOW_DIAL_STATES = [
  'PENDING',
  'READY',
  'CALLBACK',
  'AGENT-CALLBACK',
  'PENDING-CALLBACK',
  'COMPLETE',
];

// Disable dial from search results
export const SEARCH_DISABLE_DIAL_STATES = [
  'PENDING',
  'ACTIVE',
  'PENDING-HCI',
  'DO-NOT-CALL',
  'EXPIRED',
];

// Disable manual pass
export const DISABLE_MANUAL_PASS_STATES = [
  'DO-NOT-CALL',
  'DIALING',
  'RINGING',
  'ANSWER',
];

export const PHONE_DELIMETER = '|';

function allNumbersDialed(lead: Lead): boolean {
  const dialedList = lead.dialedList || [];
  let destination = lead.destination || [];
  if (destination && !Array.isArray(destination)) {
    destination = destination.split(PHONE_DELIMETER);
  }
  return dialedList.length === destination.length;
}

function isE164(phoneNumber: string): boolean {
  const isOnlyNumber = /^[0-9+]+$/.test(phoneNumber);
  return isOnlyNumber && phoneNumber.startsWith('+');
}

/**
 * EvLeads module - Lead management
 * Handles lead fetching, dialing, and manual pass
 */
@injectable({
  name: 'EvLeads',
})
class EvLeads extends RcModule {
  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private evSubscription: EvSubscription,
    private evCall: EvCall,
    private toast: Toast,
    private storagePlugin: StoragePlugin,
    @optional('EvLeadsOptions') private evLeadsOptions?: EvLeadsOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

  override onInitOnce() {
    this._bindSubscription();
    this.evAuth.beforeAgentLogout(() => {
      this.clearLeads();
    });
  }

  @storage
  @state
  leads: Lead[] = [];

  @state
  loading = false;

  @storage
  @state
  noLeadsReturned = false;

  @storage
  @state
  leadStatesMapping: Record<string, string> = {};

  @action
  setLeadStatesMapping(requestId: string, leadState: string) {
    this.leadStatesMapping[requestId] = leadState;
  }

  @action
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action
  setLeads(leads: Lead[]) {
    this.leads = leads;
    this.noLeadsReturned = !leads || leads.length === 0;
    this.leadStatesMapping = {};
  }

  @action
  updateLead(leadId: string, newProps: Partial<Lead> = {}) {
    const lead = this.leads.find((l) => l.leadId === leadId);
    if (lead) {
      Object.keys(newProps).forEach((key) => {
        (lead as any)[key] = newProps[key];
      });
    }
  }

  @action
  clearLeads() {
    this.leads = [];
    this.noLeadsReturned = false;
    this.leadStatesMapping = {};
  }

  @computed((that: EvLeads) => [that.leads, that.leadStatesMapping])
  get filteredLeads(): Lead[] {
    return this.leads.filter((lead) => {
      const destination = lead.destination;
      if (lead.completed) {
        return false;
      }
      const leadState = this.leadStatesMapping[lead.requestId] || lead.leadState;
      let availableLeadState = AVAILABLE_LEAD_STATES.includes(leadState as string);
      let allDialed = false;
      if (
        (typeof destination === 'string' && destination.indexOf(PHONE_DELIMETER) > -1) ||
        Array.isArray(destination)
      ) {
        allDialed = allNumbersDialed(lead);
        if (!allDialed && !availableLeadState) {
          availableLeadState = true;
        }
      }
      return availableLeadState && !allDialed;
    });
  }

  private _bindSubscription() {
    this.evSubscription.subscribe(EvCallbackTypes.PREVIEW_LEAD_STATE, (data: any) => {
      this.setLeadStatesMapping(data.requestId, data.leadState);
    });
  }

  private _requiredToCall(): boolean {
    if (!this.evAuth.agent?.agentConfig?.agentPermissions?.requireFetchedLeadsCalled) {
      return false;
    }
    return this.filteredLeads.some((lead) => {
      return (
        !lead.completed &&
        lead.leadState.toUpperCase() === 'PENDING'
      );
    });
  }

  /**
   * Manual pass a lead with disposition
   */
  async manualPassLead({
    lead,
    dispositionId,
    notes,
    callback,
    callbackDTS,
  }: ManualPassParams): Promise<void> {
    try {
      await this.evClient.manualPass({
        dispId: dispositionId,
        notes,
        callback,
        callbackDTS: callback ? callbackDTS : '',
        leadId: lead.leadId,
        requestId: lead.requestId,
        externId: lead.externId,
      });
      this.updateLead(lead.leadId, { completed: true });
    } catch (error) {
      this.toast.danger({ message: 'leadPassFailed' });
    }
  }

  /**
   * Fetch leads from preview dial
   */
  async fetchLeads(): Promise<boolean> {
    if (this.loading) {
      return false;
    }
    if (this._requiredToCall()) {
      this.toast.warning({ message: 'requiredLeadCall' });
      return false;
    }
    try {
      this.setLoading(true);
      const result = await this.evClient.getPreviewDial();
      this.setLeads(result.leads as Lead[]);
      return true;
    } catch (error) {
      console.error('error', error);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Dial a lead
   */
  async dialLead(lead: Lead, destination: string): Promise<void> {
    const destinationE164 = isE164(destination) ? destination : undefined;
    const dialedList = lead.dialedList || [];
    const newDialedList = [...dialedList, destination];
    this.updateLead(lead.leadId, { dialedList: newDialedList });
    await this.evCall.previewDial(lead.requestId, destination, destinationE164 || '');
  }
}

export { EvLeads };
