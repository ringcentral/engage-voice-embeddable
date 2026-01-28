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
 * Configure agent parameters
 */
export interface ConfigureAgentParams {
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
