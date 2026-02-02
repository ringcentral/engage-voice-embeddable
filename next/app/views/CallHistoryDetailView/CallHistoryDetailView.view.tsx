import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback, useState, useMemo } from 'react';

import { EvCallHistory } from '../../services/EvCallHistory';
import { EvCallDisposition } from '../../services/EvCallDisposition';
import type {
  CallHistoryDetailViewOptions,
  CallHistoryDetailViewProps,
} from './CallHistoryDetailView.interface';
import i18n from './i18n';

/**
 * CallHistoryDetailView - Call history log detail view
 * Displays call details and allows adding notes/disposition
 */
@injectable({
  name: 'CallHistoryDetailView',
})
class CallHistoryDetailView extends RcViewModule {
  constructor(
    private _evCallHistory: EvCallHistory,
    private _evCallDisposition: EvCallDisposition,
    private _router: RouterPlugin,
    @optional('CallHistoryDetailViewOptions')
    private _options?: CallHistoryDetailViewOptions,
  ) {
    super();
  }

  goBack() {
    this._router.push('/history');
  }

  async saveCallLog(callId: string, notes: string, dispositionId: string | null) {
    // Save call log implementation would go here
    this._options?.onSave?.();
    this.goBack();
  }

  component(props?: CallHistoryDetailViewProps) {
    const { t } = useLocale(i18n);
    const [notes, setNotes] = useState('');
    const [selectedDisposition, setSelectedDisposition] = useState<string | null>(null);

    const { callHistory, dispositions } = useConnector(() => ({
      callHistory: this._evCallHistory.formattedCallLogs,
      dispositions: this._evCallDisposition.dispositions,
    }));

    const callId = props?.id;

    const callDetail = useMemo(() => {
      return callHistory.find((call: any) => call.uii === callId || call.sessionId === callId);
    }, [callHistory, callId]);

    const handleNotesChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
      },
      [],
    );

    const handleDispositionChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDisposition(e.target.value || null);
      },
      [],
    );

    const handleSave = useCallback(async () => {
      if (callId) {
        await this.saveCallLog(callId, notes, selectedDisposition);
      }
    }, [callId, notes, selectedDisposition]);

    const handleBack = useCallback(() => {
      this.goBack();
    }, []);

    if (!callDetail) {
      return (
        <div className="flex flex-col h-full bg-neutral-base p-4 items-center justify-center">
          <p className="typography-mainText text-neutral-b2 mb-4">
            Call not found
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="py-2 px-4 border border-neutral-b4 text-neutral-b1 rounded-lg typography-subtitle hover:bg-neutral-b5 transition-colors"
          >
            {t('back')}
          </button>
        </div>
      );
    }

    const isInbound = callDetail.callType === 'INBOUND' || callDetail.direction === 'inbound';

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-y-auto">
        <h1 className="typography-title mb-6">{t('callDetails')}</h1>

        {/* Call Info */}
        <div className="mb-4 p-4 bg-neutral-b5 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="typography-descriptor text-neutral-b2">
              {t('phoneNumber')}
            </span>
            <span className="typography-subtitle">
              {callDetail.phoneNumber || callDetail.ani || callDetail.dnis || 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="typography-descriptor text-neutral-b2">
              {t('direction')}
            </span>
            <span className="typography-mainText">
              {isInbound ? t('inbound') : t('outbound')}
            </span>
          </div>
          {callDetail.duration && (
            <div className="flex justify-between mb-2">
              <span className="typography-descriptor text-neutral-b2">
                {t('duration')}
              </span>
              <span className="typography-mainText">
                {callDetail.duration}
              </span>
            </div>
          )}
          {callDetail.startTime && (
            <div className="flex justify-between">
              <span className="typography-descriptor text-neutral-b2">
                {t('time')}
              </span>
              <span className="typography-mainText">
                {new Date(callDetail.startTime).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Disposition */}
        {dispositions.length > 0 && (
          <div className="mb-4">
            <label htmlFor="disposition-select" className="typography-subtitle block mb-2">
              {t('disposition')}
            </label>
            <select
              id="disposition-select"
              value={selectedDisposition || ''}
              onChange={handleDispositionChange}
              className="w-full p-3 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText"
            >
              <option value="">{t('selectDisposition')}</option>
              {dispositions.map((disp: any) => (
                <option key={disp.dispositionId} value={disp.dispositionId}>
                  {disp.disposition}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notes */}
        <div className="mb-4 flex-1">
          <label className="typography-subtitle block mb-2">{t('notes')}</label>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder={t('notesPlaceholder')}
            className="w-full h-32 p-3 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText resize-none"
          />
        </div>

        {/* Action Buttons */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 mb-2 bg-primary-b text-neutral-w0 rounded-lg typography-subtitle hover:bg-primary-f transition-colors"
        >
          {t('save')}
        </button>

        <button
          type="button"
          onClick={handleBack}
          className="w-full py-3 border border-neutral-b4 text-neutral-b1 rounded-lg typography-subtitle hover:bg-neutral-b5 transition-colors"
        >
          {t('back')}
        </button>
      </div>
    );
  }
}

export { CallHistoryDetailView };
