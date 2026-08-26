import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { Announcement } from '@ringcentral/spring-ui';
import type { FunctionComponent } from 'react';
import React from 'react';

import type { InitializeAudioViewProps } from './InitializeAudioView.interface';

import i18n from './i18n';

/**
 * InitializeAudioPanel - Prompts the agent to unlock audio playback.
 *
 * Browsers refuse to play audio until the document has received a user
 * gesture, which would silently mute the incoming call ringtone. Clicking the
 * action plays a short tone from inside the gesture handler, unlocking it.
 */
export const InitializeAudioPanel: FunctionComponent<
  Omit<InitializeAudioViewProps, 'show'>
> = ({ onInitializeAudio, ...rest }) => {
  const { t } = useLocale(i18n);
  return (
    <Announcement
      severity="info"
      className="rounded-none"
      classes={{
        body: 'gap-2',
        // Keep the action centred against the whole banner, not pinned to the
        // first line, once the message wraps at narrow widget widths.
        action: 'self-center',
      }}
      data-sign="initializeAudioBanner"
      action={
        <button
          className="typography-subtitleMini hover:underline active:opacity-80 shrink-0 whitespace-nowrap"
          onClick={onInitializeAudio}
          data-sign="initializeAudioButton"
        >
          {t('initializeAudio')}
        </button>
      }
      {...rest}
    >
      {t('audioDisabled')}
    </Announcement>
  );
};
