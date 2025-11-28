import React, { useState } from 'react';
import {
  styled,
  palette2,
  RcIconButton,
  RcListItem,
  RcListItemText,
  RcListItemSecondaryAction,
  RcButton,
} from '@ringcentral/juno';
import {
  MissedcallBorder,
  ViewLogBorder,
  PhoneBorder,
} from '@ringcentral/juno-icon';
import { formatPhoneNumber } from '@ringcentral-integration/engage-voice-widgets/lib/FormatPhoneNumber';
import type { Lead } from '../../modules/EvLeads/EvLeads.interface';
import {
  PHONE_DELIMETER,
  ALLOW_DIAL_STATES,
  SEARCH_DISABLE_DIAL_STATES,
  DISABLE_MANUAL_PASS_STATES,
} from '../../modules/EvLeads/EvLeads';
import { ManualPassModal } from './ManualPassModal';

const StyledListItem = styled(RcListItem)`
  .lead-actions {
    display: none;
  }

  &:hover {
    .lead-actions {
      display: flex;
    }
  }
  border-bottom: 1px solid ${palette2('neutral', 'l02')};
`;

const PhoneNumbersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PhoneNumberButton = styled(RcButton)`
  &.RcButton-text {
    padding-left: 0;
  }
`;

export function LeadItem({
  lead,
  currentLocale,
  dialLead,
  isDialing,
  pendingDisposition,
  agentBusy,
  fromSearch = false,
  fetchDispositionList,
  allowManualPass,
  onPass,
  defaultTimezone,
}: {
  lead: Lead;
  currentLocale: string;
  dialLead: (lead: Lead, destination: string) => Promise<void>;
  isDialing: boolean;
  pendingDisposition: boolean;
  agentBusy: boolean;
  fromSearch?: boolean;
  allowManualPass: boolean;
  defaultTimezone: string;
  fetchDispositionList: (campaignId: string) => Promise<{ value: string; label: string }[]>;
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
}) {
  const [manualPassOpen, setManualPassOpen] = useState(false);
  const { firstName, midName, lastName } = lead;
  const name = [firstName, midName, lastName].filter(Boolean).join(' ');
  const destination = lead.destinationE164 || lead.destination;
  const destinations = destination ? destination.split(PHONE_DELIMETER) : [];
  const phoneNumbers = destinations.map((destination) => {
    return {
      formatted: formatPhoneNumber({
        phoneNumber: destination,
        currentLocale,
      }),
      destination,
    };
  });
  const allowDial = ALLOW_DIAL_STATES.includes(lead.leadState);
  const isDisabledFromSearch = fromSearch && SEARCH_DISABLE_DIAL_STATES.includes(lead.leadState);
  const isDisabledManualPass = DISABLE_MANUAL_PASS_STATES.includes(lead.leadState);
  return (
    <StyledListItem>
      <RcListItemText
        primary={name}
        secondary={
          <PhoneNumbersContainer>
            {phoneNumbers.map((phoneNumber) => (
              <PhoneNumberButton
                key={phoneNumber.destination} variant="plain"
                onClick={() => dialLead(lead, phoneNumber.destination)}
                size="medium"
                title="Click to dial"
                useRcTooltip
                disabled={isDialing || !allowDial || pendingDisposition || agentBusy || isDisabledFromSearch}
              >
                {phoneNumber.formatted}
              </PhoneNumberButton>
            ))}
          </PhoneNumbersContainer>
        }
        secondaryTypographyProps={{
          component: 'div',
        }}
      />
      <RcListItemSecondaryAction className="lead-actions">
        {
          phoneNumbers.length === 1 ? (
            <RcIconButton
              symbol={PhoneBorder}
              size="small"
              variant="contained"
              color="neutral.b01"
              title="Call"
              onClick={() => dialLead(lead, phoneNumbers[0].destination)}
            />
          ) : null
        }
        <RcIconButton
          symbol={ViewLogBorder}
          size="small"
          variant="contained"
          color="neutral.b01"
          title="View call log"
        />
        {
          allowManualPass && (
            <RcIconButton
              symbol={MissedcallBorder}
              size="small"
              variant="inverse"
              color="danger.b04"
              title="Manual pass"
              disabled={isDialing || pendingDisposition || agentBusy || isDisabledManualPass}
              onClick={() => setManualPassOpen(true)}
            />
          )
        }
      </RcListItemSecondaryAction>
      <ManualPassModal
        fetchDispositionList={fetchDispositionList}
        open={manualPassOpen}
        onClose={() => setManualPassOpen(false)}
        disabled={isDialing || pendingDisposition || agentBusy || isDisabledManualPass || !allowManualPass}
        campaignId={lead.campaignId}
        defaultTimezone={defaultTimezone}
        onPass={async ({ dispositionId, notes, callback, callbackDTS }) => {
          setManualPassOpen(false);
          await onPass({ lead, dispositionId, notes, callback, callbackDTS });
        }}
      />
    </StyledListItem>
  );
}
