import {
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback } from 'react';

import type { LoginTypes } from '../../../enums';
import type { EvAgentSession } from '../../services/EvAgentSession';
import type { EvAuth } from '../../services/EvAuth';
import type {
  SessionConfigViewOptions,
  SessionConfigViewProps,
} from './SessionConfigView.interface';
import i18n from './i18n';

/**
 * SessionConfigView - Session configuration view for agent setup
 * Handles login type, inbound queues, skill profile, and auto-answer settings
 */
@injectable({
  name: 'SessionConfigView',
})
class SessionConfigView extends RcViewModule {
  constructor(
    private evAgentSession: EvAgentSession,
    private evAuth: EvAuth,
    @optional('SessionConfigViewOptions')
    private sessionConfigViewOptions?: SessionConfigViewOptions,
  ) {
    super();
  }

  setLoginType(type: LoginTypes) {
    this.evAgentSession.setFormGroup({ loginType: type });
  }

  setSkillProfileId(profileId: string) {
    this.evAgentSession.setFormGroup({ selectedSkillProfileId: profileId });
  }

  setInboundQueueIds(ids: string[]) {
    this.evAgentSession.setFormGroup({ selectedInboundQueueIds: ids });
  }

  setAutoAnswer(autoAnswer: boolean) {
    this.evAgentSession.setFormGroup({ autoAnswer });
  }

  setExtensionNumber(number: string) {
    this.evAgentSession.setFormGroup({ extensionNumber: number });
  }

  setDialGroupId(groupId: string) {
    this.evAgentSession.setFormGroup({ dialGroupId: groupId });
  }

  async startSession() {
    await this.evAgentSession.configureAgent();
  }

  component(_props?: SessionConfigViewProps) {
    const { t } = useLocale(i18n);

    const {
      loginTypeList,
      skillProfileList,
      inboundQueues,
      dialGroups,
      formGroup,
      allowInbound,
      allowOutbound,
    } = useConnector(() => ({
      loginTypeList: this.evAgentSession.loginTypeList,
      skillProfileList: this.evAgentSession.skillProfileList,
      inboundQueues: this.evAgentSession.inboundQueues,
      dialGroups: this.evAgentSession.dialGroups,
      formGroup: this.evAgentSession.formGroup,
      allowInbound: this.evAuth.agentPermissions?.allowInbound || false,
      allowOutbound: this.evAuth.agentPermissions?.allowOutbound || false,
    }));

    const handleLoginTypeChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setLoginType(e.target.value as LoginTypes);
      },
      [],
    );

    const handleSkillProfileChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setSkillProfileId(e.target.value);
      },
      [],
    );

    const handleQueueToggle = useCallback(
      (queueId: string) => {
        const currentIds = formGroup.selectedInboundQueueIds || [];
        const newIds = currentIds.includes(queueId)
          ? currentIds.filter((id) => id !== queueId)
          : [...currentIds, queueId];
        this.setInboundQueueIds(newIds);
      },
      [formGroup.selectedInboundQueueIds],
    );

    const handleAutoAnswerChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setAutoAnswer(e.target.checked);
      },
      [],
    );

    const handleExtensionChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setExtensionNumber(e.target.value);
      },
      [],
    );

    const handleDialGroupChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setDialGroupId(e.target.value);
      },
      [],
    );

    const handleStartSession = useCallback(async () => {
      await this.startSession();
    }, []);

    const isExternalPhone = formGroup.loginType === 'externalPhone';

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-y-auto">
        <h1 className="typography-title mb-6">Session Configuration</h1>

        {/* Voice Connection */}
        <div className="mb-4">
          <label className="typography-subtitle block mb-2">
            {t('voiceConnection')}
          </label>
          <select
            value={formGroup.loginType}
            onChange={handleLoginTypeChange}
            className="w-full p-3 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText"
          >
            {loginTypeList.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* External Phone Number */}
        {isExternalPhone && (
          <div className="mb-4">
            <label className="typography-subtitle block mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formGroup.extensionNumber || ''}
              onChange={handleExtensionChange}
              placeholder="Enter phone number"
              className="w-full p-3 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText"
            />
          </div>
        )}

        {/* Skill Profile */}
        {skillProfileList.length > 0 && (
          <div className="mb-4">
            <label className="typography-subtitle block mb-2">
              {t('skillProfile')}
            </label>
            <select
              value={formGroup.selectedSkillProfileId}
              onChange={handleSkillProfileChange}
              className="w-full p-3 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText"
            >
              {skillProfileList.map((profile) => (
                <option key={profile.profileId} value={profile.profileId}>
                  {profile.profileName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Inbound Queues */}
        {allowInbound && inboundQueues.length > 0 && (
          <div className="mb-4">
            <label className="typography-subtitle block mb-2">
              {t('inboundQueues')}
            </label>
            <div className="border border-neutral-b4 rounded-lg p-2 max-h-48 overflow-y-auto">
              {inboundQueues.map((queue) => (
                <label
                  key={queue.gateId}
                  className="flex items-center p-2 hover:bg-neutral-b5 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(formGroup.selectedInboundQueueIds || []).includes(
                      queue.gateId,
                    )}
                    onChange={() => handleQueueToggle(queue.gateId)}
                    className="mr-3"
                  />
                  <span className="typography-mainText truncate">
                    {queue.gateName}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Dial Group */}
        {allowOutbound && dialGroups.length > 1 && (
          <div className="mb-4">
            <label className="typography-subtitle block mb-2">
              {t('dialGroup')}
            </label>
            <select
              value={formGroup.dialGroupId || ''}
              onChange={handleDialGroupChange}
              className="w-full p-3 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText"
            >
              {dialGroups.map((group: any) => (
                <option key={group.groupId} value={group.groupId}>
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Auto Answer */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formGroup.autoAnswer || false}
              onChange={handleAutoAnswerChange}
              className="mr-3"
            />
            <span className="typography-subtitle">{t('autoAnswer')}</span>
          </label>
        </div>

        {/* Start Session Button */}
        <button
          type="button"
          onClick={handleStartSession}
          className="w-full py-3 bg-primary-b text-neutral-w0 rounded-lg typography-subtitle hover:bg-primary-f transition-colors"
        >
          {t('startSession')}
        </button>
      </div>
    );
  }
}

export { SessionConfigView };
