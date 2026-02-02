import {
  action,
  computed,
  injectable,
  optional,
  RcViewModule,
  state,
  useConnector,
  UIFunctions,
  UIProps,
} from '@ringcentral-integration/next-core';
import { Brand, Locale } from '@ringcentral-integration/micro-core/src/app/services';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { Button, Switch, Icon } from '@ringcentral/spring-ui';
import { ArrowLeftMd, CaretDownMd } from '@ringcentral/spring-icon';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import type { LoginTypes } from '../../../enums';
import { loginTypes } from '../../../enums';
import { EvAgentSession } from '../../services/EvAgentSession';
import { EvAuth } from '../../services/EvAuth';
import type { EvAgent } from '../../services/EvClient/interfaces';
import type {
  SessionConfigViewOptions,
  SessionConfigViewProps,
  SessionConfigViewUIProps,
  SessionConfigViewUIFunctions,
} from './SessionConfigView.interface';
import i18n from './i18n';
import { InboundQueuesPanel } from './InboundQueuesPanel';

/**
 * SessionConfigView - Session configuration view for agent setup
 * Handles login type, inbound queues, skill profile, and auto-answer settings
 */
@injectable({
  name: 'SessionConfigView',
})
class SessionConfigView extends RcViewModule {
  constructor(
    private _evAgentSession: EvAgentSession,
    private _evAuth: EvAuth,
    private _locale: Locale,
    private _brand: Brand,
    @optional('SessionConfigViewOptions')
    private _sessionConfigViewOptions?: SessionConfigViewOptions,
  ) {
    super();
  }

  @state
  isLoading = false;

  @state
  showInboundQueuesPanel = false;

  @action
  setIsLoading(loading: boolean) {
    this.isLoading = loading;
  }

  @action
  setShowInboundQueuesPanel(show: boolean) {
    this.showInboundQueuesPanel = show;
  }

  @computed((that: SessionConfigView) => [that._evAuth.agent, that._evAuth.agentId])
  get selectedAgent(): EvAgent | null {
    const agents = this._evAuth.authenticateResponse?.agents || [];
    const agentId = this._evAuth.agentId;
    return agents.find((agent) => agent.agentId === agentId) || null;
  }

  get showReChooseAccount(): boolean {
    const agents = this._evAuth.authenticateResponse?.agents || [];
    return (
      this._sessionConfigViewOptions?.showReChooseAccount !== false &&
      agents.length > 1
    );
  }

  get showInboundQueues(): boolean {
    return (
      (this._evAuth.agentPermissions?.allowInbound || false) &&
      this._evAgentSession.inboundQueues.length > 0
    );
  }

  get showSkillProfile(): boolean {
    return this._evAgentSession.skillProfileList.length > 0;
  }

  get showAutoAnswer(): boolean {
    return true;
  }

  get showDialGroup(): boolean {
    return (
      (this._evAuth.agentPermissions?.allowOutbound || false) &&
      this._evAgentSession.dialGroups.length > 1
    );
  }

  @computed((that: SessionConfigView) => [
    that._evAgentSession.formGroup.selectedInboundQueueIds,
    that._evAgentSession.inboundQueues,
    that._locale.currentLocale,
  ])
  get inboundQueuesFieldText(): string {
    const selectedIds = this._evAgentSession.formGroup.selectedInboundQueueIds || [];
    const allQueues = this._evAgentSession.inboundQueues;
    if (selectedIds.length === 0) {
      return 'None selected';
    }
    if (selectedIds.length === allQueues.length) {
      return `All (${allQueues.length})`;
    }
    return `${selectedIds.length} selected`;
  }

  setLoginType(type: LoginTypes) {
    this._evAgentSession.setFormGroup({ loginType: type });
  }

  setSkillProfileId(profileId: string) {
    this._evAgentSession.setFormGroup({ selectedSkillProfileId: profileId });
  }

  setInboundQueueIds(ids: string[]) {
    this._evAgentSession.setFormGroup({ selectedInboundQueueIds: ids });
  }

  setAutoAnswer(autoAnswer: boolean) {
    this._evAgentSession.setFormGroup({ autoAnswer });
  }

  setExtensionNumber(number: string) {
    this._evAgentSession.setFormGroup({ extensionNumber: number });
  }

  setDialGroupId(groupId: string) {
    this._evAgentSession.setFormGroup({ dialGroupId: groupId });
  }

  async onAccountReChoose() {
    if (this._sessionConfigViewOptions?.onAccountReChoose) {
      await this._sessionConfigViewOptions.onAccountReChoose();
    }
  }

  async setConfigure() {
    this.setIsLoading(true);
    try {
      await this._evAgentSession.configureAgent();
    } finally {
      this.setIsLoading(false);
    }
  }

