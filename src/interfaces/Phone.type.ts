import { RcModulePhoneType } from 'foundation-module/lib';

import { EvPhone } from '@ringcentral-integration/engage-voice-widgets/interfaces';

import { CallDispositionUI } from '../modules/CallDispositionUI';
import { CallDisposition } from '../modules/CallDisposition';
import { SalesforceService } from '../modules/SalesforceService';
import { Adapter } from '../modules/Adapter';

export type Phone = RcModulePhoneType<
  {
    SalesforceService: SalesforceService;
    callDispositionUI: CallDispositionUI;
    callDisposition: CallDisposition;
    salesforceService: SalesforceService;
    adapter: Adapter;
  } & EvPhone
>;
