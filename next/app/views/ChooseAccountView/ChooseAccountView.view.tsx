import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { Brand } from '@ringcentral-integration/micro-core/src/app/services';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback, useState } from 'react';

import { EvAuth } from '../../services/EvAuth';
import { ChooseAccountPanel } from '../../components/ChooseAccountPanel';
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
    private _brand: Brand,
    @optional('ChooseAccountViewOptions')
    private _options?: ChooseAccountViewOptions,
  ) {
    super();
  }

  async selectAgent(agentId: string): Promise<void> {
    this._evAuth.setAgentId(agentId);
    this._options?.onAccountSelected?.(agentId);
    await this._evAuth.openSocketWithSelectedAgentId({
      syncOtherTabs: true,
      retryOpenSocket: true,
    });
    this._router.push('/sessionConfig');
  }

  component(_props?: ChooseAccountViewProps) {
    const { t } = useLocale(i18n);
    const [isLoading, setIsLoading] = useState(false);

    const { agents, logoUrl } = useConnector(() => ({
      agents: this._evAuth.authenticateResponse?.agents || [],
      logoUrl: this._brand.assets?.['logo'] as string | undefined,
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
      <ChooseAccountPanel
        agents={agents}
        isLoading={isLoading}
        onSelectAgent={handleSelectAgent}
        logoUrl={logoUrl}
        brandName={this._brand.name}
        title={t('chooseAccount')}
      />
    );
  }
}

export { ChooseAccountView };
