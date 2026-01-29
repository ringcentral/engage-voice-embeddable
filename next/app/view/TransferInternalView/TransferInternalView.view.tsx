import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback, useEffect, useState } from 'react';

import { EvTransferCall } from '../../services/EvTransferCall';
import { EvClient } from '../../services/EvClient';
import type {
  TransferInternalViewOptions,
  TransferInternalViewProps,
} from './TransferInternalView.interface';
import i18n from './i18n';

/**
 * TransferInternalView - Internal agent transfer view
 * Allows selecting an agent for warm or cold transfer
 */
@injectable({
  name: 'TransferInternalView',
})
class TransferInternalView extends RcViewModule {
  constructor(
    private _evTransferCall: EvTransferCall,
    private _evClient: EvClient,
    private _router: RouterPlugin,
    @optional('TransferInternalViewOptions')
    private _options?: TransferInternalViewOptions,
  ) {
    super();
  }

  async fetchAgentList() {
    await this._evTransferCall.fetchAgentList();
  }

  selectAgent(agentId: string) {
    this._evTransferCall.changeTransferAgentId(agentId);
  }

  async warmTransfer() {
    const agentId = this._evTransferCall.transferAgentId;
    if (!agentId) return;
    await this._evClient.directAgentTransfer(agentId, true);
    this._options?.onTransferComplete?.();
    this._router.push('/calls');
  }

  async coldTransfer() {
    const agentId = this._evTransferCall.transferAgentId;
    if (!agentId) return;
    await this._evClient.directAgentTransfer(agentId, false);
    this._options?.onTransferComplete?.();
    this._router.push('/calls');
  }

  cancel() {
    this._evTransferCall.resetTransferStatus();
    this._options?.onCancel?.();
    this._router.goBack();
  }

  component(_props?: TransferInternalViewProps) {
    const { t } = useLocale(i18n);
    const [searchTerm, setSearchTerm] = useState('');

    const { agentList, selectedAgentId, transferring } = useConnector(() => ({
      agentList: this._evTransferCall.transferAgentList,
      selectedAgentId: this._evTransferCall.transferAgentId,
      transferring: this._evTransferCall.transferring,
    }));

    useEffect(() => {
      this.fetchAgentList();
    }, []);

    const filteredAgents = agentList.filter((agent) => {
      const name = `${agent.firstName} ${agent.lastName}`.toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
      },
      [],
    );

    const handleSelectAgent = useCallback((agentId: string) => {
      this.selectAgent(agentId);
    }, []);

    const handleWarmTransfer = useCallback(async () => {
      await this.warmTransfer();
    }, []);

    const handleColdTransfer = useCallback(async () => {
      await this.coldTransfer();
    }, []);

    const handleCancel = useCallback(() => {
      this.cancel();
    }, []);

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-hidden">
        <h1 className="typography-title mb-2">{t('internalTransfer')}</h1>
        <p className="typography-descriptor text-neutral-b2 mb-4">
          {t('selectAgent')}
        </p>

        {/* Search */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={t('searchAgents')}
          className="w-full p-3 mb-4 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText"
        />

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto mb-4">
          {filteredAgents.length === 0 ? (
            <div className="text-center text-neutral-b2 py-8">
              {t('noAgents')}
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <button
                key={agent.agentId}
                type="button"
                onClick={() => handleSelectAgent(agent.agentId)}
                className={`w-full p-3 mb-2 border rounded-lg text-left transition-colors ${
                  selectedAgentId === agent.agentId
                    ? 'border-primary-b bg-primary-t10'
                    : 'border-neutral-b4 bg-neutral-base hover:bg-neutral-b5'
                }`}
              >
                <div className="typography-subtitle truncate">
                  {agent.firstName} {agent.lastName}
                </div>
                <div className="typography-descriptor text-neutral-b2">
                  {agent.available ? t('available') : t('busy')}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Transfer Buttons */}
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={handleWarmTransfer}
            disabled={!selectedAgentId || transferring}
            className="flex-1 py-3 bg-primary-b text-neutral-w0 rounded-lg typography-subtitle hover:bg-primary-f transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('warmTransfer')}
          </button>
          <button
            type="button"
            onClick={handleColdTransfer}
            disabled={!selectedAgentId || transferring}
            className="flex-1 py-3 bg-success text-neutral-w0 rounded-lg typography-subtitle hover:bg-success-f transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('coldTransfer')}
          </button>
        </div>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={handleCancel}
          className="w-full py-3 border border-neutral-b4 text-neutral-b1 rounded-lg typography-subtitle hover:bg-neutral-b5 transition-colors"
        >
          {t('cancel')}
        </button>
      </div>
    );
  }
}

export { TransferInternalView };
