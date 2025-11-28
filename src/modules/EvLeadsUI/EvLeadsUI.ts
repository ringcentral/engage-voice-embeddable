import { Module } from '@ringcentral-integration/commons/lib/di';
import { RcUIModuleV2 } from '@ringcentral-integration/core';
import { dialoutStatuses } from '@ringcentral-integration/engage-voice-widgets/enums';

import { Deps } from './EvLeadsUI.interface';

function isE164(phoneNumber: string) {
  const isOnlyNumber = /^[0-9]+$/.test(phoneNumber);
  return isOnlyNumber && phoneNumber.startsWith('+');
}

const AGENT_BUSY_STATES = ['TRANSITION', 'ENGAGED', 'RNA-STATE'];

@Module({
  name: 'EvLeadsUI',
  deps: [
    'EvLeads',
    'EvCall',
    'Locale',
    'EvAgentSession',
    'EvWorkingState',
    'EvAuth',
    'EvClient',
    'Alert',
  ],
})
export class EvLeadsUI extends RcUIModuleV2<Deps> {
  constructor(deps: Deps) {
    super({
      deps,
    });
  }

  getUIProps() {
    const { evLeads, locale, evCall, evAgentSession, evWorkingState, evAuth } = this._deps;
    return {
      leads: evLeads.filteredLeads,
      currentLocale: locale.currentLocale,
      loading: evLeads.loading,
      noLeadsReturned: evLeads.noLeadsReturned,
      isDialing: evCall.dialoutStatus === dialoutStatuses.dialing,
      pendingDisposition: evWorkingState.isPendingDisposition,
      agentBusy: AGENT_BUSY_STATES.includes(evAgentSession.agentState),
      allowManualPass: evAuth.agent?.agentConfig?.agentPermissions?.allowManualPass,
      defaultTimezone: evAuth.agent?.authenticateResponse?.regionalSettings?.timezoneName,
    };
  }

  getUIFunctions() {
    const { evLeads, evCall, evClient } = this._deps;
    return {
      getLeads: () => evLeads.fetchLeads(),
      dialLead: async (lead, destination) => {
        let destinationE164 = isE164(destination) ? destination : undefined;
        const dialedList = lead.dialedList || [];
        const newDialedList = [...dialedList, destination];
        evLeads.updateLead(lead.leadId, { dialedList: newDialedList });
        await evCall.previewDial(lead.requestId, destination, destinationE164);
      },
      fetchDispositionList: async (campaignId: string) => {
        const list = await evClient.getCampaignDispositions(campaignId);
        return list.map((item) => ({
          value: item.dispositionId,
          label: item.disposition,
        }));
      },
      onPass: async (params) => {
        await evLeads.manualPassLead(params);
      },
    };
  }
}
