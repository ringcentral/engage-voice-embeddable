import { Auth } from '@ringcentral-integration/micro-auth/src/app/services';
import { Locale, Toast } from '@ringcentral-integration/micro-core/src/app/services';
import { BlockPlugin } from '@ringcentral-integration/micro-core/src/app/plugins';
import {
  action,
  computed,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
  watch,
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';

import type { LoginTypes } from '../../../enums';
import {
  agentSessionEvents,
  dropDownOptions,
  loginTypes,
} from '../../../enums';
import type { EvConfigureAgentOptions } from '../EvClient/interfaces';
import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import type {
  EvAgentSessionOptions,
  FormGroup,
  LoginTypeItem,
  ConfigureAgentParams,
  DialGroup,
} from './EvAgentSession.interface';
import i18n from './i18n';

const ACCEPTABLE_LOGIN_TYPES = [
  loginTypes.integratedSoftphone,
  loginTypes.RC_PHONE,
  loginTypes.externalPhone,
];

const DEFAULT_LOGIN_TYPE = loginTypes.integratedSoftphone;
const NONE = dropDownOptions.None;

const DEFAULT_FORM_GROUP: FormGroup = {
  selectedInboundQueueIds: [],
  loginType: DEFAULT_LOGIN_TYPE,
  selectedSkillProfileId: NONE,
  extensionNumber: '',
  autoAnswer: false,
  dialGroupId: '',
};

/**
 * EvAgentSession module - Agent session configuration management
 * Handles login types, inbound queues, skill profiles, and session updates
 */
@injectable({
  name: 'EvAgentSession',
})
class EvAgentSession extends RcModule {
  public isForceLogin = false;
  public isReconnected = false;
  public isAgentUpdating = false;

  private _eventEmitter = new EventEmitter();

  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private auth: Auth,
    private toast: Toast,
    private locale: Locale,
    private block: BlockPlugin,
    private storagePlugin: StoragePlugin,
    @optional('EvAgentSessionOptions')
    private evAgentSessionOptions?: EvAgentSessionOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    this.evAuth.onceLoginSuccess(() => {
      console.log('----------onLoginSuccess in EvAgentSession');
    });
    this.evAuth.beforeAgentLogout(() => {
      this._resetAllState();
    });
    watch(
      this,
      () => this.configSuccess,
      (configSuccess) => {
        if (configSuccess) {
          this._emitConfigSuccess();
        }
      },
    );
  }

  @storage
  @state
  selectedSkillProfileId: string = NONE;

  @storage
  @state
  selectedInboundQueueIds: string[] = [];

  @storage
  @state
  loginType: LoginTypes = DEFAULT_LOGIN_TYPE;

  @storage
  @state
  extensionNumber = '';

  @storage
  @state
  takingCall = true;

  @storage
  @state
  autoAnswer = false;

  @storage
  @state
  dialGroupId = '';

  @storage
  @state
  configured = false;

  @state
  configSuccess = false;

  @storage
  @state
  formGroup: FormGroup = DEFAULT_FORM_GROUP;

  @storage
  @state
  accessToken = '';

  get isExternalPhone(): boolean {
    return this.formGroup.loginType === loginTypes.externalPhone;
  }

  get isIntegratedSoftphone(): boolean {
    return this.loginType === loginTypes.integratedSoftphone;
  }

  @computed((that: EvAgentSession) => [that.locale.currentLocale])
  get loginTypeList(): LoginTypeItem[] {
    const { currentLocale } = this.locale;
    return ACCEPTABLE_LOGIN_TYPES.map((type) => ({
      id: type,
      label: i18n.getString(type, currentLocale),
    }));
  }

  @computed((that: EvAgentSession) => [
    that.evAuth.agentConfig,
    that.auth.isFreshLogin,
  ])
  get inboundQueues() {
    const { agentConfig, agentPermissions } = this.evAuth;
    if (
      !agentConfig ||
      !agentConfig?.inboundSettings ||
      !agentPermissions?.allowInbound
    ) {
      return [];
    }
    const {
      inboundSettings: { availableQueues = [] },
    } = agentConfig;
    const { isFreshLogin } = this.auth;
    return availableQueues.map((queue) => ({
      gateId: queue.gateId,
      gateName: queue.gateName,
      checked: isFreshLogin,
    }));
  }

  @computed((that: EvAgentSession) => [that.evAuth.agentConfig])
  get dialGroups(): DialGroup[] {
    const { agentConfig, agentPermissions } = this.evAuth;
    const noneItem: DialGroup = {
      groupId: '',
      groupName: 'None',
      dialMode: '',
    };
    if (
      !agentConfig ||
      !agentConfig?.outboundSettings ||
      !agentPermissions?.allowOutbound
    ) {
      return [noneItem];
    }
    const {
      outboundSettings: { availableOutdialGroups = [] },
    } = agentConfig;
    return [noneItem].concat(
      availableOutdialGroups
        .filter((g: any) => g.dialMode === 'PREDICTIVE' || g.dialMode === 'PREVIEW')
        .map((group: any) => ({
          groupId: group.dialGroupId,
          groupName: group.dialGroupName,
          groupDesc: group.dialGroupDesc,
          dialMode: group.dialMode,
        })),
    );
  }

  @computed((that: EvAgentSession) => [that.dialGroupId, that.dialGroups])
  get currentDialMode(): string {
    if (!this.dialGroupId) {
      return '';
    }
    const group = this.dialGroups.find((g) => g.groupId === this.dialGroupId);
    return group?.dialMode || '';
  }

  @computed((that: EvAgentSession) => [that.evAuth.agentConfig])
  get defaultDialGroupId(): string {
    const { agentConfig } = this.evAuth;
    if (!agentConfig || !agentConfig.outboundSettings) {
      return '';
    }
    return agentConfig.outboundSettings.defaultDialGroup || '';
  }

  @computed((that: EvAgentSession) => [that.evAuth.agent, that.locale.currentLocale])
  get skillProfileList() {
    const { agentConfig } = this.evAuth.agent || {};
    if (!agentConfig || !agentConfig.inboundSettings) {
      return [];
    }
    const {
      inboundSettings: { availableSkillProfiles = [] },
    } = agentConfig;
    const defaultSkill = this._pickSkillProfile(availableSkillProfiles);
    if (!defaultSkill && availableSkillProfiles.length > 0) {
      return [
        {
          profileId: NONE,
          profileName: i18n.getString(NONE, this.locale.currentLocale),
        },
        ...availableSkillProfiles,
      ];
    }
    return availableSkillProfiles;
  }

  @computed((that: EvAgentSession) => [that.skillProfileList])
  get defaultSkillProfileId(): string {
    const defaultSkill = this._pickSkillProfile(this.skillProfileList);
    return defaultSkill ? defaultSkill.profileId : NONE;
  }

  get defaultAutoAnswerOn(): boolean {
    return this.evAuth.agentPermissions?.defaultAutoAnswerOn || false;
  }

  @action
  resetAllConfig() {
    this.selectedInboundQueueIds = [];
    this.selectedSkillProfileId = NONE;
    this.loginType = DEFAULT_LOGIN_TYPE;
    this.extensionNumber = '';
    this.takingCall = true;
    this.autoAnswer = false;
    this.configSuccess = false;
    this.configured = false;
    this.dialGroupId = this.defaultDialGroupId;
  }

  @action
  setDialGroupId(groupId: string) {
    this.dialGroupId = groupId;
  }

  @action
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  @action
  setConfigSuccess(status: boolean) {
    console.log('setConfigSuccess~', status);
    this.configSuccess = status;
    this.configured = status;
  }

  @action
  setLoginType(type: LoginTypes) {
    this.loginType = type;
  }

  @action
  setSkillProfileId(skillProfileId: string) {
    this.selectedSkillProfileId = skillProfileId;
  }

  @action
  setInboundQueueIds(ids: string[]) {
    this.selectedInboundQueueIds = ids;
  }

  @action
  setExtensionNumber(extensionNumber: string) {
    this.extensionNumber = extensionNumber;
  }

  @action
  setTakingCall(takingCall: boolean) {
    this.takingCall = takingCall;
  }

  @action
  setAutoAnswer(autoAnswer: boolean) {
    this.autoAnswer = autoAnswer;
  }

  @action
  setFormGroup(data: FormGroup) {
    this.formGroup = { ...this.formGroup, ...data };
  }

  @action
  assignFormGroupValue() {
    const {
      selectedInboundQueueIds,
      extensionNumber,
      loginType,
      selectedSkillProfileId,
      autoAnswer,
      dialGroupId,
    } = this.formGroup;
    if (selectedInboundQueueIds) {
      this.selectedInboundQueueIds = selectedInboundQueueIds;
    }
    if (extensionNumber !== undefined) {
      this.extensionNumber = extensionNumber;
    }
    if (loginType) {
      this.loginType = loginType;
    }
    if (selectedSkillProfileId) {
      this.selectedSkillProfileId = selectedSkillProfileId;
    }
    if (autoAnswer !== undefined) {
      this.autoAnswer = autoAnswer;
    }
    if (dialGroupId !== undefined) {
      this.dialGroupId = dialGroupId;
    }
  }

  @action
  private _setFreshConfig() {
    this.loginType = DEFAULT_LOGIN_TYPE;
    this.extensionNumber = '';
    this.takingCall = true;
    this.autoAnswer = this.defaultAutoAnswerOn;
    this.configSuccess = false;
    this.configured = false;
    this.selectedSkillProfileId = this.defaultSkillProfileId;
    this.dialGroupId = this.defaultDialGroupId;
    if (this.evAuth.agentPermissions?.allowInbound) {
      this.selectedInboundQueueIds = this.inboundQueues.map(
        (inboundQueue) => inboundQueue.gateId,
      );
    }
  }

  setFreshConfig() {
    this._setFreshConfig();
  }

  resetFormGroup() {
    this.setFormGroup({
      selectedInboundQueueIds: this.selectedInboundQueueIds,
      selectedSkillProfileId: this.selectedSkillProfileId,
      loginType: this.loginType,
      extensionNumber: this.extensionNumber,
      autoAnswer: this.autoAnswer,
      dialGroupId: this.dialGroupId,
    });
  }

  private _resetAllState() {
    console.log('_resetAllState~~');
    if (!this.isAgentUpdating) {
      this.resetAllConfig();
    }
    this.setConfigSuccess(false);
    this.isReconnected = false;
  }

  private _pickSkillProfile(skillProfileList: any[]) {
    return skillProfileList.find((item) => item.isDefault === '1');
  }

  /**
   * Configure agent session
   */
  async configureAgent({
    triggerEvent = true,
    needAssignFormGroupValue = false,
  }: ConfigureAgentParams = {}): Promise<void> {
    console.log('configureAgent~~', triggerEvent);
    const config = this._checkFieldsResult(this.formGroup);
    const result = await this.evClient.configureAgent(config);
    if (result.data.status !== 'SUCCESS') {
      throw new Error(result.data.message || 'Configuration failed');
    }
    if (needAssignFormGroupValue) {
      this.assignFormGroupValue();
    }
    if (triggerEvent) {
      this._emitTriggerConfig();
      this.setConfigSuccess(true);
    }
  }

  private _checkFieldsResult(formGroup: FormGroup): EvConfigureAgentOptions {
    const { selectedInboundQueueIds = [], selectedSkillProfileId } = formGroup;
    return {
      dialDest: this._getDialDest(formGroup),
      queueIds: selectedInboundQueueIds,
      skillProfileId:
        selectedSkillProfileId === NONE ? '' : selectedSkillProfileId || '',
    };
  }

  private _getDialDest(formGroup: FormGroup): string {
    const { loginType, extensionNumber } = formGroup;
    switch (loginType) {
      case loginTypes.externalPhone:
        return extensionNumber || '';
      case loginTypes.integratedSoftphone:
        return 'integrated';
      case loginTypes.RC_PHONE:
      default:
        return 'RC_PHONE';
    }
  }

  private _emitTriggerConfig() {
    this._eventEmitter.emit(agentSessionEvents.TRIGGER_CONFIG);
  }

  private _emitConfigSuccess() {
    this._eventEmitter.emit(agentSessionEvents.CONFIG_SUCCESS);
  }

  onTriggerConfig(callback: () => void): this {
    this._eventEmitter.on(agentSessionEvents.TRIGGER_CONFIG, callback);
    return this;
  }

  onConfigSuccess(callback: () => void): this {
    this._eventEmitter.on(agentSessionEvents.CONFIG_SUCCESS, callback);
    return this;
  }
}

export { EvAgentSession };
