import React, { ReactNode } from 'react';
import {
  autobind,
  injectable,
  optional,
  RcViewModule,
  Route as RouterRoute,
  Switch,
} from '@ringcentral-integration/next-core';
import {
  AppAnnouncementRender,
  useAppFooter,
} from '@ringcentral-integration/micro-core/src/app/components';
import {
  HeaderNavViewSpring,
  SpringAppRootView,
  VIEW_TRANSITION_DETAIL_IDENTIFY,
} from '@ringcentral-integration/micro-core/src/app/views';
import { ContactAvatar } from './components/ContactAvatar';
// Core Views
import { LoginView } from './views/LoginView';
import { HeaderView } from './views/HeaderView';
import { SessionConfigView } from './views/SessionConfigView';
import { ActiveCallView } from './views/ActiveCallView';
import { DispositionView } from './views/DispositionView';
import { ManualDialSettingsView } from './views/ManualDialSettingsView';

// New Views
import { ChooseAccountView } from './views/ChooseAccountView';
import { SessionUpdateView } from './views/SessionUpdateView';
import { SessionInfoView } from './views/SessionInfoView';
import { SettingsView } from './views/SettingsView';
import { TransferView } from './views/TransferView';
import { ActiveCallListView } from './views/ActiveCallListView';
import { CallHistoryDetailView } from './views/CallHistoryDetailView';
import { AgentView } from './views/AgentView';
import { ConnectivityView } from './views/ConnectivityView';
import { WorkingStateSelectView } from './views/WorkingStateSelectView';

import type { AppViewOptions } from '../interfaces';

/**
 * AppView - Root application view
 * Handles routing between different views
 */
@injectable({
  name: 'AppView',
})
class AppView extends RcViewModule {
  @autobind
  Footer() {
    const { footer } = useAppFooter({
      defaultFooter: <this._headerNavView.component />,
    });

    return footer;
  }

  private routes = [
    // Login route (no authentication required)
    {
      path: '/',
      component: this._loginView.component,
      exact: true,
    },
    // Pre-session routes (no authentication required)
    {
      path: '/chooseAccount',
      component: this._chooseAccountView.component,
    },
    {
      path: '/sessionConfig',
      component: this._sessionConfigView.component,
    },
    // Authenticated routes
    {
      path: '/sessionUpdate',
      component: this._sessionUpdateView.component,
      authentication: true,
    },
    {
      path: '/sessionInfo',
      component: this._sessionInfoView.component,
      authentication: true,
    },
    {
      path: '/agent/:tabId?',
      component: this._agentView.component,
      authentication: true,
    },
    // Transfer call route (unified transfer page)
    {
      path: '/activityCallLog/:id/transferCall',
      component: this._transferView.component,
      authentication: true,
    },
    {
      path: '/activityCallLog/:id/activeCallList',
      component: this._activeCallListView.component,
      authentication: true,
    },
    {
      path: '/activityCallLog/:id/disposition',
      component: this._dispositionView.component,
      authentication: true,
    },
    {
      path: '/activityCallLog/:id',
      component: this._activeCallView.component,
      authentication: true,
    },
    // History call log route (for creating/updating call log from history)
    {
      path: '/history/:id/callLog/:method',
      component: this._dispositionView.component,
      authentication: true,
    },
    // History detail route (for viewing read-only call details)
    {
      path: '/history/:id/detail',
      component: this._callHistoryDetailView.component,
      authentication: true,
    },
    {
      path: '/settings/manualDial',
      component: this._manualDialSettingsView.component,
      authentication: true,
    },
    {
      path: '/settings',
      component: this._settingsView.component,
      authentication: true,
      exact: true,
    },
    // Custom routes from options
    ...(this._appViewOptions?.routes || []),
  ];

  private routesMap = this.routes.reduce(
    (acc, curr) => {
      const target = curr.authentication ? acc.authentication : acc.default;
      target.push(
        <RouterRoute
          key={curr.path}
          path={curr.path}
          exact={curr.exact}
          component={curr.component}
        />,
      );
      return acc;
    },
    {
      default: [] as ReactNode[],
      authentication: [] as ReactNode[],
    },
  );

  constructor(
    private _appRootView: SpringAppRootView,
    private _headerView: HeaderView,
    private _headerNavView: HeaderNavViewSpring,
    private _loginView: LoginView,
    // Core views
    private _sessionConfigView: SessionConfigView,
    private _agentView: AgentView,
    private _activeCallView: ActiveCallView,
    private _dispositionView: DispositionView,
    private _manualDialSettingsView: ManualDialSettingsView,
    // New views
    private _chooseAccountView: ChooseAccountView,
    private _sessionUpdateView: SessionUpdateView,
    private _sessionInfoView: SessionInfoView,
    private _settingsView: SettingsView,
    private _transferView: TransferView,
    private _activeCallListView: ActiveCallListView,
    private _callHistoryDetailView: CallHistoryDetailView,
    private _connectivityView: ConnectivityView,
    private _workingStateSelectView: WorkingStateSelectView,
    @optional('AppViewOptions')
    private _appViewOptions?: AppViewOptions,
  ) {
    super();
  }

  @autobind
  private MainContent() {
    return (
      <Switch>
        {this.routesMap.default}
        <RouterRoute
          path="/"
          component={() => (
            <>
              <this._headerView.component
                standAlone
                ContactAvatar={ContactAvatar}
              >
                <main className="flex flex-col flex-auto overflow-y-auto h-full overflow-x-hidden">
                  <Switch>{this.routesMap.authentication}</Switch>
                </main>
              </this._headerView.component>
              <this.Footer />
            </>
          )}
        />
      </Switch>
    );
  }

  component() {
    return (
      <this._appRootView.component
        header={
          <div className="flex-none">
            <AppAnnouncementRender>
              <this._connectivityView.component />
              <this._activeCallView.Announcement />
              <this._workingStateSelectView.Announcement />
              {this._appViewOptions?.headers}
            </AppAnnouncementRender>
          </div>
        }
      >
        <div
          className="flex flex-col h-full flex-auto overflow-hidden bg-neutral-base"
          id={VIEW_TRANSITION_DETAIL_IDENTIFY}
        >
          <this.MainContent />
        </div>
      </this._appRootView.component>
    );
  }
}

export { AppView };
