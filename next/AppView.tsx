import {
  AppAnnouncementRender,
  useAppFooter,
} from '@ringcentral-integration/micro-core/src/app/components';
import {
  HeaderNavViewSpring,
  SpringAppRootView,
  VIEW_TRANSITION_DETAIL_IDENTIFY,
} from '@ringcentral-integration/micro-core/src/app/views';
import { LoginView } from '@ringcentral-integration/micro-auth/src/app/views';
import {
  autobind,
  injectable,
  optional,
  RcViewModule,
  Route as RouterRoute,
  Switch,
} from '@ringcentral-integration/next-core';
import React, { ReactNode } from 'react';

// Core Views
import { MainView } from './app/view/MainView';
import { SessionConfigView } from './app/view/SessionConfigView';
import { DialerView } from './app/view/DialerView';
import { ActivityCallView } from './app/view/ActivityCallView';
import { CallHistoryView } from './app/view/CallHistoryView';
import { LeadsView } from './app/view/LeadsView';
import { ManualDialSettingsView } from './app/view/ManualDialSettingsView';

// New Views
import { ChooseAccountView } from './app/view/ChooseAccountView';
import { SessionUpdateView } from './app/view/SessionUpdateView';
import { SettingsView } from './app/view/SettingsView';
import { TransferCallView } from './app/view/TransferCallView';
import { TransferInternalView } from './app/view/TransferInternalView';
import { TransferPhoneBookView } from './app/view/TransferPhoneBookView';
import { TransferManualEntryView } from './app/view/TransferManualEntryView';
import { RequeueCallGroupView } from './app/view/RequeueCallGroupView';
import { RequeueCallGroupItemView } from './app/view/RequeueCallGroupItemView';
import { ActiveCallListView } from './app/view/ActiveCallListView';
import { CallHistoryDetailView } from './app/view/CallHistoryDetailView';

import type { AppViewOptions } from './interfaces';

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
      path: '/dialer',
      component: this._dialerView.component,
      authentication: true,
    },
    // Call-related routes (more specific routes first)
    {
      path: '/calls/:id/transferCall/queueGroup/:groupId',
      component: this._requeueCallGroupItemView.component,
      authentication: true,
    },
    {
      path: '/calls/:id/transferCall/queueGroup',
      component: this._requeueCallGroupView.component,
      authentication: true,
    },
    {
      path: '/calls/:id/transferCall/internal',
      component: this._transferInternalView.component,
      authentication: true,
    },
    {
      path: '/calls/:id/transferCall/phoneBook',
      component: this._transferPhoneBookView.component,
      authentication: true,
    },
    {
      path: '/calls/:id/transferCall/manualEntry',
      component: this._transferManualEntryView.component,
      authentication: true,
    },
    {
      path: '/calls/:id/transferCall',
      component: this._transferCallView.component,
      authentication: true,
    },
    {
      path: '/calls/:id/activeCallList',
      component: this._activeCallListView.component,
      authentication: true,
    },
    {
      path: '/calls',
      component: this._activityCallView.component,
      authentication: true,
    },
    // History routes
    {
      path: '/history/:id/:method',
      component: this._callHistoryDetailView.component,
      authentication: true,
    },
    {
      path: '/history',
      component: this._callHistoryView.component,
      authentication: true,
    },
    // Other authenticated routes
    {
      path: '/leads',
      component: this._leadsView.component,
      authentication: true,
    },
    {
      path: '/settings/main',
      component: this._settingsView.component,
      authentication: true,
    },
    {
      path: '/settings',
      component: this._manualDialSettingsView.component,
      authentication: true,
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
    private _headerNavView: HeaderNavViewSpring,
    private _loginView: LoginView,
    // Core views
    private _mainView: MainView,
    private _sessionConfigView: SessionConfigView,
    private _dialerView: DialerView,
    private _activityCallView: ActivityCallView,
    private _callHistoryView: CallHistoryView,
    private _leadsView: LeadsView,
    private _manualDialSettingsView: ManualDialSettingsView,
    // New views
    private _chooseAccountView: ChooseAccountView,
    private _sessionUpdateView: SessionUpdateView,
    private _settingsView: SettingsView,
    private _transferCallView: TransferCallView,
    private _transferInternalView: TransferInternalView,
    private _transferPhoneBookView: TransferPhoneBookView,
    private _transferManualEntryView: TransferManualEntryView,
    private _requeueCallGroupView: RequeueCallGroupView,
    private _requeueCallGroupItemView: RequeueCallGroupItemView,
    private _activeCallListView: ActiveCallListView,
    private _callHistoryDetailView: CallHistoryDetailView,
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
              <main className="flex flex-col flex-auto overflow-y-auto h-full overflow-x-hidden">
                <Switch>{this.routesMap.authentication}</Switch>
              </main>
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
