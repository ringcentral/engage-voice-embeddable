import {
  injectable,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import type { MainView } from './app/view/MainView';
import type { SessionConfigView } from './app/view/SessionConfigView';
import type { DialerView } from './app/view/DialerView';
import type { ActivityCallView } from './app/view/ActivityCallView';
import type { CallHistoryView } from './app/view/CallHistoryView';
import type { LeadsView } from './app/view/LeadsView';
import type { ManualDialSettingsView } from './app/view/ManualDialSettingsView';

/**
 * AppView - Root application view
 * Handles routing between different views
 */
@injectable({
  name: 'AppView',
})
class AppView extends RcViewModule {
  constructor(
    private mainView: MainView,
    private sessionConfigView: SessionConfigView,
    private dialerView: DialerView,
    private activityCallView: ActivityCallView,
    private callHistoryView: CallHistoryView,
    private leadsView: LeadsView,
    private manualDialSettingsView: ManualDialSettingsView,
  ) {
    super();
  }

  component() {
    return (
      <div className="w-[344px] h-[536px] bg-neutral-base overflow-hidden">
        <Switch>
          <Route path="/sessionConfig">
            <this.sessionConfigView.component />
          </Route>
          <Route path="/dialer">
            <this.dialerView.component />
          </Route>
          <Route path="/calls">
            <this.activityCallView.component />
          </Route>
          <Route path="/history">
            <this.callHistoryView.component />
          </Route>
          <Route path="/leads">
            <this.leadsView.component />
          </Route>
          <Route path="/settings">
            <this.manualDialSettingsView.component />
          </Route>
          <Route path="/">
            <this.mainView.component />
          </Route>
        </Switch>
      </div>
    );
  }
}

export { AppView };
