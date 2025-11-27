import React from 'react';
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
import { PHONE_DELIMETER, ALLOW_DIAL_STATES } from '../../modules/EvLeads/EvLeads';

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
}: {
  lead: Lead;
  currentLocale: string;
  dialLead: (lead: Lead, destination: string) => Promise<void>;
  isDialing: boolean;
  pendingDisposition: boolean;
  agentBusy: boolean;
}) {
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
                disabled={isDialing || !allowDial || pendingDisposition || agentBusy}
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
        <RcIconButton
          symbol={MissedcallBorder}
          size="small"
          variant="inverse"
          color="danger.b04"
          title="Manual pass"
        />
      </RcListItemSecondaryAction>
    </StyledListItem>
  );
}
