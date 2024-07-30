import { Module } from '@ringcentral-integration/commons/lib/di';
import {
  EvAgentSessionUI as EvAgentSessionUIBase
} from '@ringcentral-integration/engage-voice-widgets/modules/EvAgentSessionUI';

@Module({
  name: 'EvAgentSessionUI',
  deps: [],
})
export class EvAgentSessionUI extends EvAgentSessionUIBase {
  getUIProps() {
    const { formGroup, dialGroups } = this._deps.evAgentSession;
    const { allowOutbound } = this._deps.evAuth.agentPermissions;
    return {
      ...super.getUIProps(),
      dialGroupId: formGroup.dialGroupId,
      showDialGroups: allowOutbound,
      dialGroups: dialGroups,
    };
  }

  getUIFunctions() {
    return {
      ...super.getUIFunctions(),
      setDialGroupId: (dialGroupId: string) => {
        this._deps.evAgentSession.setFormGroup({ dialGroupId });
      },
    };
  }
}
