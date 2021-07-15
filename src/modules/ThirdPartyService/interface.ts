import MessageTransport from '@ringcentral-integration/commons/lib/MessageTransport';
import ContactMatcher from '@ringcentral-integration/commons/modules/ContactMatcher';
import ActivityMatcher from '@ringcentral-integration/commons/modules/ActivityMatcher';

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
