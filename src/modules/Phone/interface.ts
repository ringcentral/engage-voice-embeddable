import { EvPhone } from '@ringcentral-integration/engage-voice-widgets/interfaces';
import ContactMatcher from 'ringcentral-integration/modules/ContactMatcher';

import { Adapter } from '../Adapter';
import { ThirdPartyService } from '../ThirdPartyService';
import { EvActivityCallUI } from '../EvActivityCallUI';
import { Environment } from '../Environment';

export type GenericPhone = EvPhone & {
  adapter: Adapter;
  thirdPartyService: ThirdPartyService;
  evActivityCallUI: EvActivityCallUI;
  environment: Environment;
  contactMatcher: ContactMatcher;
  appConfig: { name: string; version: string; buildHash: string };
};
