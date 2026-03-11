import {
  injectable,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { Locale } from '@ringcentral-integration/micro-core/src/app/services';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { AppHeaderNav, AppFooterNav } from '@ringcentral-integration/micro-core/src/app/components';
import { PageHeader } from '@ringcentral-integration/next-widgets/components';
import { Button } from '@ringcentral/spring-ui';
import dayjs from 'dayjs';
import React, { useCallback, useMemo } from 'react';

import { EvAuth } from '../../services/EvAuth';
import { EvSettings } from '../../services/EvSettings';
import { EvCallMonitor } from '../../services/EvCallMonitor';
import { EvAgentSession } from '../../services/EvAgentSession';
import type {
  SessionInfoViewProps,
  SessionInfoItem,
} from './SessionInfoView.interface';
import i18n from './i18n';

/**
 * InfoRow component - displays label and value vertically
 */
interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div className="py-3">
    <div className="typography-subtitle text-neutral-b0 mb-1">{label}</div>
    <div className="typography-mainText text-neutral-b2">{value || 'N/A'}</div>
  </div>
);

/**
 * SessionInfoView - Displays detailed session information
 * Shows phone type, login style, login time, skill profile
 * Provides edit button to update session settings
 */
@injectable({
  name: 'SessionInfoView',
})
class SessionInfoView extends RcViewModule {
  constructor(
    private _evAuth: EvAuth,
    private _evSettings: EvSettings,
    private _evCallMonitor: EvCallMonitor,
    private _evAgentSession: EvAgentSession,
    private _locale: Locale,
    private _router: RouterPlugin,
  ) {
    super();
  }

  goBack() {
    this._router.goBack();
  }

  goToUpdateSession() {
    this._evAgentSession.resetFormGroup();
    this._router.push('/sessionUpdate');
  }

  /**
   * Check if edit session button should be disabled
   */
  get disableEditButton(): boolean {
    return (
      this._evCallMonitor.isOnCall ||
      this._evSettings.isOffhooking ||
      this._evSettings.isOffhook
    );
  }

  component(_props?: SessionInfoViewProps) {
    const { t } = useLocale(i18n);

    const {
      disableEditButton,
      loginDTS,
      loginType,
      dialDest,
      skillProfileName,
      dialGroupName,
    } = useConnector(() => ({
      disableEditButton: this.disableEditButton,
      loginDTS: this._evAuth.agentSettings?.loginDTS || '',
      loginType: this._evAuth.agentSettings?.loginType || '',
      dialDest: this._evAuth.agentSettings?.dialDest || '',
      skillProfileName:
        this._evAuth.inboundSettings?.skillProfile?.profileName || '',
      dialGroupName:
        (this._evAuth.agentConfig?.outboundSettings?.outdialGroup as any)
          ?.groupName || '',
    }));

    const sessionInfo = useMemo<SessionInfoItem[]>(() => {
      const loginTime = loginDTS
        ? dayjs(loginDTS).format('M/D/YYYY, h:mm A')
        : '';

      return [
        {
          label: t('phone'),
          value: dialDest,
        },
        {
          label: t('loginType'),
          value: loginType,
        },
        {
          label: t('loginTime'),
          value: loginTime,
        },
        {
          label: t('skillProfile'),
          value: skillProfileName,
        },
        {
          label: t('dialGroup'),
          value: dialGroupName,
        },
      ];
    }, [dialDest, loginDTS, loginType, skillProfileName, dialGroupName, t]);

    const handleBackClick = useCallback(() => {
      this.goBack();
    }, []);

    const handleEditSession = useCallback(() => {
      this.goToUpdateSession();
    }, []);

    return (
      <>
        <AppHeaderNav override>
          <PageHeader onBackClick={handleBackClick}>
            {t('sessionInfo')}
          </PageHeader>
        </AppHeaderNav>

        <div className="flex flex-col flex-1 bg-neutral-base overflow-y-auto overflow-x-hidden">
          {/* Session Info List */}
          <div className="flex-1 px-4 divide-y divide-neutral-b4">
            {sessionInfo.map(({ value, label }) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </div>

          {/* Edit Button */}
          <div className="p-4 mt-auto">
            <Button
              data-sign="editSessionButton"
              color="primary"
              variant="contained"
              fullWidth
              size="medium"
              disabled={disableEditButton}
              onClick={handleEditSession}
            >
              {t('edit')}
            </Button>
          </div>
        </div>
        <AppFooterNav />
      </>
    );
  }
}

export { SessionInfoView };
