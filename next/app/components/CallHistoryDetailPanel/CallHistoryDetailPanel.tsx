import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { PageHeader } from '@ringcentral-integration/next-widgets/components';
import {
  AppFooterNav,
  AppHeaderNav,
} from '@ringcentral-integration/micro-core/src/app/components';
import { Block, BlockHeader } from '@ringcentral/spring-ui';
import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';

import { CallInfoHeader } from '../CallInfoHeader';
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
 * CallHistoryDetailPanel - Read-only presentational component for call history detail
 * Displays call details (contact, time, direction, DNIS, Call ID, Term Party, Term Reason)
 */
export const CallHistoryDetailPanel: FunctionComponent<
  CallHistoryDetailPanelProps
> = ({ callDetail, callMeta, isInbound, callNotFound, onBack }) => {
  const { t } = useLocale(i18n);

  const contactName = useMemo(() => {
    if (!callDetail) return '';
    return isInbound ? callDetail.fromName : callDetail.toName;
  }, [callDetail, isInbound]);

  const phoneNumber = useMemo(() => {
    if (!callDetail) return '';
    const party = isInbound ? callDetail.from : callDetail.to;
    return party?.phoneNumber || '';
  }, [callDetail, isInbound]);

  const callTimeText = useMemo(() => {
    if (!callDetail?.startTime) return null;
    return {
      text: formatCallTime(callDetail.startTime),
      title: dayjs(callDetail.startTime).format('MM/DD/YYYY h:mm A'),
    };
  }, [callDetail?.startTime]);

  if (callNotFound) {
    return (
      <div
        className="flex flex-col h-full bg-neutral-base"
        data-sign="callHistoryDetailNotFound"
      >
        <AppHeaderNav override>
          <PageHeader onBackClick={onBack}>{t('callDetails')}</PageHeader>
        </AppHeaderNav>
        <div className="flex-1 flex items-center justify-center">
          <p className="typography-mainText text-neutral-b2">
            {t('callNotFound')}
          </p>
        </div>
        <AppFooterNav />
      </div>
    );
  }

  const direction = isInbound ? 'inbound' : 'outbound';
  const directionLabel = isInbound ? t('inbound') : t('outbound');
  const followInfos: string[] = [directionLabel];
  if (callTimeText) {
    followInfos.push(callTimeText.text);
  }

  return (
    <div
      className="flex flex-col h-full bg-neutral-base"
      data-sign="CallHistoryDetailPanel"
    >
      <AppHeaderNav override>
        <PageHeader onBackClick={onBack}>{t('callDetails')}</PageHeader>
      </AppHeaderNav>
      <div className="flex-1 overflow-y-auto">
        {/* Call basic info via CallInfoHeader */}
        <CallInfoHeader
          contactName={contactName || t('unknown')}
          phoneNumber={phoneNumber}
          status="ended"
          direction={direction}
          followInfos={followInfos}
          secondaryTitle={callTimeText?.title}
          data-sign="callDetailInfoHeader"
        />
        {/* Detail fields */}
        <div className="px-4 py-2">
          {/* DNIS */}
          {callMeta.dnis && (
            <Block className="mb-2" data-sign="dnisBlock">
              <BlockHeader>
                <span className="typography-descriptorMini">{t('dnis')}</span>
                <p className="text-neutral-b2 typography-mainText truncate">
                  {callMeta.dnis}
                </p>
              </BlockHeader>
            </Block>
          )}
          {/* Call ID */}
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
          {/* Term Party */}
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
          {/* Term Reason */}
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
      </div>
      <AppFooterNav />
    </div>
  );
};

CallHistoryDetailPanel.displayName = 'CallHistoryDetailPanel';
