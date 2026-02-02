import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { Button, Switch, Icon } from '@ringcentral/spring-ui';
import { ArrowLeftMd, CaretDownMd } from '@ringcentral/spring-icon';
import React, { useCallback, useState } from 'react';

import type { LoginTypes } from '../../../enums';
import { EvAgentSession } from '../../services/EvAgentSession';
import { EvAuth } from '../../services/EvAuth';
import type {
  SessionUpdateViewOptions,
  SessionUpdateViewProps,
} from './SessionUpdateView.interface';
import i18n from './i18n';
import { InboundQueuesPanel } from '../SessionConfigView/InboundQueuesPanel';

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
    // Voice connection is not changed in update view
    await this._evAgentSession.updateAgent(false);
    this._options?.onUpdateComplete?.();
    this._router.push('/dialer');
  }

  cancel() {
    this._options?.onCancel?.();
    this._router.goBack();
  }

  component(_props?: SessionUpdateViewProps) {
    const { t } = useLocale(i18n);
    const [showQueuesPanel, setShowQueuesPanel] = useState(false);

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

    const handleSubmitInboundQueues = useCallback(
      (selectedIds: string[]) => {
        this.setInboundQueueIds(selectedIds);
        setShowQueuesPanel(false);
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

    // Compute inbound queues field text
    const selectedIds = formGroup.selectedInboundQueueIds || [];
    const inboundQueuesFieldText =
      selectedIds.length === 0
        ? t('noneSelected')
        : selectedIds.length === inboundQueues.length
          ? `${t('all')} (${inboundQueues.length})`
          : `${selectedIds.length} ${t('selected')}`;

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
        {/* Header */}
        <div className="flex items-center h-14 px-4 border-b border-neutral-b4">
          <button
            type="button"
            onClick={handleCancel}
            className="mr-3 p-1 hover:bg-neutral-b5 rounded-full transition-colors"
            data-sign="backButton"
            aria-label={t('cancel')}
          >
            <Icon symbol={ArrowLeftMd} size="medium" className="text-neutral-b1" />
          </button>
          <h1 className="typography-title">{t('updateSession')}</h1>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Skill Profile */}
          {skillProfileList.length > 0 && (
            <div className="mb-4">
              <label className="typography-descriptor text-neutral-b2 block mb-1">
                {t('skillProfile')}
              </label>
              <div className="relative">
                <select
                  value={formGroup.selectedSkillProfileId}
                  onChange={handleSkillProfileChange}
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

          {/* Inbound Queues */}
          {allowInbound && inboundQueues.length > 0 && (
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

          {/* Dial Group */}
          {allowOutbound && dialGroups.length > 1 && (
            <div className="mb-4">
              <label className="typography-descriptor text-neutral-b2 block mb-1">
                {t('dialGroup')}
              </label>
              <div className="relative">
                <select
                  value={formGroup.dialGroupId || ''}
                  onChange={handleDialGroupChange}
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

          {/* Auto Answer */}
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
        </div>

        {/* Buttons */}
        <div className="px-4 py-4 flex gap-3">
          <Button
            variant="outlined"
            color="neutral"
            fullWidth
            onClick={handleCancel}
            data-sign="cancelButton"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUpdate}
            data-sign="updateButton"
          >
            {t('update')}
          </Button>
        </div>
      </div>
    );
  }
}

export { SessionUpdateView };
