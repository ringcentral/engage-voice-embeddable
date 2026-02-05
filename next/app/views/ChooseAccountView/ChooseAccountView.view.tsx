import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { Icon } from '@ringcentral/spring-ui';
import { ArrowRightMd } from '@ringcentral/spring-icon';
import React, { useCallback, useState } from 'react';

import { EvAuth } from '../../services/EvAuth';
import type {
  ChooseAccountViewOptions,
  ChooseAccountViewProps,
} from './ChooseAccountView.interface';
import i18n from './i18n';

/**
 * ChooseAccountView - Agent account selection view
 * Displayed when multiple agent accounts are available after authentication
 */
@injectable({
  name: 'ChooseAccountView',
})
class ChooseAccountView extends RcViewModule {
  constructor(
    private _evAuth: EvAuth,
    private _router: RouterPlugin,
    @optional('ChooseAccountViewOptions')
    private _options?: ChooseAccountViewOptions,
  ) {
    super();
  }

  async selectAgent(agentId: string): Promise<void> {
    this._evAuth.setAgentId(agentId);
    await this._evAuth.openSocketWithSelectedAgentId({
      syncOtherTabs: true,
      retryOpenSocket: true,
    });
    this._router.push('/sessionConfig');
  }

  component(_props?: ChooseAccountViewProps) {
    const { t } = useLocale(i18n);
    const [isLoading, setIsLoading] = useState(false);

    const { agents } = useConnector(() => ({
      agents: this._evAuth.authenticateResponse?.agents || [],
    }));

    const handleSelectAgent = useCallback(
      async (agentId: string) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
          await this.selectAgent(agentId);
        } finally {
          setIsLoading(false);
        }
      },
      [isLoading],
    );

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-y-auto">
        <h1 className="typography-title text-center mb-6">
          {t('chooseAccount')}
        </h1>

        <div className="flex-1 overflow-y-auto">
          {agents.map((agent) => (
            <button
              key={agent.agentId}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectAgent(agent.agentId)}
              data-sign="subAccount"
              className="w-full h-14 px-4 border-b border-neutral-b4 bg-neutral-base hover:bg-neutral-b5 transition-colors text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex-1 min-w-0">
                <div className="typography-subtitle truncate">
                  {agent.accountName}
                </div>
                <div className="typography-descriptor text-neutral-b2 truncate">
                  {t(agent.agentType)}
                </div>
              </div>
              <Icon symbol={ArrowRightMd} size="medium" />
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export { ChooseAccountView };
