import GlobalStorage from 'ringcentral-integration/modules/GlobalStorage';
import MessageTransport from 'ringcentral-integration/lib/MessageTransport';
import { EvDialerUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvDialerUI';
import messageTypes from '../../enums/messageTypes';

export interface State {
  closed: boolean;
  minimized: boolean;
  size: any;
  position: any;
}

export interface AdapterOptions {
  targetWindow?: Window;
}

export interface Deps {
  globalStorage: GlobalStorage;
  evDialerUI: EvDialerUI;
  adapterOptions?: AdapterOptions;
}

export interface Interface extends State {
  transport: MessageTransport;
  messageTypes: typeof messageTypes;
}
