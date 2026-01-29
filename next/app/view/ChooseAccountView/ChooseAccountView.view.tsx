import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback } from 'react';

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
    this._options?.onAccountSelected?.(agentId);
    await this._evAuth.openSocketWithSelectedAgentId();
    this._router.push('/sessionConfig');
  }

  component(_props?: ChooseAccountViewProps) {
    const { t } = useLocale(i18n);

    const { agents } = useConnector(() => ({
      agents: this._evAuth.authenticateResponse?.agents || [],
    }));

    const handleSelectAgent = useCallback(
      async (agentId: string) => {
        await this.selectAgent(agentId);
      },
      [],
    );

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-y-auto">
        <h1 className="typography-title mb-2">{t('chooseAccount')}</h1>
        <p className="typography-descriptor text-neutral-b2 mb-6">
          {t('selectAgent')}
        </p>

        <div className="flex-1 overflow-y-auto">
          {agents.map((agent) => (
            <button
              key={agent.agentId}
              type="button"
              onClick={() => handleSelectAgent(agent.agentId)}
              className="w-full p-4 mb-2 border border-neutral-b4 rounded-lg bg-neutral-base hover:bg-neutral-b5 transition-colors text-left"
            >
              <div className="typography-subtitle truncate">
                {agent.firstName} {agent.lastName}
              </div>
              <div className="typography-descriptor text-neutral-b2 truncate">
                {agent.username}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export { ChooseAccountView };
