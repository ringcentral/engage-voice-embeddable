import React, { useState, useCallback } from 'react';
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
import { LeadItem } from '../../components/LeadItem';
import type { PhoneNumberData } from '../../components/LeadItem';
import { ManualPassModal } from '../../components/ManualPassModal';
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
    @optional('LeadsViewOptions')
    private leadsViewOptions?: LeadsViewOptions,
  ) {
    super();
  }

  fetchLeads = async () => {
    await this.evLeads.fetchLeads();
  };

  dialLead = async (lead: Lead, destination: string) => {
    await this.evLeads.dialLead(lead, destination);
  };

  manualPassLead = async (params: {
    lead: Lead;
    dispositionId: string;
    notes: string;
    callback: boolean;
    callbackDTS: string;
  }) => {
    await this.evLeads.manualPassLead(params);
  };

  fetchDispositionList = async (campaignId: string): Promise<DispositionItem[]> => {
    const list = await this.evClient.getCampaignDispositions(campaignId);
    return list.map((item: any) => ({
      value: item.dispositionId,
      label: item.disposition,
    }));
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
    } = useConnector(() => ({
      filteredLeads: this.evLeads.filteredLeads,
      loading: this.evLeads.loading,
      noLeadsReturned: this.evLeads.noLeadsReturned,
      isDialing: this.evCall.isDialing,
      pendingDisposition: this.evWorkingState.isPendingDisposition,
      agentState: this.evWorkingState.agentState?.agentState || '',
      allowManualPass: this.evAuth.agent?.agentConfig?.agentPermissions?.allowManualPass ?? false,
      defaultTimezone: (this.evAuth.agent?.authenticateResponse as any)?.regionalSettings?.timezoneName || 'America/New_York',
    }));

    const [manualPassModalOpen, setManualPassModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const agentBusy = AGENT_BUSY_STATES.includes(agentState);

    const handleOpenManualPass = useCallback((lead: Lead) => {
      setSelectedLead(lead);
      setManualPassModalOpen(true);
    }, []);

    const handleCloseManualPass = useCallback(() => {
      setManualPassModalOpen(false);
      setSelectedLead(null);
    }, []);

    const handleManualPass = useCallback(async (params: {
      dispositionId: string;
      notes: string;
      callback: boolean;
      callbackDTS: string;
    }) => {
      if (selectedLead) {
        await this.manualPassLead({
          lead: selectedLead,
          ...params,
        });
        handleCloseManualPass();
      }
    }, [selectedLead, handleCloseManualPass]);

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
                // Compute display name from lead data
                const displayName = [lead.firstName, lead.midName, lead.lastName]
                  .filter(Boolean)
                  .join(' ') || 'Unknown';

                // Parse phone numbers from destination
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

                // Check if dial is allowed based on lead state
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
                    onManualPass={() => handleOpenManualPass(lead)}
                    showManualPassButton={allowManualPass}
                    disableManualPass={disableManualPass}
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

        {selectedLead && (
          <ManualPassModal
            open={manualPassModalOpen}
            onClose={handleCloseManualPass}
            onSubmit={handleManualPass}
            fetchDispositionList={this.fetchDispositionList}
            campaignId={selectedLead.campaignId || ''}
            defaultTimezone={defaultTimezone}
            disabled={isDialing || pendingDisposition || agentBusy}
            t={t}
          />
        )}
      </div>
    );
  }
}

export { LeadsView };
