import type { LoginTypes } from '../../../enums';

/**
 * EvAgentSession options for configuration
 */
export interface EvAgentSessionOptions {
  fromPopup?: boolean;
}

/**
 * Form group state for session configuration
 */
export interface FormGroup {
  selectedInboundQueueIds?: string[];
  loginType?: LoginTypes;
  selectedSkillProfileId?: string;
  extensionNumber?: string;
  autoAnswer?: boolean;
  dialGroupId?: string;
}

/**
 * Login type item for dropdown
 */
export interface LoginTypeItem {
  id: LoginTypes;
  label: string;
}

/**
 * Configure agent options for EV server
 */
export interface EvConfigureAgentOptions {
  dialDest: string;
  queueIds: string[];
  skillProfileId: string;
  dialGroupId?: string;
  isForce?: boolean;
}

/**
 * Configure agent parameters
 */
export interface ConfigureAgentParams {
  config?: EvConfigureAgentOptions;
  triggerEvent?: boolean;
  needAssignFormGroupValue?: boolean;
}

/**
 * Dial group item
 */
export interface DialGroup {
  groupId: string;
  groupName: string;
  dialMode: string;
  groupDesc?: string;
}
