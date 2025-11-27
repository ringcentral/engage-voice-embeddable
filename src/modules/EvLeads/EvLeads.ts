import { Module } from '@ringcentral-integration/commons/lib/di';
import {
  action,
  computed,
  RcModuleV2,
  state,
  storage,
  track,
} from '@ringcentral-integration/core';
import { EvCallbackTypes } from '@ringcentral-integration/engage-voice-widgets/lib/EvClient/enums/callbackTypes';
import { Deps, EvLeadsOptions, Lead } from './EvLeads.interface';

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

export const ALLOW_DIAL_STATES = [
  'PENDING',
  'READY',
  'CALLBACK',
  'AGENT-CALLBACK',
  'PENDING-CALLBACK',
  'COMPLETE',
];

export const DISABLE_DIAL_STATES = [
  'PENDING',
  'ACTIVE',
  'PENDING-HCI'
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

  // to check if the leads are loaded once
  @state
  loaded = false;

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
    this.loaded = true;
    this.leadStatesMapping = {};
  }

  @computed((that) => [that.leads, that.leadStatesMapping])
  get filteredLeads() {
    return this.leads.filter((lead) => {
      const destination = lead.destination;
      if (!destination) {
        return false;
      }
      const leadState = this.leadStatesMapping[lead.requestId] || lead.leadState;
      if (leadState === 'COMPLETE') {
        return false;
      }
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

  async fetchLeads() {
    if (this.loading) {
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
