import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  computed,
  injectable,
  optional,
  RcViewModule,
  useConnector,
  UIFunctions,
  UIProps,
  RouterPlugin,
  delegate,
} from '@ringcentral-integration/next-core';
import { Brand, Locale } from '@ringcentral-integration/micro-core/src/app/services';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { Button } from '@ringcentral/spring-ui';
import { ArrowLeftMd } from '@ringcentral/spring-icon';
import type { LoginTypes } from '../../../enums';
import { loginTypes } from '../../../enums';
import { EvAgentSession } from '../../services/EvAgentSession';
import { EvAuth } from '../../services/EvAuth';
import { EvClient } from '../../services/EvClient';
import type { EvAgent } from '../../services/EvClient/interfaces';
import type {
  SessionConfigViewOptions,
  SessionConfigViewProps,
  SessionConfigViewUIProps,
  SessionConfigViewUIFunctions,
} from './SessionConfigView.interface';
import i18n from './i18n';
import { SessionConfig } from '../../components/SessionConfig';
import { InboundQueuesPanel } from '../../components/InboundQueuesPanel';

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
    private _evClient: EvClient,
    private _locale: Locale,
    private _brand: Brand,
    private _router: RouterPlugin,
    @optional('SessionConfigViewOptions')
    private _sessionConfigViewOptions?: SessionConfigViewOptions,
  ) {
    super();
  }

  @computed((that: SessionConfigView) => [that._evAuth.agent, that._evAuth.agentId])
  get selectedAgent(): EvAgent | null {
    const agents = this._evAuth.authenticateResponse?.agents || [];
    const agentId = this._evAuth.agentId;
    return agents.find((agent) => agent.agentId === agentId) || null;
  }

  get showReChooseAccount(): boolean {
    return !this._evAuth.isOnlyOneAgent;
  }

  get selectedIntegratedSoftphone(): boolean {
    return (
      this._evAgentSession.formGroup.loginType === loginTypes.integrated
    );
  }

  get showInboundQueues(): boolean {
    const { allowLoginControl, allowInbound } = this._evAuth.agentPermissions || {};
    return (
      (allowLoginControl || false) &&
      (allowInbound || false) &&
      this._evAgentSession.inboundQueues.length > 0
    );
  }

  get showSkillProfile(): boolean {
    const { allowLoginControl } = this._evAuth.agentPermissions || {};
    return (
      (allowLoginControl || false) &&
      this._evAgentSession.skillProfileList.length > 0
    );
  }

  get showAutoAnswer(): boolean {
    const { allowAutoAnswer } = this._evAuth.agentPermissions || {};
    return (allowAutoAnswer || false) && this.selectedIntegratedSoftphone;
  }

  get showDialGroup(): boolean {
    return (
      (this._evAuth.agentPermissions?.allowOutbound || false) &&
      this._evAgentSession.dialGroups.length > 1
    );
  }

  getInboundQueuesFieldText(t: (key: string) => string): string {
    const selectedIds = this._evAgentSession.formGroup.selectedInboundQueueIds || [];
    const allQueues = this._evAgentSession.inboundQueues;
    if (selectedIds.length === 0) {
      return t('none');
    }
    if (selectedIds.length === 1) {
      const selectedQueue = allQueues.find(
        (queue) => queue.gateId === selectedIds[0],
      );
      return selectedQueue?.gateName || t('none');
    }
    return `${t('multiple')} (${selectedIds.length})`;
  }

  @delegate('server')
  async setLoginType(type: LoginTypes) {
    // Set login type first, then reset autoAnswer based on the new login type
    await this._evAgentSession.setFormGroup({ loginType: type });
    const isIntegratedSoftphone = type === loginTypes.integrated;
    const autoAnswer = isIntegratedSoftphone
      ? this._evAgentSession.autoAnswer
      : this._evAgentSession.defaultAutoAnswerOn;
    await this._evAgentSession.setFormGroup({ autoAnswer });
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

  @delegate('server')
  async onAccountReChoose() {
    // Close existing socket connection
    await this._evClient.closeSocket();
    // Clear auth state
    await this._evAuth.clearAgentId();
    await this._evAuth.setNotAuth();
    // Navigate to choose account
    this._router.push('/chooseAccount');
  }

  async setConfigure() {
    try {
      await this._evAgentSession.configureAgent({
        needAssignFormGroupValue: true,
      });
    } catch (e) {
      this.logger.error('setConfigure error', e);
    }
  }

  getUIProps(): UIProps<SessionConfigViewUIProps> {
    return {
      selectedAgent: this.selectedAgent,
      showReChooseAccount: this.showReChooseAccount,
      isLoading: this._evAgentSession.configuring,
      currentLocale: this._locale.currentLocale,
      showInboundQueues: this.showInboundQueues,
      showSkillProfile: this.showSkillProfile,
      showAutoAnswer: this.showAutoAnswer,
      showDialGroup: this.showDialGroup,
      loginTypeList: this._evAgentSession.loginTypeList,
      skillProfileList: this._evAgentSession.skillProfileList,
      inboundQueues: this._evAgentSession.inboundQueues,
      dialGroups: this._evAgentSession.dialGroups,
      formGroup: this._evAgentSession.formGroup,
      logoUrl: this._brand.assets?.['logo'] as string | undefined,
      allowOutbound: this._evAuth.agentPermissions?.allowOutbound || false,
    };
  }

  getUIFunctions(): UIFunctions<SessionConfigViewUIFunctions> {
    return {
      onAccountReChoose: () => this.onAccountReChoose(),
      setConfigure: () => this.setConfigure(),
      setLoginType: (type: LoginTypes) => this.setLoginType(type),
      setSkillProfileId: (profileId: string) => this.setSkillProfileId(profileId),
      setExtensionNumber: (number: string) => this.setExtensionNumber(number),
      setAutoAnswer: (enabled: boolean) => this.setAutoAnswer(enabled),
      setDialGroupId: (groupId: string) => this.setDialGroupId(groupId),
      setInboundQueueIds: (ids: string[]) => this.setInboundQueueIds(ids),
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
    } = useConnector(() => this.getUIProps());

    const handleSubmitInboundQueues = useCallback(
      (selectedIds: string[]) => {
        uiFunctions.setInboundQueueIds(selectedIds);
        setShowQueuesPanel(false);
      },
      [uiFunctions],
    );

    const isExternalPhone = formGroup.loginType === loginTypes.external;

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
        <div className="flex justify-center py-5 px-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-6" />
          ) : (
            <div className="typography-title text-neutral-b1">
              {this._brand.name}
            </div>
          )}
        </div>
        <div
          className={`bg-neutral-b5 ${showReChooseAccount ? 'visible' : 'invisible'} pl-4`}
        >
          <Button
            onClick={uiFunctions.onAccountReChoose}
            startIcon={ArrowLeftMd}
            variant="text"
            size="medium"
            color="primary"
          >
            {t('switchAccount')}
          </Button>
        </div>
        <div
          className="flex justify-between items-center px-4 pt-4 pb-4"
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
        <div className="flex-1 overflow-y-auto px-4">
          <SessionConfig
            showInboundQueues={showInboundQueues}
            inboundQueues={inboundQueues}
            selectedInboundQueueIds={formGroup.selectedInboundQueueIds || []}
            onInboundQueuesChange={uiFunctions.setInboundQueueIds}
            showInboundQueuesPanel={showQueuesPanel}
            onShowInboundQueuesPanelChange={setShowQueuesPanel}
            showSkillProfile={showSkillProfile}
            skillProfileList={skillProfileList}
            selectedSkillProfileId={formGroup.selectedSkillProfileId}
            onSkillProfileChange={uiFunctions.setSkillProfileId}
            showDialGroup={allowOutbound}
            dialGroups={dialGroups}
            dialGroupId={formGroup.dialGroupId}
            onDialGroupChange={uiFunctions.setDialGroupId}
            showVoiceConnection
            loginTypeList={loginTypeList}
            loginType={formGroup.loginType}
            onLoginTypeChange={uiFunctions.setLoginType}
            showExtensionNumber={isExternalPhone}
            extensionNumber={formGroup.extensionNumber || ''}
            onExtensionNumberChange={uiFunctions.setExtensionNumber}
            showAutoAnswer={showAutoAnswer}
            autoAnswer={formGroup.autoAnswer || false}
            onAutoAnswerChange={uiFunctions.setAutoAnswer}
          />
        </div>
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
