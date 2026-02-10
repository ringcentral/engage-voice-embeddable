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
 * plus EV-specific modes (socketDisconnected, sipUnregistered)
 */
export const ConnectivityPanel: FunctionComponent<EvConnectivityViewProps> = ({
  mode,
  loading,
  onClick,
  retry,
  sipRegistering,
  ...rest
}) => {
  const { t } = useLocale(i18n);
  if (!mode) return null;

  const isLoading = loading || sipRegistering;

  return (
    <Announcement
      severity="error"
      className="rounded-none"
      classes={{
        body: 'gap-2',
      }}
      data-sign="ConnectivityBadge"
      action={
        isLoading ? (
          <CircularProgressIndicator
            title={t('connecting')}
            color="danger"
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
