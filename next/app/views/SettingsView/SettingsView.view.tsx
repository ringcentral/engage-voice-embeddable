import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { LinkLine } from '@ringcentral-integration/next-widgets/components';
import { Button } from '@ringcentral/spring-ui';
import { SettingsMd, RefreshMd } from '@ringcentral/spring-icon';
import React, { useCallback } from 'react';

import { EvAuth } from '../../services/EvAuth';
import { EvSettings } from '../../services/EvSettings';
import type {
  SettingsViewOptions,
  SettingsViewProps,
} from './SettingsView.interface';
import i18n from './i18n';

/**
 * SettingsView - General application settings view
 * Displays agent info, provides access to settings and logout
 */
@injectable({
  name: 'SettingsView',
})
class SettingsView extends RcViewModule {
  constructor(
    private _evAuth: EvAuth,
    private _evSettings: EvSettings,
    private _router: RouterPlugin,
    @optional('SettingsViewOptions')
    private _options?: SettingsViewOptions,
  ) {
    super();
  }

  goToManualDialSettings() {
    this._router.push('/settings');
  }

  goToUpdateSession() {
    this._router.push('/sessionUpdate');
  }

  async logout() {
    this._options?.onLogout?.();
    await this._evAuth.logout();
  }

  component(_props?: SettingsViewProps) {
    const { t } = useLocale(i18n);

    const { agentName, loginType } = useConnector(() => ({
      agentName: this._evAuth.agentConfig?.agentSettings
        ? `${this._evAuth.agentConfig.agentSettings.firstName} ${this._evAuth.agentConfig.agentSettings.lastName}`
        : '',
      loginType: this._evSettings.loginType,
    }));

    const handleManualDialSettings = useCallback(() => {
      this.goToManualDialSettings();
    }, []);

    const handleUpdateSession = useCallback(() => {
      this.goToUpdateSession();
    }, []);

    const handleLogout = useCallback(async () => {
      await this.logout();
    }, []);

    const version = this._options?.version || '1.0.0';

    return (
      <div className="flex flex-col h-full bg-neutral-base overflow-y-auto">
        {/* Agent Info Header */}
        <div className="p-4 bg-neutral-b5">
          <div className="typography-subtitle mb-1">{t('agentInfo')}</div>
          <div className="typography-mainText text-neutral-b1">{agentName}</div>
          {loginType && (
            <div className="typography-descriptor text-neutral-b2 mt-1">
              {t('loginType')}: {loginType}
            </div>
          )}
        </div>

        {/* Settings Menu using LinkLine */}
        <div className="flex-1">
          <LinkLine
            onClick={handleManualDialSettings}
            startIcon={SettingsMd}
            data-sign="manualDialSettings"
          >
            {t('manualDialSettings')}
          </LinkLine>

          <LinkLine
            onClick={handleUpdateSession}
            startIcon={RefreshMd}
            data-sign="updateSession"
          >
            {t('updateSession')}
          </LinkLine>
        </div>

        {/* Version */}
        <div className="text-center py-4">
          <span className="typography-descriptor text-neutral-b3">
            {t('version')}: {version}
          </span>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <Button
            variant="outlined"
            color="danger"
            fullWidth
            onClick={handleLogout}
            data-sign="logoutButton"
          >
            {t('logout')}
          </Button>
        </div>
      </div>
    );
  }
}

export { SettingsView };
