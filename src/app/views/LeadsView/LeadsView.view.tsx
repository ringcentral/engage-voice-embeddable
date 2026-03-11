import React from 'react';
import {
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { List, EmptyState, Button } from '@ringcentral/spring-ui';
import { OutgoingCallMd, MissedCallMd } from '@ringcentral/spring-icon';

import { EvLeads, ALLOW_DIAL_STATES, DISABLE_MANUAL_PASS_STATES, PHONE_DELIMETER } from '../../services/EvLeads';
import type { Lead, DispositionItem } from '../../services/EvLeads';
import { EvCall } from '../../services/EvCall';
import { EvWorkingState } from '../../services/EvWorkingState';
import { EvAgentSession } from '../../services/EvAgentSession';
import { EvAuth } from '../../services/EvAuth';
import { EvClient } from '../../services/EvClient';
import { Adapter } from '../../services/Adapter';
import { ThirdParty } from '../../services/ThirdParty';
import { LeadItem } from '../../components/LeadItem';
import type { PhoneNumberData, ManualPassParams } from '../../components/LeadItem';
import { formatPhoneNumber } from '../../../lib/FormatPhoneNumber';
import i18n from './i18n';

/**
 * Agent states that indicate the agent is busy
 */
const AGENT_BUSY_STATES = ['TRANSITION', 'ENGAGED', 'RNA-STATE'];

/**
 * LeadsView options for configuration
 */
export interface LeadsViewOptions {
  // Optional configuration options
}

/**
 * LeadsView module - Leads panel
 * Shows leads list with dial functionality
 */
@injectable({
  name: 'LeadsView',
})
class LeadsView extends RcViewModule {
  constructor(
    private evLeads: EvLeads,
    private evCall: EvCall,
    private evWorkingState: EvWorkingState,
    private evAgentSession: EvAgentSession,
    private evAuth: EvAuth,
    private evClient: EvClient,
    private adapter: Adapter,
    private thirdParty: ThirdParty,
    @optional('LeadsViewOptions')
    private leadsViewOptions?: LeadsViewOptions,
  ) {
    super();
  }

  fetchLeads = async () => {
    await this.evLeads.fetchLeads();
    this.adapter.onLoadLeads(this.evLeads.filteredLeads);
  };

  dialLead = async (lead: Lead, destination: string) => {
    await this.evLeads.dialLead(lead, destination);
    this.adapter.onCallLead(lead, destination);
  };

  manualPassLead = async (params: ManualPassParams) => {
    await this.evLeads.manualPassLead(params);
    this.adapter.onManualPassLead(params);
  };

  fetchDispositionList = async (campaignId: string): Promise<DispositionItem[]> => {
    const list = await this.evClient.getCampaignDispositions(campaignId);
    return list.map((item: any) => ({
      value: item.dispositionId,
      label: item.disposition,
    }));
  };

  viewLead = async (lead: Lead) => {
    await this.thirdParty.viewLead(lead);
  };

  component() {
    const { t } = useLocale(i18n);

    const {
      filteredLeads,
      loading,
      noLeadsReturned,
      isDialing,
      pendingDisposition,
      agentState,
      allowManualPass,
      defaultTimezone,
      showViewLead,
    } = useConnector(() => ({
      filteredLeads: this.evLeads.filteredLeads,
      loading: this.evLeads.loading,
      noLeadsReturned: this.evLeads.noLeadsReturned,
      isDialing: this.evCall.isDialing,
      pendingDisposition: this.evWorkingState.isPendingDisposition,
      agentState: this.evWorkingState.agentState?.agentState || '',
      allowManualPass: this.evAuth.agentConfig?.agentPermissions?.allowManualPass ?? false,
      defaultTimezone: (this.evAuth.authenticateResponse as any)?.regionalSettings?.timezoneName || 'America/New_York',
      showViewLead: this.thirdParty.leadViewerEnabled,
    }));

    const agentBusy = AGENT_BUSY_STATES.includes(agentState);

    return (
      <div className="flex flex-col h-full bg-neutral-base">
        <div className="flex-1 overflow-auto">
          {filteredLeads.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <EmptyState
                icon={noLeadsReturned ? MissedCallMd : OutgoingCallMd}
                title={noLeadsReturned ? t('noLeadsReturned') : t('startOutboundDialing')}
                description={loading ? t('gettingLeads') : t('getLeadsToStart')}
              />
            </div>
          ) : (
            <List>
              {filteredLeads.map((lead) => {
                const displayName = [lead.firstName, lead.midName, lead.lastName]
                  .filter(Boolean)
                  .join(' ') || 'Unknown';
                const destination = lead.destinationE164 || lead.destination;
                const destinations = typeof destination === 'string'
                  ? destination.split(PHONE_DELIMETER)
                  : Array.isArray(destination)
                    ? destination
                    : [];
                const phoneNumbers: PhoneNumberData[] = destinations.map((dest) => ({
                  formatted: formatPhoneNumber({ phoneNumber: dest }),
                  destination: dest,
                }));
                const allowDial = ALLOW_DIAL_STATES.includes(lead.leadState);
                const disableManualPass = DISABLE_MANUAL_PASS_STATES.includes(lead.leadState);
                return (
                  <LeadItem
                    key={lead.leadId}
                    lead={lead}
                    displayName={displayName}
                    phoneNumbers={phoneNumbers}
                    allowDial={allowDial}
                    isDialing={isDialing}
                    disabled={pendingDisposition || agentBusy}
                    onDial={(dest) => this.dialLead(lead, dest)}
                    onPass={this.manualPassLead}
                    showManualPassButton={allowManualPass}
                    disableManualPass={disableManualPass}
                    fetchDispositionList={this.fetchDispositionList}
                    defaultTimezone={defaultTimezone}
                    showViewLeadButton={showViewLead}
                    onViewLead={this.viewLead}
                  />
                );
              })}
            </List>
          )}
        </div>

        <div className="flex justify-center items-center p-4 border-t border-neutral-b4">
          <Button
            onClick={this.fetchLeads}
            variant="outlined"
            color="primary"
            loading={loading}
          >
            {t('getLeads')}
          </Button>
        </div>
      </div>
    );
  }
}

export { LeadsView };
