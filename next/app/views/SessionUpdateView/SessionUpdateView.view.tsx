import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import {
  AppFooterNav,
  AppHeaderNav,
} from '@ringcentral-integration/micro-core/src/app/components';
import { PageHeader } from '@ringcentral-integration/next-widgets/components';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { Button } from '@ringcentral/spring-ui';
import React, { useCallback, useState } from 'react';

import { EvAgentSession } from '../../services/EvAgentSession';
import { EvAuth } from '../../services/EvAuth';
import type {
  SessionUpdateViewOptions,
  SessionUpdateViewProps,
} from './SessionUpdateView.interface';
import i18n from './i18n';
import { SessionConfig } from '../../components/SessionConfig';
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
    this._router.push('/agent/dialer');
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
      (profileId: string) => {
        this.setSkillProfileId(profileId);
      },
      [],
    );

    const handleInboundQueuesChange = useCallback(
      (selectedIds: string[]) => {
        this.setInboundQueueIds(selectedIds);
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

    const handleSubmitInboundQueues = useCallback(
      (selectedIds: string[]) => {
        this.setInboundQueueIds(selectedIds);
        setShowQueuesPanel(false);
      },
      [],
    );

    const handleUpdate = useCallback(async () => {
      await this.updateSession();
    }, []);

    const handleCancel = useCallback(() => {
      this.cancel();
    }, []);

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
      <>
        <AppHeaderNav override>
          <PageHeader onBackClick={handleCancel}>
            {t('updateSession')}
          </PageHeader>
        </AppHeaderNav>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <SessionConfig
            showSkillProfile={skillProfileList.length > 0}
            skillProfileList={skillProfileList}
            selectedSkillProfileId={formGroup.selectedSkillProfileId}
            onSkillProfileChange={handleSkillProfileChange}
            showInboundQueues={allowInbound && inboundQueues.length > 0}
            inboundQueues={inboundQueues}
            selectedInboundQueueIds={formGroup.selectedInboundQueueIds || []}
            onInboundQueuesChange={handleInboundQueuesChange}
            showInboundQueuesPanel={showQueuesPanel}
            onShowInboundQueuesPanelChange={setShowQueuesPanel}
            showDialGroup={allowOutbound}
            dialGroups={dialGroups}
            dialGroupId={formGroup.dialGroupId}
            onDialGroupChange={handleDialGroupChange}
            showAutoAnswer
            autoAnswer={formGroup.autoAnswer || false}
            onAutoAnswerChange={handleAutoAnswerChange}
          />
        </div>

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
        <AppFooterNav />
      </>
    );
  }
}

export { SessionUpdateView };
