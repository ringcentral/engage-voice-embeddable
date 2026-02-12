import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { PageHeader } from '@ringcentral-integration/next-widgets/components';
import {
  Accordion,
  AccordionHeader,
  Block,
  BlockHeader,
  Button,
  Select,
  Option,
  Textarea,
} from '@ringcentral/spring-ui';
import type { ChangeEvent, FunctionComponent } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';

import type { CallHistoryDetailPanelProps } from './CallHistoryDetailPanel.interface';
import i18n from '../../views/CallHistoryDetailView/i18n';

/**
 * Format call time for display
 */
function formatCallTime(timestamp: number): string {
  const callTime = dayjs(timestamp);
  const now = dayjs();
  if (callTime.isSame(now, 'day')) {
    return callTime.format('h:mm A');
  }
  if (callTime.isSame(now.subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  }
  return callTime.format('MM/DD/YYYY h:mm A');
}

/**
 * CallHistoryDetailPanel - Presentational component for call history detail
 * Displays call details and allows adding notes/disposition
 */
export const CallHistoryDetailPanel: FunctionComponent<
  CallHistoryDetailPanelProps
> = ({
  callDetail,
  callMeta,
  dispositions,
  isInbound,
  callNotFound,
  onSave,
  onBack,
}) => {
  const { t } = useLocale(i18n);
  const [notes, setNotes] = useState('');
  const [selectedDisposition, setSelectedDisposition] = useState<
    string | null
  >(null);

  const handleNotesChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setNotes(e.target.value);
    },
    [],
  );

  const handleDispositionChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedDisposition(e.target.value || null);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const callId = callDetail?.id || callDetail?.sessionId;
    if (callId) {
      await onSave(callId, notes, selectedDisposition);
    }
  }, [callDetail, notes, selectedDisposition, onSave]);

  const contactName = useMemo(() => {
    if (!callDetail) return '';
    return isInbound ? callDetail.fromName : callDetail.toName;
  }, [callDetail, isInbound]);

  const phoneNumber = useMemo(() => {
    if (!callDetail) return '';
    const party = isInbound ? callDetail.from : callDetail.to;
    return party?.phoneNumber || '';
  }, [callDetail, isInbound]);

  const displayName = contactName || phoneNumber || t('unknown');

  const callTimeText = useMemo(() => {
    if (!callDetail?.startTime) return null;
    return {
      text: formatCallTime(callDetail.startTime),
      title: dayjs(callDetail.startTime).format('MM/DD/YYYY h:mm A'),
    };
  }, [callDetail?.startTime]);

  const hasExtraDetails = !!(
    callMeta.dnis ||
    callMeta.callId ||
    callMeta.termParty ||
    callMeta.termReason
  );

  if (callNotFound) {
    return (
      <div
        className="flex flex-col h-full bg-neutral-base"
        data-sign="callHistoryDetailNotFound"
      >
        <PageHeader onBackClick={onBack}>{t('callDetails')}</PageHeader>
        <div className="flex-1 flex items-center justify-center">
          <p className="typography-mainText text-neutral-b2">
            {t('callNotFound')}
          </p>
        </div>
      </div>
    );
  }

  const directionLabel = isInbound ? t('inbound') : t('outbound');

  return (
    <div
      className="flex flex-col h-full bg-neutral-base"
      data-sign="CallHistoryDetailPanel"
    >
      <PageHeader onBackClick={onBack}>{t('callDetails')}</PageHeader>
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {/* Contact info */}
        <Block className="mb-2" data-sign="contactBlock">
          <BlockHeader>
            <span className="typography-descriptorMini">{displayName}</span>
            <div className="text-neutral-b2 typography-mainText truncate">
              {contactName && phoneNumber ? phoneNumber : ''}
            </div>
          </BlockHeader>
        </Block>
        {/* Time and direction */}
        <Block className="mb-2" data-sign="timeAndDirectionBlock">
          <BlockHeader data-sign="time-and-status">
            <p className="typography-descriptorMini">
              {callTimeText ? (
                <span title={callTimeText.title}>{callTimeText.text}</span>
              ) : null}
            </p>
            <div className="text-success typography-mainText">
              {directionLabel}
            </div>
          </BlockHeader>
        </Block>
        {/* Expandable extra details */}
        {hasExtraDetails && (
          <Accordion
            header={
              <AccordionHeader>{t('moreDetails')}</AccordionHeader>
            }
            data-sign="moreDetailsAccordion"
          >
            <div className="px-4 py-2" data-sign="moreDetailsContent">
              {callMeta.dnis && (
                <Block className="mb-2" data-sign="dnisBlock">
                  <BlockHeader>
                    <span className="typography-descriptorMini">
                      {t('dnis')}
                    </span>
                    <p className="text-neutral-b2 typography-mainText truncate">
                      {callMeta.dnis}
                    </p>
                  </BlockHeader>
                </Block>
              )}
              {callMeta.callId && (
                <Block className="mb-2" data-sign="callIdBlock">
                  <BlockHeader>
                    <span className="typography-descriptorMini">
                      {t('callId')}
                    </span>
                    <p
                      className="text-neutral-b2 typography-mainText truncate"
                      title={callMeta.callId}
                    >
                      {callMeta.callId}
                    </p>
                  </BlockHeader>
                </Block>
              )}
              {callMeta.termParty && (
                <Block className="mb-2" data-sign="termPartyBlock">
                  <BlockHeader>
                    <span className="typography-descriptorMini">
                      {t('termParty')}
                    </span>
                    <p className="text-neutral-b2 typography-mainText truncate">
                      {callMeta.termParty}
                    </p>
                  </BlockHeader>
                </Block>
              )}
              {callMeta.termReason && (
                <Block className="mb-2" data-sign="termReasonBlock">
                  <BlockHeader>
                    <span className="typography-descriptorMini">
                      {t('termReason')}
                    </span>
                    <p className="text-neutral-b2 typography-mainText truncate">
                      {callMeta.termReason}
                    </p>
                  </BlockHeader>
                </Block>
              )}
            </div>
          </Accordion>
        )}
        {/* Disposition */}
        {dispositions.length > 0 && (
          <div className="mt-2 mb-3" data-sign="dispositionSection">
            <Select
              label={t('disposition')}
              placeholder={t('selectDisposition')}
              value={selectedDisposition ?? ''}
              onChange={handleDispositionChange}
              size="large"
              data-sign="dispositionSelect"
            >
              {dispositions.map((disp) => (
                <Option key={disp.dispositionId} value={disp.dispositionId}>
                  {disp.disposition}
                </Option>
              ))}
            </Select>
          </div>
        )}
        {/* Notes */}
        <div className="mt-2 mb-2" data-sign="notesSection">
          <Textarea
            label={t('notes')}
            value={notes}
            onChange={handleNotesChange}
            placeholder={t('notesPlaceholder')}
            minRows={4}
            maxRows={8}
            size="large"
            data-sign="notesTextarea"
            fullWidth
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="px-4 py-3 border-t border-neutral-b4">
        <Button
          fullWidth
          color="primary"
          onClick={handleSave}
          data-sign="saveButton"
        >
          {t('save')}
        </Button>
      </div>
    </div>
  );
};

CallHistoryDetailPanel.displayName = 'CallHistoryDetailPanel';
