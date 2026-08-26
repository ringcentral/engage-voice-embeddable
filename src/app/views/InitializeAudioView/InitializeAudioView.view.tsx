import type { UIFunctions, UIProps } from '@ringcentral-integration/next-core';
import {
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import { Auth } from '@ringcentral-integration/micro-auth/src/app/services';
import { useObservableState } from 'observable-hooks';
import React, { useRef } from 'react';

import { EvAudioSettings } from '../../services/EvAudioSettings';
import { EvIntegratedSoftphone } from '../../services/EvIntegratedSoftphone';

import type { InitializeAudioViewProps } from './InitializeAudioView.interface';
import { InitializeAudioPanel } from './InitializeAudioPanel';

/**
 * InitializeAudioView - Shows the "Initialize audio" banner until the agent has
 * unlocked audio playback for this document.
 *
 * Only relevant for integrated softphone sessions, where a blocked
 * `Audio.play()` means the agent never hears the ringtone. Gated behind the
 * `enableAudioInitPrompt` option so integrators opt in.
 *
 * We deliberately do not try to detect whether the browser would allow playback
 * and hide the banner on that basis: signing in is itself a user gesture, so by
 * the time `loggedIn` is true the check always passes and the agent would never
 * get the affordance. This matches the RingEX widget, which always offers the
 * action until it is used.
 */
@injectable({
  name: 'InitializeAudioView',
})
export class InitializeAudioView extends RcViewModule {
  constructor(
    protected _evAudioSettings: EvAudioSettings,
    protected _auth: Auth,
    @optional() protected _evIntegratedSoftphone?: EvIntegratedSoftphone,
  ) {
    super();
  }

  getUIProps(): UIProps<InitializeAudioViewProps> {
    return {
      show:
        this._evAudioSettings.enableAudioInitPrompt &&
        this._auth.loggedIn &&
        !!this._evIntegratedSoftphone?.isIntegratedSoftphone &&
        // Only once the softphone is fully registered. While it is registering
        // or unstable the ConnectivityView already owns the banner slot, and
        // stacking two banners looks broken.
        this._evIntegratedSoftphone.sipState === 'registered' &&
        !this._evIntegratedSoftphone.sipUnstableConnection,
    };
  }

  getUIFunctions(): UIFunctions<InitializeAudioViewProps> {
    return {
      onInitializeAudio: () => {
        this._evAudioSettings.initializeAudio();
      },
    };
  }

  component(props?: Pick<InitializeAudioViewProps, 'className'>) {
    const { current: uiFunctions } = useRef(this.getUIFunctions());
    const { show } = useConnector(() => this.getUIProps());
    const autoplayEnabled = useObservableState(
      this._evAudioSettings.autoplayEnabled$,
      this._evAudioSettings.autoplayEnabled,
    );
    if (!show || autoplayEnabled) return null;
    return <InitializeAudioPanel {...props} {...uiFunctions} />;
  }
}
