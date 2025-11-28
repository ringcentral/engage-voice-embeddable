import { Module } from '@ringcentral-integration/commons/lib/di';
import {
  action,
  computed,
  RcModuleV2,
  state,
} from '@ringcentral-integration/core';
import { EvCallbackTypes } from '@ringcentral-integration/engage-voice-widgets/lib/EvClient/enums/callbackTypes';
import { Deps, EvLeadsOptions, Lead } from './EvLeads.interface';

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

function allNumbersDialed(lead: Lead) {
  const dialedList = lead.dialedList || [];
  let destination = lead.destination || [];
  if (destination && !Array.isArray(destination)) {
    destination = destination.split(PHONE_DELIMETER);
  }
  return dialedList.length === destination.length;
}

@Module({
  name: 'EvLeads',
  deps: [
    { dep: 'EvClient' },
    { dep: 'EvAuth' },
    { dep: 'EvSubscription' },
    { dep: 'Alert' },
  ],
})
export class EvLeads extends RcModuleV2<Deps, EvLeadsOptions> {
  constructor(deps: Deps) {
    super({
      deps,
    });
  }

  override onInitOnce() {
    this._bindSubscription();
  }

  @state
  leads: Lead[] = [];

  @state
  loading = false;

  // to check if no leads are returned
  @state
  noLeadsReturned = false;

  @state
  leadStatesMapping: Record<string, boolean> = {};

  @action
  setLeadStatesMapping(requestId: string, availableLeadState: boolean) {
    this.leadStatesMapping[requestId] = availableLeadState;
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
  updateLead(leadId, newProps = {}) {
    const lead = this.leads.find((lead) => lead.leadId === leadId);
    if (lead) {
      Object.keys(newProps).forEach((key) => {
        lead[key] = newProps[key];
      });
    }
  }

  @computed((that) => [that.leads, that.leadStatesMapping])
  get filteredLeads() {
    return this.leads.filter((lead) => {
      const destination = lead.destination;
      if (lead.completed) {
        return false;
      }
      const leadState = this.leadStatesMapping[lead.requestId] || lead.leadState;
      let availableLeadState =  AVAILABLE_LEAD_STATES.includes(leadState as string);
      let allDialed = false;
      if (
        destination.indexOf(PHONE_DELIMETER) > -1 ||
        Array.isArray(destination)
      ) {
        allDialed = allNumbersDialed(lead);
        // multi lead, state may be answered
        if (!allDialed && !availableLeadState) {
          availableLeadState = true;
        }
      }
      return availableLeadState && !allDialed;
    });
  }

  private _bindSubscription() {
    this._deps.evSubscription.subscribe(EvCallbackTypes.PREVIEW_LEAD_STATE, (data) => {
      this.setLeadStatesMapping(data.requestId, data.leadState);
    });
  }

  _requiredToCall() {
    if (!this._deps.evAuth.agent?.agentConfig?.agentPermissions?.requireFetchedLeadsCalled) {
      return false;
    }
    return this.filteredLeads.some((lead) => {
      return (
        !lead.completed &&
        lead.leadState.toUpperCase() === 'PENDING'
      );
    });
  }

  async manualPassLead({
    lead,
    dispositionId,
    notes,
    callback,
    callbackDTS,
  }: {
    lead: Lead;
    dispositionId: string;
    notes: string;
    callback: boolean;
    callbackDTS: string;
  }) {
    try {
      await this._deps.evClient.manualPass({
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
      this._deps.alert.danger({ message: 'leadPassFailed' });
    }
  }

  async fetchLeads() {
    if (this.loading) {
      return;
    }
    if (this._requiredToCall()) {
      this._deps.alert.warning({ message: 'requiredLeadCall' });
      return;
    }
    try {
      this.setLoading(true);
      const { evClient } = this._deps;
      const result = await evClient.getPreviewDial();
      this.setLeads(result.leads as Lead[]);
    } catch (error) {
      console.error('error', error);
    } finally {
      this.setLoading(false);
    }
  }
}
