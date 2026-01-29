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
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-y-auto">
        <h1 className="typography-title mb-6">{t('settings')}</h1>

        {/* Agent Info */}
        <div className="mb-6 p-4 bg-neutral-b5 rounded-lg">
          <div className="typography-subtitle mb-1">{t('agentInfo')}</div>
          <div className="typography-mainText text-neutral-b1">{agentName}</div>
          {loginType && (
            <div className="typography-descriptor text-neutral-b2 mt-1">
              {t('loginType')}: {loginType}
            </div>
          )}
        </div>

        {/* Settings Menu */}
        <div className="flex-1">
          <button
            type="button"
            onClick={handleManualDialSettings}
            className="w-full p-4 mb-2 border border-neutral-b4 rounded-lg bg-neutral-base hover:bg-neutral-b5 transition-colors text-left"
          >
            <span className="typography-subtitle">{t('manualDialSettings')}</span>
          </button>

          <button
            type="button"
            onClick={handleUpdateSession}
            className="w-full p-4 mb-2 border border-neutral-b4 rounded-lg bg-neutral-base hover:bg-neutral-b5 transition-colors text-left"
          >
            <span className="typography-subtitle">{t('updateSession')}</span>
          </button>
        </div>

        {/* Version */}
        <div className="text-center mb-4">
          <span className="typography-descriptor text-neutral-b3">
            {t('version')}: {version}
          </span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3 border border-danger text-danger rounded-lg typography-subtitle hover:bg-danger-t10 transition-colors"
        >
          {t('logout')}
        </button>
      </div>
    );
  }
}

export { SettingsView };
