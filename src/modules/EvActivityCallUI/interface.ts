import Storage from 'ringcentral-integration/modules/Storage';
import ContactMatcher from 'ringcentral-integration/modules/ContactMatcher';
import { ThirdPartyService } from '../ThirdPartyService';

export interface Deps {
  contactMatcher: ContactMatcher;
  thirdPartyService: ThirdPartyService;
  storage: Storage;
  appConfig: any;
}

export interface State {}
