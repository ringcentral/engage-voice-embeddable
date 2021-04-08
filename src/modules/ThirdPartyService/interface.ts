import MessageTransport from 'ringcentral-integration/lib/MessageTransport';
import ContactMatcher from 'ringcentral-integration/modules/ContactMatcher';
import ActivityMatcher from 'ringcentral-integration/modules/ActivityMatcher';

import messageTypes from '../../enums/messageTypes';

export interface State {
  service: any;
}

export interface ThirdPartyServiceOptions {

}

export interface Deps {
  contactMatcher: ContactMatcher;
  activityMatcher: ActivityMatcher;
  thirdPartyServiceOptions?: ThirdPartyServiceOptions;
}

export interface Interface extends State {
  transport: MessageTransport;
  messageTypes: typeof messageTypes;
}
