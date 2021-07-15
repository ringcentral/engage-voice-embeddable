import Storage from '@ringcentral-integration/commons/modules/Storage';
import ContactMatcher from '@ringcentral-integration/commons/modules/ContactMatcher';
import { ThirdPartyService } from '../ThirdPartyService';

export interface Deps {
  contactMatcher: ContactMatcher;
  thirdPartyService: ThirdPartyService;
  storage: Storage;
  appConfig: any;
}

export interface State {}
