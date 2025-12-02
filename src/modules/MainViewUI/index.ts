import { Module } from '@ringcentral-integration/commons/lib/di';
import { MainViewUI as BaseMainViewUI } from '@ringcentral-integration/engage-voice-widgets/modules/MainViewUI';

@Module({
  deps: ['EvAgentSession'],
})
export class MainViewUI extends BaseMainViewUI {
  getUIProps() {
    const { currentDialMode } = this._deps.evAgentSession;
    return {
      ...super.getUIProps(),
      showLeadsTab: currentDialMode === 'PREVIEW',
    };
  }
}