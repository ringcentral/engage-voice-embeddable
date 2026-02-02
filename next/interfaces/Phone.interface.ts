import type { RcModulePhoneType } from '@ringcentral-integration/core';

/**
 * Base phone interface - local definition
 */
export interface BasePhone {
  [key: string]: any;
}

/**
 * Login UI interface - local definition
 */
export interface LoginUI {
  [key: string]: any;
}

import type { EvClient } from '../app/services/EvClient';
import type { EvActiveCallControl } from '../app/services/EvActiveCallControl';
import type { EvAgentScript } from '../app/services/EvAgentScript';
import type { EvAgentSession } from '../app/services/EvAgentSession';
import type { EvAuth } from '../app/services/EvAuth';
import type { EvCall } from '../app/services/EvCall';
import type { EvCallMonitor } from '../app/services/EvCallMonitor';
import type { EvIntegratedSoftphone } from '../app/services/EvIntegratedSoftphone';
import type { EvPresence } from '../app/services/EvPresence';
import type { EvRequeueCall } from '../app/services/EvRequeueCall';
import type { EvSettings } from '../app/services/EvSettings';
import type { EvSubscription } from '../app/services/EvSubscription';
import type { EvTabManager } from '../app/services/EvTabManager';
import type { EvTransferCall } from '../app/services/EvTransferCall';
import type { EvWorkingState } from '../app/services/EvWorkingState';

// TODO: UI modules need to be migrated to app/views
import type { EvActiveCallListUI } from '../modules/EvActiveCallListUI';
import type { EvActivityCallUI } from '../modules/EvActivityCallUI';
import type { EvAgentSessionUI } from '../modules/EvAgentSessionUI';
import type { EvChooseAccountUI } from '../modules/EvChooseAccountUI';
import type { EvDialerUI } from '../modules/EvDialerUI';
import type { EvManualDialSettingsUI } from '../modules/EvManualDialSettingsUI';
import type { EvSettingsUI } from '../modules/EvSettingsUI';
import type { EvTransferCallUI } from '../modules/EvTransferCallUI';
import type { MainViewUI } from '../modules/MainViewUI';

// TODO: separated UI and normal module that should just pick getUIProps, getUIFunctions in test environment.
export type EvPhoneUI = {
  LoginUI: LoginUI;
  mainViewUI: MainViewUI;
  evAgentSessionUI: EvAgentSessionUI;
  evActivityCallUI: EvActivityCallUI;
  evDialerUI: EvDialerUI;
  evTransferCallUI: EvTransferCallUI;
  evActiveCallListUI: EvActiveCallListUI;
  evSettingsUI: EvSettingsUI;
  evManualDialSettingsUI: EvManualDialSettingsUI;
  evChooseAccountUI: EvChooseAccountUI;
};

export type EvPhone = RcModulePhoneType<
  {
    activeCallControl: EvActiveCallControl;
    evAuth: EvAuth;
    evCall: EvCall;
    evCallMonitor: EvCallMonitor;
    evAgentSession: EvAgentSession;
    evSettings: EvSettings;
    evSubscription: EvSubscription;
    evWorkingState: EvWorkingState;
    evRequeueCall: EvRequeueCall;
    evTransferCall: EvTransferCall;
    presence: EvPresence;
    evClient: EvClient;
    evIntegratedSoftphone: EvIntegratedSoftphone;
    evAgentScript: EvAgentScript;
    tabManager: EvTabManager;
  } & EvPhoneUI
> &
  BasePhone;

export type DispatchPhone<T = [{ [key: string]: any }]> = {
  phone: EvPhone;
} & T;
