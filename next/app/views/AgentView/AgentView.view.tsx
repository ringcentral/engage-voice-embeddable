import {
  computed,
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  type UIFunctions,
  type UIProps,
  useConnector,
  useIsMainClient,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import {
  SyncTabView,
  type SyncTabProps,
} from '@ringcentral-integration/micro-core/src/app/views';
import { AppHeaderNav } from '@ringcentral-integration/micro-core/src/app/components';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { DialerView } from '../DialerView';
import { LeadsView } from '../LeadsView';
import { CallHistoryView } from '../CallHistoryView';
import { WorkingStateSelectView } from '../WorkingStateSelectView';

import type {
  AgentViewOptions,
  AgentViewProps,
  AgentViewPanelProps,
} from './AgentView.interface';
import i18n from './i18n';

/**
 * Sync Tab ID for Agent View tabs
 */
export const AGENT_TAB_ID = 'agentTabs';

/**
 * AgentView - Tabbed view for agent operations
 * Displays dialer, leads, and history tabs using SyncTabView
 */
@injectable({
  name: 'AgentView',
})
class AgentView extends RcViewModule {
  constructor(
    protected _router: RouterPlugin,
    protected _syncTabView: SyncTabView,
    protected _dialerView: DialerView,
    protected _leadsView: LeadsView,
    protected _callHistoryView: CallHistoryView,
    protected _workingStateSelectView: WorkingStateSelectView,
    @optional('AgentViewOptions')
    protected _agentViewOptions?: AgentViewOptions,
  ) {
    super();
  }

  @computed
  get tabs(): SyncTabProps['tabs'] {
    return [
      {
        id: 'dialer',
        label: i18n.getString('dialer'),
        component: <this._dialerView.component />,
      },
      {
        id: 'leads',
        label: i18n.getString('leads'),
        component: <this._leadsView.component />,
      },
      {
        id: 'history',
        label: i18n.getString('history'),
        component: <this._callHistoryView.component />,
      },
    ];
  }

  get defaultTab(): string {
    return this._agentViewOptions?.defaultTab ?? 'dialer';
  }

  getUIProps(_props: AgentViewProps): UIProps<AgentViewPanelProps> {
    return {
      tabs: this.tabs,
      currentTab: this.defaultTab,
    };
  }

  getUIFunctions(_props: AgentViewProps): UIFunctions<AgentViewPanelProps> {
    return {};
  }

  component(props?: AgentViewProps) {
    const { t } = useLocale(i18n);
    const isMainClient = useIsMainClient();
    const [routeTabId, setRouteTabId] = useState<string | null>(null);

    const { tabs } = useConnector(() => {
      const uiProps = this.getUIProps(props ?? {});
      return {
        ...props,
        ...uiProps,
      };
    });

    // Allow user to switch to the tab by URL
    this._router.useParams<{ tabId: string | undefined }>((params) => {
      const tabId = params.tabId;
      if (tabId && isMainClient) {
        setRouteTabId(tabId);
      }
    });

    useEffect(() => {
      if (tabs.some((tab) => tab.id === routeTabId)) {
        this._syncTabView.replaceActive(AGENT_TAB_ID, routeTabId);
        // Reset router to base path to avoid triggering replace again
        this._router.replace('/agent');
      }
    }, [routeTabId, tabs]);
    return (
      <>
        <AppHeaderNav
          title={t('agentTitle')}
        >
          <this._workingStateSelectView.component />
        </AppHeaderNav>
        {
          tabs.length > 0 ? (
            <this._syncTabView.component
              id={AGENT_TAB_ID}
              className={clsx('[&_.sui-tab]:max-w-none [&_.sui-tab]:flex-grow')}
              variant="scrollable"
              tabs={tabs.map((tab) => ({
                ...tab,
                label: t(tab.id as 'dialer' | 'leads' | 'history'),
              }))}
              defaultValue={props?.initialTab ?? this.defaultTab}
            />
          ) : null
        }
      </>
    );
  }
}

export { AgentView };
