import { Module } from '@ringcentral-integration/commons/lib/di';
import { RcUIModuleV2 } from '@ringcentral-integration/core';
import { dialoutStatuses } from '@ringcentral-integration/engage-voice-widgets/enums';

import { Deps } from './EvLeadsUI.interface';

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
    'Adapter',
    'ThirdPartyService',
  ],
})
export class EvLeadsUI extends RcUIModuleV2<Deps> {
  constructor(deps: Deps) {
    super({
      deps,
    });
  }

  getUIProps() {
    const { evLeads, locale, evCall, evAgentSession, evWorkingState, evAuth, thirdPartyService } = this._deps;
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
      showViewLead: thirdPartyService.leadViewerEnabled,
    };
  }

  getUIFunctions() {
    const { evLeads, evCall, evClient, adapter, thirdPartyService } = this._deps;
    return {
      getLeads: async () => {
        await evLeads.fetchLeads();
        adapter.onLoadLeads(evLeads.filteredLeads);
      },
      dialLead: async (lead, destination) => {
        await evLeads.dialLead(lead, destination);
        adapter.onCallLead(lead, destination);
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
        adapter.onManualPassLead(params);
      },
      onViewLead: async (lead) => {
        await thirdPartyService.viewLead(lead);
      },
    };
  }
}
