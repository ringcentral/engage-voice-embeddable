import React from 'react';
import { injectable, computed, optional, RouterPlugin } from '@ringcentral-integration/next-core';
import {
  HeaderNavViewSpring as HeaderNavViewSpringBase
} from '@ringcentral-integration/micro-core/src/app/views';
import type {
  NavButtonProps,
  HeaderNavViewSpringOptions,
} from '@ringcentral-integration/micro-core/src/app/views/HeaderNavViewSpring/HeaderNav.view.interface';
import { defaultTabMap } from '@ringcentral-integration/micro-core/src/app/views/HeaderNavViewSpring/utils/tabs';
import { Locale } from '@ringcentral-integration/micro-core/src/app/services';
import { t } from './i18n';

@injectable({
  name: 'HeaderNavViewSpring',
})
export class HeaderNavViewSpring extends HeaderNavViewSpringBase {
  constructor(
    protected _locale: Locale,
    protected _router: RouterPlugin,
    @optional('HeaderNavViewOptions')
    protected _headerNavViewOptions?: HeaderNavViewSpringOptions,
  ) {
    super(_locale, _router, _headerNavViewOptions);
  }

  @computed
  get tabs() {
    const tabs: NavButtonProps[] = [];
    tabs.push(this.agentTab);
    tabs.push(this.settingsTab);
    return tabs;
  }

  private get agentActive() {
    return this._router.currentPath?.includes('/agent');
  }

  @computed
  get agentTab(): NavButtonProps {
    return {
      ...defaultTabMap.dialer,
      title: t('agent'),
      tooltip: (
        <div>
          <div>{t('dialer')}</div>
          <div>{t('leads')}</div>
          <div>{t('history')}</div>
        </div>
      ),
      to: '/agent/dialer',
      active: this.agentActive,
      dataSign: 'agentTab',
      BadgeProps: {
        max: 99,
        count: 0,
      },
    };
  }
}