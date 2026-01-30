import GlobalStorage from '@ringcentral-integration/commons/modules/GlobalStorage';
import MessageTransport from '@ringcentral-integration/commons/lib/MessageTransport';
import { EvDialerUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvDialerUI';
import type { EvSubscription } from '@ringcentral-integration/engage-voice-widgets/modules/EvSubscription';
import messageTypes from '../../enums/messageTypes';

export interface State {
  closed: boolean;
  minimized: boolean;
  size: any;
  position: any;
}

export interface AdapterOptions {
  targetWindow?: Window;
  fromPopup?: boolean;
}

export interface Deps {
  globalStorage: GlobalStorage;
  evDialerUI: EvDialerUI;
  evSubscription: EvSubscription;
  adapterOptions?: AdapterOptions;
}

export interface Interface extends State {
  transport: MessageTransport;
  messageTypes: typeof messageTypes;
}
