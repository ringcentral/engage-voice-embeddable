import {
  connectModule as baseConnectModule,
  connectModuleProps,
} from '@ringcentral-integration/widgets/lib/phoneContext';

import { Phone } from '../interfaces/Phone.type';

export const connectModule = (props: connectModuleProps<Phone>) =>
  baseConnectModule(props);
