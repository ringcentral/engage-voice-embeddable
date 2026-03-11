import {
  computed,
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import React, { useCallback, useEffect, useState } from 'react';

import { agentStatesColors } from '../../../enums';
import { getClockByTimestamp } from '../../../lib/getClockByTimestamp';
import { EvWorkingState } from '../../services/EvWorkingState';
import { EvAuth } from '../../services/EvAuth';
import { WorkingStateSelect } from '../../components/WorkingStateSelect';
import type { AgentStateOption } from '../../components/WorkingStateSelect';
import type {
  WorkingStateSelectViewOptions,
  WorkingStateSelectViewProps,
} from './WorkingStateSelectView.interface';

/**
 * WorkingStateSelectView - View module for agent working state selection
 * Manages timer, state colors, break-time alerts, and renders the WorkingStateSelect component
 */
@injectable({
  name: 'WorkingStateSelectView',
})
class WorkingStateSelectView extends RcViewModule {
  private _oldIntervalTime = 0;

  constructor(
    private _evWorkingState: EvWorkingState,
    private _evAuth: EvAuth,
    @optional('WorkingStateSelectViewOptions')
    private _options?: WorkingStateSelectViewOptions,
  ) {
    super();
  }

  @computed((that: WorkingStateSelectView) => [
    that._evWorkingState.agentStates,
  ])
  get agentStates(): AgentStateOption[] {
    return this._evWorkingState.agentStates.map((state) => ({
      ...state,
      color: agentStatesColors[state.agentState] || 'grey',
      title: state.agentAuxState || state.agentState,
    }));
  }

  @computed((that: WorkingStateSelectView) => [
    that.agentStates,
    that._evWorkingState.workingState,
  ])
  get currentStateIndex(): number {
    const { workingState } = this._evWorkingState;
    return this.agentStates.findIndex(
      (state) =>
        state.agentAuxState === workingState.agentAuxState &&
        state.agentState === workingState.agentState,
    );
  }

  @computed((that: WorkingStateSelectView) => [
    that._evWorkingState.workingState,
  ])
  get stateText(): string {
    const { workingState } = this._evWorkingState;
    return workingState.agentAuxState || workingState.agentState;
  }

  @computed((that: WorkingStateSelectView) => [
    that._evWorkingState.workingState,
  ])
  get isBreak(): boolean {
    const { isOnBreakOrAway, isOnLunch } = this._evWorkingState;
    return isOnBreakOrAway || isOnLunch;
  }

  get maxBreakTime(): number {
    return this._evWorkingState.maxBreakTime;
  }

  /**
   * Compute state indicator color based on interval time and break status
   */
  getStateColor(intervalTime: number): string {
    if (this.isBreak && this._checkOverTime(intervalTime)) {
      return 'red';
    }
    return (
      agentStatesColors[this._evWorkingState.workingState.agentState] || 'grey'
    );
  }

  /**
   * Compute timer display text based on interval time and break status
   */
  getTimerText(intervalTime: number): string {
    if (this._checkOverTime(intervalTime)) {
      return `-${getClockByTimestamp(intervalTime - this.maxBreakTime)}`;
    }
    if (this.isBreak && this.maxBreakTime > 0) {
      const remaining = Math.max(0, this.maxBreakTime - intervalTime);
      return getClockByTimestamp(remaining, { useCeil: true });
    }
    return getClockByTimestamp(intervalTime);
  }

  /**
   * Handle interval time update and trigger break-time alert when exceeded
   */
  handleWithIntervalTime(intervalTime: number): void {
    const isOverTime = this._checkOverTime(intervalTime);
    if (
      this._oldIntervalTime < this.maxBreakTime &&
      isOverTime &&
      this.isBreak
    ) {
      this._evWorkingState.alertOverBreakTime();
    }
    this._oldIntervalTime = intervalTime;
  }

  /**
   * Change agent working state
   */
  changeWorkingState(state: AgentStateOption): void {
    this._evWorkingState.changeWorkingState(state);
  }

  private _checkOverTime(intervalTime: number): boolean {
    return (
      this.isBreak && this.maxBreakTime > 0 && intervalTime > this.maxBreakTime
    );
  }

  component(_props?: WorkingStateSelectViewProps) {
    const {
      agentStates,
      currentStateIndex,
      stateText,
      time,
      isPendingDisposition,
    } = useConnector(() => ({
      agentStates: this.agentStates,
      currentStateIndex: this.currentStateIndex,
      stateText: this.stateText,
      time: this._evWorkingState.time,
      isPendingDisposition: this._evWorkingState.isPendingDisposition,
    }));

    const [intervalTime, setIntervalTime] = useState(
      () => Date.now() - time,
    );

    useEffect(() => {
      const updateTimer = () => {
        const newIntervalTime = Date.now() - time;
        this.handleWithIntervalTime(newIntervalTime);
        setIntervalTime(newIntervalTime);
      };
      updateTimer();
      const timerId = setInterval(updateTimer, 1000);
      return () => clearInterval(timerId);
    }, [time]);

    const timerText = this.getTimerText(intervalTime);
    const stateColor = this.getStateColor(intervalTime);
    const isOverTime = this._checkOverTime(intervalTime);

    const handleChangeState = useCallback(
      (state: AgentStateOption) => {
        this.changeWorkingState(state);
      },
      [],
    );

    return (
      <WorkingStateSelect
        agentStates={agentStates}
        currentStateIndex={currentStateIndex}
        stateText={stateText}
        stateColor={stateColor}
        timerText={timerText}
        isOverTime={isOverTime}
        onChangeState={handleChangeState}
        disabled={isPendingDisposition}
        className={_props?.className}
        data-sign="workingStateSelect"
      />
    );
  }
}

export { WorkingStateSelectView };