  getUIProps(): UIProps<SessionConfigViewUIProps> {
    return {
      selectedAgent: this.selectedAgent,
      showReChooseAccount: this.showReChooseAccount,
      isLoading: this.isLoading,
      currentLocale: this._locale.currentLocale,
      showInboundQueues: this.showInboundQueues,
      showSkillProfile: this.showSkillProfile,
      showAutoAnswer: this.showAutoAnswer,
      showDialGroup: this.showDialGroup,
      inboundQueuesFieldText: this.inboundQueuesFieldText,
    };
  }

  getUIFunctions(): UIFunctions<SessionConfigViewUIFunctions> {
    return {
      onAccountReChoose: () => this.onAccountReChoose(),
      setConfigure: () => this.setConfigure(),
    };
  }

  component(_props?: SessionConfigViewProps) {
    const { t } = useLocale(i18n);
    const { current: uiFunctions } = useRef(this.getUIFunctions());
    const [showQueuesPanel, setShowQueuesPanel] = useState(false);

    const {
      selectedAgent,
      showReChooseAccount,
      isLoading,
      showInboundQueues,
      showSkillProfile,
      showAutoAnswer,
      showDialGroup,
      inboundQueuesFieldText,
      loginTypeList,
      skillProfileList,
      inboundQueues,
      dialGroups,
      formGroup,
      logoUrl,
    } = useConnector(() => ({
      ...this.getUIProps(),
      loginTypeList: this._evAgentSession.loginTypeList,
      skillProfileList: this._evAgentSession.skillProfileList,
      inboundQueues: this._evAgentSession.inboundQueues,
      dialGroups: this._evAgentSession.dialGroups,
      formGroup: this._evAgentSession.formGroup,
      logoUrl: this._brand.assets?.['logo'] as string | undefined,
    }));

    const handleLoginTypeChange = useCallback(
      (value: string) => {
        this.setLoginType(value as LoginTypes);
      },
      [],
    );

    const handleSkillProfileChange = useCallback(
      (value: string) => {
        this.setSkillProfileId(value);
      },
      [],
    );

    const handleExtensionChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setExtensionNumber(e.target.value);
      },
      [],
    );

    const handleAutoAnswerChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setAutoAnswer(e.target.checked);
      },
      [],
    );

    const handleDialGroupChange = useCallback(
      (value: string) => {
        this.setDialGroupId(value);
      },
      [],
    );

    const handleSubmitInboundQueues = useCallback(
      (selectedIds: string[]) => {
        this.setInboundQueueIds(selectedIds);
        setShowQueuesPanel(false);
      },
      [],
    );

    const isExternalPhone = formGroup.loginType === loginTypes.externalPhone;

    const agentTypeLabel = useMemo(() => {
      if (!selectedAgent?.agentType) return '';
      return t(selectedAgent.agentType as 'agent' | 'supervisor');
    }, [selectedAgent?.agentType, t]);

    if (showQueuesPanel) {
      return (
        <InboundQueuesPanel
          inboundQueues={inboundQueues}
          selectedQueueIds={formGroup.selectedInboundQueueIds || []}
          onSubmit={handleSubmitInboundQueues}
          onBack={() => setShowQueuesPanel(false)}
        />
      );
    }

    return (
      <div className="flex flex-col h-full bg-neutral-base">
        {/* Header with Logo */}
        <div className="flex justify-center py-5 px-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-8" />
          ) : (
            <div className="typography-title text-neutral-b1">
              {this._brand.name}
            </div>
          )}
        </div>
        {/* Switch Account Button */}
        <div
          className={`bg-neutral-b5 ${showReChooseAccount ? 'visible' : 'invisible'}`}
        >
          <button
            type="button"
            onClick={uiFunctions.onAccountReChoose}
            className="flex items-center h-7 px-4 cursor-pointer"
            data-sign="reChooseAccountButton"
          >
            <Icon symbol={ArrowLeftMd} size="medium" className="text-primary-b mr-2" />
            <span className="typography-mainText text-primary-b">
              {t('switchAccount')}
            </span>
          </button>
        </div>
        {/* Account Info */}
        <div
          className="flex justify-between items-center px-4 pt-4 pb-6"
          data-sign="accountInfo"
        >
          <span className="typography-mainText text-neutral-b1 truncate">
            {selectedAgent?.accountName}
          </span>
          <span
            className="typography-descriptor text-neutral-b2"
            data-sign="agentType"
          >
            {agentTypeLabel}
          </span>
        </div>
        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-4">
          {/* Inbound Queues */}
          {showInboundQueues && (
            <div className="mb-4">
              <label className="typography-descriptor text-neutral-b2 block mb-1">
                {t('inboundQueues')}
              </label>
              <button
                type="button"
                onClick={() => setShowQueuesPanel(true)}
                className="w-full h-10 px-3 flex items-center justify-between border border-neutral-b4 rounded-lg bg-neutral-base hover:border-neutral-b3 transition-colors cursor-pointer"
                data-sign="inboundQueues"
              >
                <span className="typography-mainText text-neutral-b1 truncate">
                  {inboundQueuesFieldText}
                </span>
                <Icon symbol={CaretDownMd} size="medium" className="text-neutral-b2 flex-shrink-0" />
              </button>
            </div>
          )}
          {/* Skill Profile */}
          {showSkillProfile && (
            <div className="mb-4">
              <label className="typography-descriptor text-neutral-b2 block mb-1">
                {t('skillProfile')}
              </label>
              <div className="relative">
                <select
                  value={formGroup.selectedSkillProfileId}
                  onChange={(e) => handleSkillProfileChange(e.target.value)}
                  className="w-full h-10 px-3 pr-8 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText text-neutral-b1 appearance-none cursor-pointer hover:border-neutral-b3 focus:border-primary-b focus:outline-none transition-colors"
                  data-sign="skillProfile"
                  aria-label={t('skillProfile')}
                >
                  {skillProfileList.map((profile) => (
                    <option key={profile.profileId} value={profile.profileId}>
                      {profile.profileName}
                    </option>
                  ))}
                </select>
                <Icon symbol={CaretDownMd} size="medium" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-b2 pointer-events-none" />
              </div>
            </div>
          )}
          {/* Dial Group */}
          {showDialGroup && (
            <div className="mb-4">
              <label className="typography-descriptor text-neutral-b2 block mb-1">
                {t('dialGroup')}
              </label>
              <div className="relative">
                <select
                  value={formGroup.dialGroupId || ''}
                  onChange={(e) => handleDialGroupChange(e.target.value)}
                  className="w-full h-10 px-3 pr-8 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText text-neutral-b1 appearance-none cursor-pointer hover:border-neutral-b3 focus:border-primary-b focus:outline-none transition-colors"
                  data-sign="dialGroup"
                  aria-label={t('dialGroup')}
                >
                  {dialGroups.map((group: any) => (
                    <option key={group.groupId} value={group.groupId}>
                      {group.groupId ? `ID: ${group.groupId} ${group.groupName}` : group.groupName}
                    </option>
                  ))}
                </select>
                <Icon symbol={CaretDownMd} size="medium" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-b2 pointer-events-none" />
              </div>
            </div>
          )}
          {/* Voice Connection */}
          <div className="mb-4">
            <label className="typography-descriptor text-neutral-b2 block mb-1">
              {t('voiceConnection')}
            </label>
            <div className="relative">
              <select
                value={formGroup.loginType}
                onChange={(e) => handleLoginTypeChange(e.target.value)}
                className="w-full h-10 px-3 pr-8 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText text-neutral-b1 appearance-none cursor-pointer hover:border-neutral-b3 focus:border-primary-b focus:outline-none transition-colors"
                data-sign="loginType"
                aria-label={t('voiceConnection')}
              >
                {loginTypeList.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              <Icon symbol={CaretDownMd} size="medium" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-b2 pointer-events-none" />
            </div>
          </div>
          {/* External Phone Number */}
          {isExternalPhone && (
            <div className="mb-4">
              <label className="typography-descriptor text-neutral-b2 block mb-1">
                {t('extensionNumber')}
              </label>
              <input
                type="text"
                value={formGroup.extensionNumber || ''}
                onChange={handleExtensionChange}
                placeholder={t('enterYourPhoneNumber')}
                className="w-full h-10 px-3 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText text-neutral-b1 placeholder:text-neutral-b3 hover:border-neutral-b3 focus:border-primary-b focus:outline-none transition-colors"
                data-sign="extensionNumber"
              />
            </div>
          )}
          {/* Auto Answer */}
          {showAutoAnswer && (
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="typography-mainText text-neutral-b1">
                  {t('autoAnswer')}
                </span>
                <Switch
                  checked={formGroup.autoAnswer || false}
                  onChange={handleAutoAnswerChange}
                  data-sign="autoAnswer"
                />
              </div>
            </div>
          )}
        </div>
        {/* Continue Button */}
        <div className="px-4 py-4">
          <Button
            data-sign="setConfigure"
            fullWidth
            disabled={isLoading}
            loading={isLoading}
            onClick={uiFunctions.setConfigure}
          >
            {t('continue')}
          </Button>
        </div>
      </div>
    );
  }
}

export { SessionConfigView };
