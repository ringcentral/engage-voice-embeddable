import {
  injectable,
  optional,
  RcModule,
} from '@ringcentral-integration/next-core';
import { DialerPadSoundsMPEG } from '@ringcentral/spring-ui';
import { BehaviorSubject } from 'rxjs';

import { sleep } from '../../../lib/utils';
import type { EvAudioSettingsOptions } from './EvAudioSettings.interface';

/**
 * Time to let the unlock tone finish before the banner disappears.
 */
const UNLOCK_TONE_DURATION = 1000;

/**
 * EvAudioSettings module - tracks whether the agent has unlocked audio playback
 * for this document.
 *
 * Browsers refuse to play audio until the document has received a user gesture,
 * which silently swallows the incoming call ringtone played by
 * `EvIntegratedSoftphone`. We surface an "Initialize audio" action so the agent
 * can unlock it deliberately instead of finding out by missing a call.
 *
 * The flag is intentionally NOT a `@state`: `@state` lives in the shared redux
 * store and is replicated to every window, while audio playback permission is a
 * property of a single document. Each client gets its own instance of this
 * module, so a plain observable field is per tab, which is what we need.
 */
@injectable({
  name: 'EvAudioSettings',
})
class EvAudioSettings extends RcModule {
  private _autoplayEnabled$ = new BehaviorSubject(false);

  constructor(
    @optional('EvAudioSettingsOptions')
    private evAudioSettingsOptions?: EvAudioSettingsOptions,
  ) {
    super();
  }

  get enableAudioInitPrompt(): boolean {
    return !!this.evAudioSettingsOptions?.enableAudioInitPrompt;
  }

  get autoplayEnabled$() {
    return this._autoplayEnabled$.asObservable();
  }

  get autoplayEnabled(): boolean {
    return this._autoplayEnabled$.value;
  }

  private _setAutoplayEnabled(enabled: boolean) {
    if (this._autoplayEnabled$.value !== enabled) {
      this._autoplayEnabled$.next(enabled);
    }
  }

  /**
   * Unlock audio playback for this document. MUST be called from within a user
   * gesture handler: playing an audible sound inside the gesture is what makes
   * the browser trust subsequent `play()` calls.
   *
   * Only marks audio as enabled when playback actually succeeded, so a blocked
   * click leaves the banner in place instead of hiding a still broken ringtone.
   */
  async initializeAudio(): Promise<boolean> {
    let played = false;
    try {
      const audio = new Audio(DialerPadSoundsMPEG['1']);
      audio.volume = 0.1;
      await audio.play();
      played = true;
    } catch (error) {
      this.logger.warn('initializeAudio~~ failed to play unlock tone', error);
    }
    // Let the tone finish before the banner disappears.
    await sleep(UNLOCK_TONE_DURATION);
    if (played) {
      this._setAutoplayEnabled(true);
    }
    return played;
  }
}

export { EvAudioSettings };
