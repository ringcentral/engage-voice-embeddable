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
  PortManager,
  delegate,
} from '@ringcentral-integration/next-core';
import { format, parse } from '@ringcentral-integration/phone-number';
import { sleep } from '@ringcentral-integration/commons/utils';
import { EventEmitter } from 'events';
import { equals } from 'ramda';

import type { LoginTypes } from '../../../enums';
import {
  agentSessionEvents,
  dialoutStatuses,
  dropDownOptions,
  loginTypes,
  messageTypes,
} from '../../../enums';
import type { EvAgentConfig } from '../EvClient/interfaces';
import { EvClient } from '../EvClient';
import { evStatus } from '../EvClient/enums';
import { EvAuth } from '../EvAuth';
import { EvPresence } from '../EvPresence';
import { Redirect } from '../Redirect';
import { MultiLoginView } from '../../views/MultiLoginView';
import type {
  EvAgentSessionOptions,
  FormGroup,
  LoginTypeItem,
  ConfigureAgentParams,
  DialGroup,
  EvConfigureAgentOptions,
} from './EvAgentSession.interface';
import i18n, { t } from './i18n';

const WAIT_EV_SERVER_ROLLBACK_DELAY = 2000;

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
  private _isLogin = false;

  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private evPresence: EvPresence,
    private redirect: Redirect,
    private auth: Auth,
    private toast: Toast,
    private locale: Locale,
    private block: BlockPlugin,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    private multiLoginView: MultiLoginView,
    @optional('EvAgentSessionOptions')
    private evAgentSessionOptions?: EvAgentSessionOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    // Login success event should be registered in constructor to capture event before onInitOnce
    this.evAuth.onceLoginSuccess(() => {
      this.logger.info('----------onLoginSuccess in EvAgentSession');
      this._isLogin = true;
    });
    // Logout event should be in constructor, when logout that will not call init
    this.evAuth.beforeAgentLogout(() => {
      this._resetAllState();
    });
    if (this.portManager?.shared) {
      this.portManager.onClient(() => {
        this._initialize();
      });
    } else {
      this._initialize();
    }
  }

  /**
   * Show multi-login confirmation modal and return user's choice
   * @returns true if user confirms, false if user cancels
   */
  private async _showMultiLoginConfirm(): Promise<boolean> {
    return this.multiLoginView.showConfirm();
  }

  private _initialize(): void {
    this._init();
    this.onConfigSuccess(() => {
      // Set dialout status to idle if no calls
      if (this.evPresence.calls.length === 0) {
        this.evPresence.setDialoutStatus(dialoutStatuses.idle);
      }
      if (this.isAgentUpdating) {
        this.isAgentUpdating = false;
      } else {
        this.logger.info('!!!!to Dialer');
        this.redirect.goToDialer();
      }
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

  /**
   * Initialize agent session on login success
   */
  private async _init(): Promise<void> {
    if (this._isLogin) {
      await this.initAgentSession();
    }
    // Watch login success state - must be after onInitOnce because storage may not be ready
    watch(
      this,
      () => this.isOnLoginSuccess,
      async (isOnLoginSuccess) => {
        if (isOnLoginSuccess) {
          this.logger.info('----------onLoginSuccess2');
          await this.initAgentSession();
        }
      },
    );
  }

  /**
   * Computed property to check if login is successful and module is ready
   */
  @computed((that: EvAgentSession) => [
    that.evAuth.isEvLogged,
    that.ready,
  ])
  get isOnLoginSuccess(): boolean {
    return this.ready && this.evAuth.isEvLogged;
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

  @computed((that: EvAgentSession) => [
    that.skillProfileList,
    that.formGroup,
  ])
  get selectedSkillProfile(): string | undefined {
    const selectedSkillProfile = this.skillProfileList.find(
      (profile) => profile.profileId === this.formGroup.selectedSkillProfileId,
    );
    return selectedSkillProfile?.profileName;
  }

  @computed((that: EvAgentSession) => [
    that.inboundQueues,
    that.formGroup,
  ])
  get selectedInboundQueues(): string[] {
    const results = (this.formGroup.selectedInboundQueueIds || []).map((id) => {
      return this.inboundQueues.find((queue) => queue.gateId === id);
    });
    return results.filter((result) => result).map((result) => result!.gateName);
  }

  @computed((that: EvAgentSession) => [
    that.selectedInboundQueueIds,
    that.selectedSkillProfileId,
    that.loginType,
    that.extensionNumber,
    that.autoAnswer,
    that.dialGroupId,
    that.formGroup,
  ])
  get isSessionChanged(): boolean {
    const sessionConfigs = {
      selectedInboundQueueIds: this.selectedInboundQueueIds,
      selectedSkillProfileId: this.selectedSkillProfileId,
      loginType: this.loginType,
      extensionNumber: this.extensionNumber,
      autoAnswer: this.autoAnswer,
      dialGroupId: this.dialGroupId,
    };
    return !equals(sessionConfigs, this.formGroup);
  }

  get defaultAutoAnswerOn(): boolean {
    return this.evAuth.agentPermissions?.defaultAutoAnswerOn || false;
  }

  get notInboundQueueSelected(): boolean {
    return (
      !this.evAuth.agentPermissions?.allowInbound ||
      (this.formGroup.selectedInboundQueueIds || []).length === 0
    );
  }

  @action
  _resetAllConfig() {
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

  @delegate('server')
  async resetAllConfig(): Promise<void> {
    this._resetAllConfig();
  }

  @action
  _setDialGroupId(groupId: string) {
    this.dialGroupId = groupId;
  }

  @delegate('server')
  async setDialGroupId(groupId: string): Promise<void> {
    this._setDialGroupId(groupId);
  }

  @action
  _setAccessToken(token: string) {
    this.accessToken = token;
  }

  @delegate('server')
  async setAccessToken(token: string): Promise<void> {
    this._setAccessToken(token);
  }

  @action
  _setConfigSuccess(status: boolean) {
    this.logger.info('setConfigSuccess~', status);
    this.configSuccess = status;
    this.configured = status;
  }

  @delegate('server')
  async setConfigSuccess(status: boolean): Promise<void> {
    this._setConfigSuccess(status);
  }

  @action
  _setLoginType(type: LoginTypes) {
    this.loginType = type;
  }

  @delegate('server')
  async setLoginType(type: LoginTypes): Promise<void> {
    this._setLoginType(type);
  }

  @action
  _setSkillProfileId(skillProfileId: string) {
    this.selectedSkillProfileId = skillProfileId;
  }

  @delegate('server')
  async setSkillProfileId(skillProfileId: string): Promise<void> {
    this._setSkillProfileId(skillProfileId);
  }

  @action
  _setInboundQueueIds(ids: string[]) {
    this.selectedInboundQueueIds = ids;
  }

  @delegate('server')
  async setInboundQueueIds(ids: string[]): Promise<void> {
    this._setInboundQueueIds(ids);
  }

  @action
  _setExtensionNumber(extensionNumber: string) {
    this.extensionNumber = extensionNumber;
  }

  @delegate('server')
  async setExtensionNumber(extensionNumber: string): Promise<void> {
    this._setExtensionNumber(extensionNumber);
  }

  @action
  _setTakingCall(takingCall: boolean) {
    this.takingCall = takingCall;
  }

  @delegate('server')
  async setTakingCall(takingCall: boolean): Promise<void> {
    this._setTakingCall(takingCall);
  }

  @action
  _setAutoAnswer(autoAnswer: boolean) {
    this.autoAnswer = autoAnswer;
  }

  @delegate('server')
  async setAutoAnswer(autoAnswer: boolean): Promise<void> {
    this._setAutoAnswer(autoAnswer);
  }

  @action
  _setFormGroup(data: FormGroup) {
    this.formGroup = { ...this.formGroup, ...data };
  }

  @delegate('server')
  async setFormGroup(data: FormGroup): Promise<void> {
    this._setFormGroup(data);
  }

  @action
  _assignFormGroupValue() {
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

  @delegate('server')
  async assignFormGroupValue(): Promise<void> {
    this._assignFormGroupValue();
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

  @delegate('server')
  async setFreshConfig(): Promise<void> {
    this._setFreshConfig();
  }

  @delegate('server')
  async resetFormGroup(): Promise<void> {
    await this.setFormGroup({
      selectedInboundQueueIds: this.selectedInboundQueueIds,
      selectedSkillProfileId: this.selectedSkillProfileId,
      loginType: this.loginType,
      extensionNumber: this.extensionNumber,
      autoAnswer: this.autoAnswer,
      dialGroupId: this.dialGroupId,
    });
  }

  private async _resetAllState(): Promise<void> {
    this.logger.info('_resetAllState~~', this.isMainTab);
    if (!this.isAgentUpdating) {
      await this.resetAllConfig();
    }
    this._clearCalls();
  }

  /**
   * Clear calls from presence (safe method that checks if presence exists)
   */
  private _clearCalls(): void {
    this.evPresence?.clearCalls();
  }

  private _pickSkillProfile(skillProfileList: any[]) {
    return skillProfileList.find((item) => item.isDefault === '1');
  }

  /**
   * Configure agent session
   */
  async configureAgent({
    config = this._checkFieldsResult(this.formGroup),
    triggerEvent = true,
    needAssignFormGroupValue = false,
  }: ConfigureAgentParams = {}): Promise<void> {
    this.logger.info('configureAgent~~', triggerEvent);
    this._clearCalls();
    const connectResult = await this._connectEvServer(config);
    let result = connectResult.result;
    const existingLoginFound = connectResult.existingLoginFound;
    // Session timeout - this will occur when stay in session config page for long time
    if (result.data.status !== 'SUCCESS') {
      this._navigateToSessionConfigPage();
      await this.evAuth.newReconnect(false);
      if (existingLoginFound) {
        config.isForce = true;
      }
      result = (await this._connectEvServer(config)).result;
    }
    await this._handleAgentResult({ config: result.data, needAssignFormGroupValue });
    if (triggerEvent) {
      this._emitTriggerConfig();
      await this.setConfigSuccess(true);
    }
  }

  /**
   * Update agent configs from server
   */
  async updateAgentConfigs(): Promise<void> {
    const agentConfig = await this.evClient.getAgentConfig();
    const agent = {
      ...this.evAuth.agent,
      agentConfig,
    };
    await this.evAuth.setAgent(agent);
    await this.setConfigSuccess(true);
  }

  /**
   * Update agent session settings
   */
  async updateAgent(voiceConnectionChanged: boolean): Promise<void> {
    try {
      await this.block.next(async () => {
        const config = this._checkFieldsResult(this.formGroup);
        this._clearCalls();
        this.isAgentUpdating = true;
        const extensionNumberChanged =
          this.extensionNumber !== this.formGroup.extensionNumber;
        if (voiceConnectionChanged || extensionNumberChanged) {
          await this.reLoginAgent();
        }
        config.isForce = true;
        const { result } = await this._connectEvServer(config);
        await this._handleAgentResult({
          config: result.data,
          isAgentUpdating: true,
          needAssignFormGroupValue: true,
        });
        if (voiceConnectionChanged) {
          this._emitTriggerConfig();
        }
        await this.updateAgentConfigs();
        this.goToSettingsPage();
        this._showUpdateSuccessAlert();
      });
    } catch (error) {
      this.logger.error('updateAgent error', error);
      throw error;
    }
  }

  /**
   * Re-login agent with optional alert message
   */
  async reLoginAgent({
    isBlock,
    alertMessage,
  }: {
    isBlock?: boolean;
    alertMessage?: string;
  } = {}): Promise<void> {
    const fn = async () => {
      if (alertMessage) {
        this.toast.danger({ message: alertMessage, ttl: 0 });
      }
      const { access_token } = await this.auth.refreshToken();
      await this.setAccessToken(access_token);
      await this.evAuth.logoutAgent();
      // Wait for server to finish logout
      await sleep(WAIT_EV_SERVER_ROLLBACK_DELAY);
      await this.evAuth.loginAgent(this.accessToken);
    };
    return isBlock ? this.block.next(fn) : fn();
  }

  /**
   * Logout then login again after logout event
   */
  onceLogoutThenLogin(): Promise<Promise<void>> {
    return new Promise<Promise<void>>((resolve) => {
      this.evAuth.onceLogout(async () => {
        await sleep(WAIT_EV_SERVER_ROLLBACK_DELAY);
        resolve(this.evAuth.loginAgent(this.accessToken));
      });
    });
  }

  private _showUpdateSuccessAlert(): void {
    this.toast.success({
      message: t(messageTypes.UPDATE_AGENT_SUCCESS),
    });
  }

  private _checkFieldsResult(formGroup: FormGroup): EvConfigureAgentOptions {
    const { selectedInboundQueueIds = [], selectedSkillProfileId } = formGroup;
    if (this.notInboundQueueSelected) {
      this.toast.danger({
        message: t(messageTypes.NOT_INBOUND_QUEUE_SELECTED),
        ttl: 0,
      });
      throw new Error(`'queueIds' is an empty array.`);
    }
    const dialDest = this._getDialDest(formGroup);
    return {
      dialDest,
      queueIds: selectedInboundQueueIds,
      skillProfileId:
        selectedSkillProfileId === NONE ? '' : selectedSkillProfileId || '',
      dialGroupId: formGroup.dialGroupId || '',
    };
  }

  private _getDialDest(formGroup: FormGroup): string {
    const { loginType, extensionNumber } = formGroup;
    switch (loginType) {
      case loginTypes.externalPhone: {
        if (!extensionNumber) {
          this.toast.danger({
            message: t(messageTypes.EMPTY_PHONE_NUMBER),
            ttl: 0,
          });
          throw new Error(`'extensionNumber' is an empty number.`);
        }
        const formatPhoneNumber = format({
          phoneNumber: extensionNumber,
        });
        const { parsedNumber, isValid } = parse({
          input: formatPhoneNumber,
        });
        if (!isValid || !parsedNumber || parsedNumber === '') {
          this.toast.danger({
            message: t(messageTypes.INVALID_PHONE_NUMBER),
            ttl: 0,
          });
          throw new Error(`'extensionNumber' is not a valid number.`);
        }
        this.setFormGroup({ extensionNumber: parsedNumber });
        return extensionNumber;
      }
      case loginTypes.integratedSoftphone:
        return 'integrated';
      case loginTypes.RC_PHONE:
      default:
        return 'RC_PHONE';
    }
  }

  private async _handleAgentResult({
    config: { message, status },
    isAgentUpdating,
    needAssignFormGroupValue,
  }: {
    config: EvAgentConfig;
    isAgentUpdating?: boolean;
    needAssignFormGroupValue?: boolean;
  }): Promise<void> {
    if (status !== 'SUCCESS') {
      if (typeof message === 'string') {
        this.toast.danger({ message, ttl: 0 });
      } else {
        this.toast.danger({
          message: t(
            isAgentUpdating
              ? messageTypes.UPDATE_AGENT_ERROR
              : messageTypes.AGENT_CONFIG_ERROR,
          ),
          ttl: 0,
        });
      }
      throw new Error(message);
    }
    if (needAssignFormGroupValue) {
      await this.assignFormGroupValue();
    }
  }

  private async _connectEvServer(
    config: EvConfigureAgentOptions,
  ): Promise<{ result: { data: EvAgentConfig }; existingLoginFound: boolean }> {
    let result = await this.evClient.configureAgent(config);
    const { status } = result.data;
    const existingLoginFound = status === messageTypes.EXISTING_LOGIN_FOUND;
    if (existingLoginFound) {
      // Show confirmation modal to user
      const confirmed = await this._showMultiLoginConfirm();
      if (!confirmed) {
        this.isForceLogin = false;
        throw new Error(status);
      }
      // If EV client connection was closed, need to re-login first
      if (this.evClient.appStatus === evStatus.CLOSED) {
        await this.evAuth.loginAgent();
      }
      // Retry with isForce flag after user confirms
      result = await this.evClient.configureAgent({
        ...config,
        isForce: true,
      });
      this.isForceLogin = true;
    } else if (status === messageTypes.EXISTING_LOGIN_ENGAGED) {
      this.toast.danger({
        message: t(messageTypes.EXISTING_LOGIN_ENGAGED),
        ttl: 0,
      });
      throw new Error(messageTypes.EXISTING_LOGIN_ENGAGED);
    }
    return { result, existingLoginFound };
  }

  private _emitTriggerConfig() {
    this._eventEmitter.emit(agentSessionEvents.TRIGGER_CONFIG);
  }

  private _emitConfigSuccess() {
    this._eventEmitter.emit(agentSessionEvents.CONFIG_SUCCESS);
  }

  private _emitReConfigFail() {
    this._eventEmitter.emit(agentSessionEvents.RECONFIG_FAIL);
  }

  onTriggerConfig(callback: () => void): this {
    this._eventEmitter.on(agentSessionEvents.TRIGGER_CONFIG, callback);
    return this;
  }

  onConfigSuccess(callback: () => void): this {
    this._eventEmitter.on(agentSessionEvents.CONFIG_SUCCESS, callback);
    return this;
  }

  onReConfigFail(callback: () => void): this {
    this._eventEmitter.on(agentSessionEvents.RECONFIG_FAIL, callback);
    return this;
  }

  /**
   * Initialize agent session (public method for manual initialization)
   */
  async initAgentSession(): Promise<void> {
    await this.block.next(async () => {
      await this._initAgentSession();
    });
  }

  async shouldAutoConfigureAgent(): Promise<boolean> {
    if (this.auth.isFreshLogin) {
      return false;
    }
    if (!this.configured) {
      return false;
    }
    const multipleTabs = await this.hasMultipleTabs();
    if (!multipleTabs) {
      return true;
    }
    return false;
  }

  /**
   * Internal agent session initialization logic
   */
  private async _initAgentSession(): Promise<void> {
    this.logger.info('_initAgentSession~', this.isAgentUpdating);
    if (this.isAgentUpdating) {
      return;
    }
    // Validate stored selections against current agent config
    await this._afterLogin();
    this.logger.info('autoconfig~', !this.auth.isFreshLogin, this.configured);
    // If not fresh login and already configured (and not multi-tab), auto-configure
    const shouldAutoConfigure = await this.shouldAutoConfigureAgent();
    if (shouldAutoConfigure) {
      try {
        await this._autoConfigureAgent();
        return;
      } catch (e) {
        this.logger.error('Auto configure failed', e);
      }
    }
    // TODO: handle multiple tabs
    // Otherwise set fresh config and navigate to session config page
    this._clearCalls();
    await this.setFreshConfig();
    await this.resetFormGroup();
    this._navigateToSessionConfigPage();
  }

  /**
   * Validate stored selections against current agent config after re-login
   */
  private async _afterLogin(): void {
    // If not fresh login, validate stored config against current config
    if (!this.auth.isFreshLogin) {
      // Check if selected skill profile is still in the list
      const checkSelectIsInList = this.skillProfileList.some(
        (profile) => profile.profileId === this.selectedSkillProfileId,
      );
      if (!checkSelectIsInList) {
        await this.setSkillProfileId(this.defaultSkillProfileId);
      }
      // Check all selected queues are in inbound queue list
      const checkedInboundQueues = this.selectedInboundQueueIds.reduce<string[]>(
        (result, inboundQueueId) => {
          if (
            this.inboundQueues.some(
              (inboundQueue) => inboundQueue.gateId === inboundQueueId,
            )
          ) {
            result.push(inboundQueueId);
          }
          return result;
        },
        [],
      );
      await this.setInboundQueueIds(checkedInboundQueues);
    }
  }

  /**
   * Auto configure agent with stored settings
   */
  private async _autoConfigureAgent(): Promise<void> {
    this.logger.info('_autoConfigureAgent~');
    const config = await this._checkFieldsResult({
      selectedInboundQueueIds: this.selectedInboundQueueIds,
      selectedSkillProfileId: this.selectedSkillProfileId,
      loginType: this.loginType,
      extensionNumber: this.extensionNumber,
      autoAnswer: this.autoAnswer,
      dialGroupId: this.dialGroupId,
    });
    return this.configureAgent({ config });
  }

  /**
   * Navigate to session config page
   */
  private _navigateToSessionConfigPage(): void {
    this.redirect.goToSessionConfig();
    this.logger.info('to sessionConfig~~');
  }

  /**
   * Check if main tab is alive (for multi-tab support)
   */
  async checkIsMainTabAlive(): Promise<boolean> {
    if (this.portManager?.shared) {
      // In shared mode, defer to port manager
      return true;
    }
    return true;
  }

  /**
   * Navigate to settings page
   */
  goToSettingsPage(): void {
    this.redirect.push('/settings');
  }

  /**
   * Check if this tab is the main tab
   */
  get isMainTab(): boolean {
    if (this.portManager?.shared) {
      return this.portManager.isServer;
    }
    return true;
  }

  /**
   * Check if tab manager is enabled
   */
  get tabManagerEnabled(): boolean {
    return !!this.portManager?.shared;
  }

  @delegate('server')
  async hasMultipleTabs(): Promise<boolean> {
    if (!this.portManager?.shared) {
      return false;
    }
    return this.portManager?.portDetector?.clientIds?.length > 1;
  }

  /**
   * Check if browser should be blocked on unload
   */
  get shouldBlockBrowser(): boolean {
    return !this.isIntegratedSoftphone;
  }
}

export { EvAgentSession };
