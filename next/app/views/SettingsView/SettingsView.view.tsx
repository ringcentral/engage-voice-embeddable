import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { AppHeaderNav } from '@ringcentral-integration/micro-core/src/app/components';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import {
  Line,
  LinkLine,
} from '@ringcentral-integration/next-widgets/components';
import { Button, Tooltip, Text } from '@ringcentral/spring-ui';
import React, { useCallback } from 'react';

import { EvAuth } from '../../services/EvAuth';
import type { SettingsViewOptions, SettingsViewProps } from './SettingsView.interface';
import i18n from './i18n';

/**
 * Section component for grouping settings items
 */
interface SectionProps {
  label?: string;
  children: React.ReactNode;
  headerEndAdornment?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  label,
  children,
  headerEndAdornment,
}) => (
  <div>
    {label && (
      <div className="flex items-center gap-1 mb-1">
        <Text
          className="typography-descriptorMini text-neutral-b0"
          component="p"
          title={label}
        >
          {label}
        </Text>
        {headerEndAdornment}
      </div>
    )}
    <div className="rounded-lg overflow-hidden bg-neutral-b5/90 [&>*:nth-child(1)>[data-divider]]:hidden">
      {children}
    </div>
  </div>
);

/**
 * SettingsView - General application settings view
 * Displays agent info, provides navigation to session info and settings
 */
@injectable({
  name: 'SettingsView',
})
class SettingsView extends RcViewModule {
  constructor(
    private _evAuth: EvAuth,
    private _router: RouterPlugin,
    @optional('SettingsViewOptions')
    private _options?: SettingsViewOptions,
  ) {
    super();
  }

  goToManualDialSettings() {
    this._router.push('/settings/manualDial');
  }

  goToSessionInfo() {
    this._router.push('/sessionInfo');
  }

  async logout() {
    this._options?.onLogout?.();
    await this._evAuth.logout();
  }

  /**
   * Get agent name from config
   */
  get agentName(): string | null {
    const settings = this._evAuth.agentConfig?.agentSettings;
    if (!settings?.firstName && !settings?.lastName) {
      return null;
    }
    return `${settings.firstName || ''} ${settings.lastName || ''}`.trim();
  }

  /**
   * Get username from agent settings
   */
  get userName(): string {
    return this._evAuth.agentSettings?.username || '';
  }

  /**
   * Check if session info page should be accessible
   */
  get canAccessSessionInfo(): boolean {
    return this._evAuth.agentPermissions?.allowLoginUpdates ?? false;
  }

  component(_props?: SettingsViewProps) {
    const { t } = useLocale(i18n);

    const { agentName, userName, canAccessSessionInfo } = useConnector(() => ({
      agentName: this.agentName,
      userName: this.userName,
      canAccessSessionInfo: this.canAccessSessionInfo,
    }));

    const handleManualDialSettings = useCallback(() => {
      this.goToManualDialSettings();
    }, []);

    const handleSessionInfo = useCallback(() => {
      this.goToSessionInfo();
    }, []);

    const handleLogout = useCallback(async () => {
      await this.logout();
    }, []);

    const version = this._options?.version || '1.0.0';

    return (
      <>
        <AppHeaderNav
          title={t('settings')}
        >
          <></>
        </AppHeaderNav>
        <div className="flex flex-col h-full bg-neutral-base overflow-y-auto overflow-x-hidden px-3">
          <div className="space-y-3 py-3">
            {/* Agent Section */}
            <Section label={t('agent')}>
              {/* Agent Info */}
              <Line data-sign="agentInfo">
                <div className="flex flex-col py-1">
                  {agentName && (
                    <Tooltip title={agentName}>
                      <span className="typography-subtitle text-neutral-b0 truncate">
                        {agentName}
                      </span>
                    </Tooltip>
                  )}
                  <Tooltip title={userName}>
                    <span className="typography-descriptor text-neutral-b2 truncate">
                      {userName}
                    </span>
                  </Tooltip>
                </div>
              </Line>

              {/* Session Info - Navigate to detail page */}
              {canAccessSessionInfo && (
                <LinkLine data-sign="sessionInfo" onClick={handleSessionInfo}>
                  {t('sessionInfo')}
                </LinkLine>
              )}
            </Section>

            {/* General Section */}
            <Section label={t('general')}>
              <LinkLine
                data-sign="manualDialSettings"
                onClick={handleManualDialSettings}
              >
                {t('manualDialSettings')}
              </LinkLine>

              <Line
                data-sign="version"
                endAdornment={
                  <span className="typography-mainText text-neutral-b2">
                    {version}
                  </span>
                }
              >
                {t('version')}
              </Line>
            </Section>
          </div>

          {/* Logout Button */}
          <div className="p-3 flex justify-center mt-auto">
            <Button
              data-sign="logoutButton"
              color="primary"
              variant="text"
              fullWidth
              size="medium"
              onClick={handleLogout}
            >
              {t('logout')}
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export { SettingsView };
