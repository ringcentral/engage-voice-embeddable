import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback } from 'react';

import type { LoginTypes } from '../../../enums';
import { EvAgentSession } from '../../services/EvAgentSession';
import { EvAuth } from '../../services/EvAuth';
import type {
  SessionUpdateViewOptions,
  SessionUpdateViewProps,
} from './SessionUpdateView.interface';
import i18n from './i18n';

/**
 * SessionUpdateView - Session update view for modifying agent session
 * Allows updating skill profile, inbound queues, and dial group settings
 */
@injectable({
  name: 'SessionUpdateView',
})
class SessionUpdateView extends RcViewModule {
  constructor(
    private _evAgentSession: EvAgentSession,
    private _evAuth: EvAuth,
    private _router: RouterPlugin,
    @optional('SessionUpdateViewOptions')
    private _options?: SessionUpdateViewOptions,
  ) {
    super();
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

  setDialGroupId(groupId: string) {
    this._evAgentSession.setFormGroup({ dialGroupId: groupId });
  }

  async updateSession() {
    await this._evAgentSession.updateSession();
    this._options?.onUpdateComplete?.();
    this._router.push('/dialer');
  }

  cancel() {
    this._options?.onCancel?.();
    this._router.goBack();
  }

  component(_props?: SessionUpdateViewProps) {
    const { t } = useLocale(i18n);

    const {
      skillProfileList,
      inboundQueues,
      dialGroups,
      formGroup,
      allowInbound,
      allowOutbound,
    } = useConnector(() => ({
      skillProfileList: this._evAgentSession.skillProfileList,
      inboundQueues: this._evAgentSession.inboundQueues,
      dialGroups: this._evAgentSession.dialGroups,
      formGroup: this._evAgentSession.formGroup,
      allowInbound: this._evAuth.agentPermissions?.allowInbound || false,
      allowOutbound: this._evAuth.agentPermissions?.allowOutbound || false,
    }));

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

    const handleDialGroupChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setDialGroupId(e.target.value);
      },
      [],
    );

    const handleUpdate = useCallback(async () => {
      await this.updateSession();
    }, []);

    const handleCancel = useCallback(() => {
      this.cancel();
    }, []);

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-y-auto">
        <h1 className="typography-title mb-6">{t('updateSession')}</h1>

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

        {/* Buttons */}
        <div className="flex gap-3 mt-auto">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-3 border border-neutral-b4 text-neutral-b1 rounded-lg typography-subtitle hover:bg-neutral-b5 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="flex-1 py-3 bg-primary-b text-neutral-w0 rounded-lg typography-subtitle hover:bg-primary-f transition-colors"
          >
            {t('update')}
          </button>
        </div>
      </div>
    );
  }
}

export { SessionUpdateView };
