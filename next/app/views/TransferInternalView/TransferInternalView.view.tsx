import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
  type UIProps,
  type UIFunctions,
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
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { transferTypes } from '../../../enums';
import { EvTransferCall } from '../../services/EvTransferCall';
import type { EvDirectAgentListItem } from '../../services/EvTransferCall/EvTransferCall.interface';
import { EvCall } from '../../services/EvCall';
import type {
  TransferInternalViewOptions,
  TransferInternalViewProps,
  TransferInternalViewUIProps,
  TransferInternalViewUIFunctions,
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

  /**
   * Get UI state props for the component
   */
  getUIProps(): UIProps<TransferInternalViewUIProps> {
    return {
      agentList: this._evTransferCall.transferAgentList,
    };
  }

  /**
   * Get UI action functions for the component
   */
  getUIFunctions(): UIFunctions<TransferInternalViewUIFunctions> {
    return {
      onSelectAgent: (agentId: string) => this.selectAgent(agentId),
      onCancel: () => this.cancel(),
      fetchAgentList: () => this._evTransferCall.fetchAgentList(),
    };
  }

  component(_props?: TransferInternalViewProps) {
    const { t } = useLocale(i18n);
    const { current: uiFunctions } = useRef(this.getUIFunctions());
    const uiProps = useConnector(() => this.getUIProps());
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      uiFunctions.fetchAgentList();
      const timerId = setInterval(
        uiFunctions.fetchAgentList,
        AGENT_LIST_POLL_INTERVAL,
      );
      return () => clearInterval(timerId);
    }, [uiFunctions]);

    const filteredAgents = useMemo(() => {
      if (!searchTerm) return uiProps.agentList;
      const keywords = searchTerm.toLowerCase().trim().split(/\s+/);
      return uiProps.agentList.filter((agent) => {
        const name = `${agent.firstName} ${agent.lastName}`.toLowerCase();
        return keywords.every((kw) => name.includes(kw));
      });
    }, [uiProps.agentList, searchTerm]);

    return (
      <>
        <AppHeaderNav override>
          <PageHeader onBackClick={uiFunctions.onCancel}>
            {t('internalTransfer')}
          </PageHeader>
        </AppHeaderNav>

        <div className="flex flex-col flex-1 bg-neutral-base overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <TextField
              data-sign="searchAgents"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <VirtualizedList<EvDirectAgentListItem>
                data={filteredAgents}
                computeItemKey={(_index, agent) => agent.agentId}
              >
                {(_index, agent) => (
                  <ListItem
                    data-sign="agentItem"
                    onClick={() => uiFunctions.onSelectAgent(agent.agentId)}
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
