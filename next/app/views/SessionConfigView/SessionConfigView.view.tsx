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
import { Button, Icon } from '@ringcentral/spring-ui';
import { ArrowLeftMd } from '@ringcentral/spring-icon';
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
import { SessionConfig } from '../../components/SessionConfig';
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
      loginTypeList,
      skillProfileList,
      inboundQueues,
      dialGroups,
      formGroup,
      logoUrl,
      allowOutbound,
    } = useConnector(() => ({
      ...this.getUIProps(),
      loginTypeList: this._evAgentSession.loginTypeList,
      skillProfileList: this._evAgentSession.skillProfileList,
      inboundQueues: this._evAgentSession.inboundQueues,
      dialGroups: this._evAgentSession.dialGroups,
      formGroup: this._evAgentSession.formGroup,
      logoUrl: this._brand.assets?.['logo'] as string | undefined,
      allowOutbound: this._evAuth.agentPermissions?.allowOutbound || false,
    }));

    const handleLoginTypeChange = useCallback(
      (type: LoginTypes) => {
        this.setLoginType(type);
      },
      [],
    );

    const handleSkillProfileChange = useCallback(
      (profileId: string) => {
        this.setSkillProfileId(profileId);
      },
      [],
    );

    const handleExtensionChange = useCallback(
      (number: string) => {
        this.setExtensionNumber(number);
      },
      [],
    );

    const handleAutoAnswerChange = useCallback(
      (enabled: boolean) => {
        this.setAutoAnswer(enabled);
      },
      [],
    );

    const handleDialGroupChange = useCallback(
      (groupId: string) => {
        this.setDialGroupId(groupId);
      },
      [],
    );

    const handleInboundQueuesChange = useCallback(
      (selectedIds: string[]) => {
        this.setInboundQueueIds(selectedIds);
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

    // Show inbound queues panel
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
          <SessionConfig
            showInboundQueues={showInboundQueues}
            inboundQueues={inboundQueues}
            selectedInboundQueueIds={formGroup.selectedInboundQueueIds || []}
            onInboundQueuesChange={handleInboundQueuesChange}
            showInboundQueuesPanel={showQueuesPanel}
            onShowInboundQueuesPanelChange={setShowQueuesPanel}
            showSkillProfile={showSkillProfile}
            skillProfileList={skillProfileList}
            selectedSkillProfileId={formGroup.selectedSkillProfileId}
            onSkillProfileChange={handleSkillProfileChange}
            showDialGroup={allowOutbound}
            dialGroups={dialGroups}
            dialGroupId={formGroup.dialGroupId}
            onDialGroupChange={handleDialGroupChange}
            showVoiceConnection
            loginTypeList={loginTypeList}
            loginType={formGroup.loginType}
            onLoginTypeChange={handleLoginTypeChange}
            showExtensionNumber={isExternalPhone}
            extensionNumber={formGroup.extensionNumber || ''}
            onExtensionNumberChange={handleExtensionChange}
            showAutoAnswer={showAutoAnswer}
            autoAnswer={formGroup.autoAnswer || false}
            onAutoAnswerChange={handleAutoAnswerChange}
          />
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
