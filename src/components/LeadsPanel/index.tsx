import type { FunctionComponent } from 'react';
import React from 'react';
import {
  styled,
  palette2,
  RcButton,
  RcIcon,
  RcTypography,
  RcList,
} from '@ringcentral/juno';
import {
  Missedcall,
  Outcall,
} from '@ringcentral/juno-icon';
import type { Lead } from '../../modules/EvLeads/EvLeads.interface';
import { LeadItem } from './LeadItem';

interface LeadsPanelProps {
  leads: Lead[];
  getLeads: () => Promise<void>;
  currentLocale: string;
  dialLead: (lead: Lead, destination: string) => Promise<void>;
  loading: boolean;
  noLeadsReturned: boolean;
  isDialing: boolean;
  pendingDisposition: boolean;
  agentBusy: boolean;
  fetchDispositionList: (campaignId: string) => Promise<{ value: string; label: string }[]>;
  allowManualPass: boolean;
  defaultTimezone: string;
  onPass: ({
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
  }) => Promise<void>;
}

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  width: 100%;
`;

const LeadsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-top: 1px solid ${palette2('neutral', 'l02')};
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
`;

const EmptyTitle = styled(RcTypography)`
  margin-top: 10px;
`;

const EmptySubtitle = styled(RcTypography)`
  margin-top: 6px;
`;

function EmptyState({
  isLoading,
  noLeadsReturned,
}: {
  isLoading: boolean;
  noLeadsReturned: boolean;
}) {
  return (
    <EmptyContainer>
      <RcIcon symbol={noLeadsReturned ? Missedcall : Outcall} color="action.primary" size="xxxlarge" />
      <EmptyTitle variant="subheading1" color="neutral.f06">
        {noLeadsReturned ? 'No leads were returned.' : 'Start outbound dialing'}
      </EmptyTitle>
      <EmptySubtitle variant="caption1" color="neutral.f04">
        {isLoading ? 'Getting leads...' : 'Click Get leads to start dialing.'}
      </EmptySubtitle>
    </EmptyContainer>
  );
}

export const LeadsPanel: FunctionComponent<LeadsPanelProps> = ({
  leads,
  getLeads,
  currentLocale,
  dialLead,
  loading,
  noLeadsReturned,
  isDialing,
  pendingDisposition,
  agentBusy,
  fetchDispositionList,
  allowManualPass,
  onPass,
  defaultTimezone = 'America/New_York',
}) => {
  return (
    <StyledRoot>
      <LeadsContainer>
        {leads.length > 0 ? (
          <RcList>
            {leads.map((lead) => (
              <LeadItem
                key={lead.leadId}
                lead={lead}
                currentLocale={currentLocale}
                dialLead={dialLead}
                isDialing={isDialing}
                pendingDisposition={pendingDisposition}
                agentBusy={agentBusy}
                fetchDispositionList={fetchDispositionList}
                allowManualPass={allowManualPass}
                defaultTimezone={defaultTimezone}
                onPass={onPass}
              />
            ))}
          </RcList>
        ) : (
          <EmptyState isLoading={loading} noLeadsReturned={noLeadsReturned} />
        )}
      </LeadsContainer>
      <Footer>
        <RcButton
          onClick={getLeads}
          variant="outlined"
          color="primary"
          loading={loading}
          radius="round"
        >
          Get leads
        </RcButton>
      </Footer>
    </StyledRoot>
  );
};
