import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import {
  Announcement,
  CircularProgressIndicator,
} from '@ringcentral/spring-ui';
import type { FunctionComponent } from 'react';
import React from 'react';

import type { EvConnectivityViewProps } from './ConnectivityView.interface';

import i18n from './i18n';

/**
 * ConnectivityPanel - Displays connectivity status banner
 * Supports base modes (offline, voipOnly, survival, webphoneUnavailable, connecting)
 * plus EV-specific modes (socketDisconnected, sipUnstableConnection, sipConnecting)
 *
 * Uses error severity (red) for error states and info severity (blue) for
 * informational states like first-time SIP connecting.
 */
export const ConnectivityPanel: FunctionComponent<EvConnectivityViewProps> = ({
  mode,
  severity,
  loading,
  onClick,
  retry,
  ...rest
}) => {
  const { t } = useLocale(i18n);
  if (!mode) return null;
  const progressColor = severity === 'info' ? 'primary' : 'danger';
  return (
    <Announcement
      severity={severity}
      className="rounded-none"
      classes={{
        body: 'gap-2',
      }}
      data-sign="ConnectivityBadge"
      action={
        loading ? (
          <CircularProgressIndicator
            title={t('connecting')}
            color={progressColor}
            size="small"
          />
        ) : retry ? (
          <button
            className="typography-subtitleMini hover:underline active:opacity-80"
            onClick={onClick}
            data-sign="ConnectivityBadgeRefresh"
          >
            {t('refresh')}
          </button>
        ) : null
      }
      {...rest}
    >
      {t(mode as never)}
    </Announcement>
  );
};
