import MessageTransport from 'ringcentral-integration/lib/MessageTransport';
import ContactMatcher from 'ringcentral-integration/modules/ContactMatcher';

import messageTypes from '../../enums/messageTypes';

export interface State {
  service: any;
}

export interface DepsModules {
  contactMatcher: ContactMatcher;
}

export interface Interface extends State {
  transport: MessageTransport;
  messageTypes: typeof messageTypes;
}
