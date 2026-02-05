import { Toast } from '@ringcentral-integration/micro-core/src/app/services';
import {
  action,
  computed,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
} from '@ringcentral-integration/next-core';

import { agentStateTypes, messageTypes } from '../../../enums';
import { t } from './i18n';
import { EvCallbackTypes } from '../EvClient/enums';
import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import { EvSubscription } from '../EvSubscription';
import type {
  EvWorkingStateOptions,
  AgentState,
  WorkingState,
} from './EvWorkingState.interface';

const DEFAULT_AGENT_STATE: AgentState = {
  agentState: '',
  agentAuxState: '',
};

/**
 * EvWorkingState module - Agent working state management
 * Handles agent state changes, break time tracking, and disposition pending states
 */
@injectable({
  name: 'EvWorkingState',
})
class EvWorkingState extends RcModule {
  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private evSubscription: EvSubscription,
    private toast: Toast,
    private storagePlugin: StoragePlugin,
    @optional('EvWorkingStateOptions')
    private evWorkingStateOptions?: EvWorkingStateOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

  @storage
  @state
  time = 0;

  @storage
  @state
  agentState: AgentState = DEFAULT_AGENT_STATE;

  @storage
  @state
  isPendingDisposition = false;

  @action
  setAgentState(agentState: AgentState) {
    this.agentState = agentState;
    this.time = Date.now();
  }

  @action
  setIsPendingDisposition(isPendingDisposition: boolean) {
    this.isPendingDisposition = isPendingDisposition;
  }

  @action
  resetWorkingState() {
    this.time = 0;
    this.agentState = DEFAULT_AGENT_STATE;
    this.isPendingDisposition = false;
  }

  @action
  setTime(time: number) {
    this.time = time;
  }

  @computed((that: EvWorkingState) => [
    that.agentState,
    that.isPendingDisposition,
  ])
  get workingState(): WorkingState {
    if (this.isPendingDisposition) {
      return {
        ...this.agentState,
        baseState: agentStateTypes.PENDING_DISP,
      };
    }
    return this.agentState;
  }

  @computed((that: EvWorkingState) => [that.evAuth.agentConfig])
  get agentStates(): AgentState[] {
    const { agentConfig } = this.evAuth;
    if (!agentConfig?.agentSettings?.availableAgentStates) {
      return [];
    }
    return agentConfig.agentSettings.availableAgentStates;
  }

  @computed((that: EvWorkingState) => [that.evAuth.agentSettings])
  get maxBreakTime(): number {
    const { agentSettings } = this.evAuth;
    if (!agentSettings) {
      return 0;
    }
    const { maxBreakTime, maxLunchTime } = agentSettings;
    if (this.isOnLunch) {
      return (maxLunchTime || 0) * 60 * 1000;
    }
    return (maxBreakTime || 0) * 60 * 1000;
  }

  get isOnBreakOrAway(): boolean {
    const { agentState } = this.agentState;
    return (
      agentState === agentStateTypes.BREAK ||
      agentState === agentStateTypes.AWAY
    );
  }

  get isOnLunch(): boolean {
    const { agentState } = this.agentState;
    return agentState === agentStateTypes.LUNCH;
  }

  get isWorking(): boolean {
    const { agentState } = this.agentState;
    return agentState === agentStateTypes.WORKING;
  }

  override onInitOnce() {
    this.evSubscription.subscribe(EvCallbackTypes.AGENT_STATE, (data: any) => {
      if (data?.agentState) {
        this.setAgentState({
          agentState: data.agentState,
          agentAuxState: data.agentAuxState || '',
        });
      }
    });
  }

  /**
   * Change agent working state
   */
  async changeWorkingState(state: AgentState): Promise<void> {
    if (this.isPendingDisposition) {
      this.toast.warning({
        message: t(messageTypes.PENDING_DISPOSITION),
        allowDuplicates: false,
        ttl: 0,
      });
      return;
    }
    const { agentState, agentAuxState } = state;
    await this.evClient.setAgentState(agentState, agentAuxState);
    this.setAgentState(state);
  }

  /**
   * Set working state to working
   */
  setWorkingStateWorking() {
    const workingState = this.agentStates.find(
      (s) => s.agentState === agentStateTypes.WORKING,
    );
    if (workingState) {
      this.changeWorkingState(workingState);
    }
  }

  /**
   * Alert when break time is exceeded
   */
  alertOverBreakTime() {
    this.toast.warning({
      message: t(messageTypes.OVER_BREAK_TIME),
      ttl: 0,
      allowDuplicates: false,
    });
  }
}

export { EvWorkingState };
