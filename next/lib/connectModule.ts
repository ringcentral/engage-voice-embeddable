import type { EvPhone } from '../interfaces';

/**
 * Connect module props interface - local definition
 */
export interface ConnectModuleProps<P> {
  phone: P;
  getUIProps?: (props: { phone: P }) => Record<string, any>;
  getUIFunctions?: (props: { phone: P }) => Record<string, any>;
}

/**
 * Connect module utility - simplified local implementation
 * @deprecated This is a legacy utility for connecting modules
 */
export const connectModule = <T = any>(props: ConnectModuleProps<EvPhone>) => {
  const { phone, getUIProps, getUIFunctions } = props;
  return {
    ...getUIProps?.({ phone }),
    ...getUIFunctions?.({ phone }),
  } as T;
};
