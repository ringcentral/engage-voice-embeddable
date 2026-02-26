import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import {
  AppFooterNav,
  AppHeaderNav,
} from '@ringcentral-integration/micro-core/src/app/components';
import { PageHeader } from '@ringcentral-integration/next-widgets/components';
import {
  TextField,
  VirtualizedList,
  ListItem,
  ListItemText,
} from '@ringcentral/spring-ui';
import React, { useCallback, useEffect, useState } from 'react';

import { transferTypes } from '../../../enums';
import { EvTransferCall } from '../../services/EvTransferCall';
import { EvCall } from '../../services/EvCall';
import type {
  TransferInternalViewOptions,
  TransferInternalViewProps,
} from './TransferInternalView.interface';
import i18n from './i18n';

const AGENT_LIST_POLL_INTERVAL = 3000;

/**
 * TransferInternalView - Internal agent selection for transfer.
 * Selecting an agent saves the selection and navigates to the
 * transfer confirmation page (two-step flow).
 */
@injectable({
  name: 'TransferInternalView',
})
class TransferInternalView extends RcViewModule {
  constructor(
    private _evTransferCall: EvTransferCall,
    private _evCall: EvCall,
    private _router: RouterPlugin,
    @optional('TransferInternalViewOptions')
    private _options?: TransferInternalViewOptions,
  ) {
    super();
  }

  /**
   * Save the selected agent and navigate to the transfer confirmation page.
   */
  selectAgent(agentId: string): void {
    this._evTransferCall.changeTransferAgentId(agentId);
    this._evTransferCall.changeTransferType(transferTypes.internal);
    this._router.replace(
      `/activityCallLog/${this._evCall.activityCallId}/transferCall`,
    );
  }

  cancel(): void {
    this._router.replace(
      `/activityCallLog/${this._evCall.activityCallId}`,
    );
  }

  component(_props?: TransferInternalViewProps) {
    const { t } = useLocale(i18n);
    const [searchTerm, setSearchTerm] = useState('');

    const { agentList } = useConnector(() => ({
      agentList: this._evTransferCall.transferAgentList,
    }));

    useEffect(() => {
      this._evTransferCall.fetchAgentList();
      const timerId = setInterval(() => {
        this._evTransferCall.fetchAgentList();
      }, AGENT_LIST_POLL_INTERVAL);
      return () => clearInterval(timerId);
    }, []);

    const filteredAgents = agentList.filter((agent) => {
      if (!searchTerm) return true;
      const name = `${agent.firstName} ${agent.lastName}`.toLowerCase();
      const keywords = searchTerm.toLowerCase().trim().split(/\s+/);
      return keywords.every((kw) => name.includes(kw));
    });

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTerm(e.target.value);
      },
      [],
    );

    const handleSelectAgent = useCallback((agentId: string) => {
      this.selectAgent(agentId);
    }, []);

    const handleCancel = useCallback(() => {
      this.cancel();
    }, []);

    return (
      <>
        <AppHeaderNav override>
          <PageHeader onBackClick={handleCancel}>
            {t('internalTransfer')}
          </PageHeader>
        </AppHeaderNav>

        <div className="flex flex-col flex-1 bg-neutral-base overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <TextField
              data-sign="searchAgents"
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t('searchAgents')}
              fullWidth
              size="medium"
            />
          </div>

          <div className="flex-1 overflow-hidden">
            {filteredAgents.length === 0 ? (
              <div className="text-center text-neutral-b2 py-8 typography-mainText">
                {t('noAgents')}
              </div>
            ) : (
              <VirtualizedList
                data={filteredAgents}
                computeItemKey={(_index, agent) => agent.agentId}
              >
                {(_index, agent) => (
                  <ListItem
                    data-sign="agentItem"
                    onClick={() => handleSelectAgent(agent.agentId)}
                    size="large"
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 mr-3 ${
                        agent.available ? 'bg-success' : 'bg-neutral-b3'
                      }`}
                    />
                    <ListItemText
                      primary={`${agent.firstName} ${agent.lastName}`}
                      secondary={t(
                        agent.available ? 'available' : 'unavailable',
                      )}
                    />
                  </ListItem>
                )}
              </VirtualizedList>
            )}
          </div>
        </div>

        <AppFooterNav />
      </>
    );
  }
}

export { TransferInternalView };
