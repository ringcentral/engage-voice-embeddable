import {
  connectModule as baseConnectModule,
  connectModuleProps,
} from 'ringcentral-widgets/lib/phoneContext';

import { Phone } from '../interfaces/Phone.type';

export const connectModule = (props: connectModuleProps<Phone>) =>
  baseConnectModule(props);
