import {
  computed,
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback, useEffect, useState } from 'react';

import { agentStatesColors } from '../../../enums';
import { getClockByTimestamp } from '../../../lib/getClockByTimestamp';
import type { EvWorkingState } from '../../services/EvWorkingState';
import type { EvSettings } from '../../services/EvSettings';
import type { EvAuth } from '../../services/EvAuth';
import type { EvCall } from '../../services/EvCall';
import type { EvAgentSession } from '../../services/EvAgentSession';
import type { MainViewOptions, MainViewProps } from './MainView.interface';
import i18n from './i18n';

/**
 * MainView - Main dashboard view for Engage Voice agent
 * Displays working state, timer, offhook controls, and leads tab
 */
@injectable({
  name: 'MainView',
})
class MainView extends RcViewModule {
  constructor(
    private evWorkingState: EvWorkingState,
    private evSettings: EvSettings,
    private evAuth: EvAuth,
    private evCall: EvCall,
    @optional() private evAgentSession?: EvAgentSession,
    @optional('MainViewOptions') private mainViewOptions?: MainViewOptions,
  ) {
    super();
  }

  @computed((that: MainView) => [that.evWorkingState.agentStates])
  get agentStates() {
    return this.evWorkingState.agentStates.map((state) => ({
      ...state,
      color: agentStatesColors[state.agentState] || 'grey',
      title: state.agentAuxState || state.agentState,
    }));
  }

  @computed((that: MainView) => [
    that.agentStates,
    that.evWorkingState.workingState,
  ])
  get currentStateIndex(): number {
    const { workingState } = this.evWorkingState;
    return this.agentStates.findIndex(
      (state) =>
        state.agentAuxState === workingState.agentAuxState &&
        state.agentState === workingState.agentState,
    );
  }

  @computed((that: MainView) => [that.evWorkingState.workingState])
  get stateText(): string {
    const { workingState } = this.evWorkingState;
    return workingState.agentAuxState || workingState.agentState;
  }

  @computed((that: MainView) => [that.evWorkingState.workingState])
  get isBreak(): boolean {
    const { isOnBreakOrAway, isOnLunch } = this.evWorkingState;
    return isOnBreakOrAway || isOnLunch;
  }

  get maxBreakTime(): number {
    return this.evWorkingState.maxBreakTime;
  }

  /**
   * Show leads tab based on dial mode (PREDICTIVE or PREVIEW)
   */
  @computed((that: MainView) => [that.evAgentSession?.currentDialMode])
  get showLeadsTab(): boolean {
    const dialMode = this.evAgentSession?.currentDialMode;
    return dialMode === 'PREDICTIVE' || dialMode === 'PREVIEW';
  }

  getStateColor(intervalTime: number): string {
    if (this.isBreak) {
      const isOverTime = this._checkOverTime(intervalTime);
      if (isOverTime) {
        return 'red';
      }
    }
    return (
      agentStatesColors[this.evWorkingState.workingState.agentState] || 'grey'
    );
  }

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

  private _checkOverTime(intervalTime: number): boolean {
    return (
      this.isBreak && this.maxBreakTime > 0 && intervalTime > this.maxBreakTime
    );
  }

  changeWorkingState(state: { agentState: string; agentAuxState: string }) {
    this.evWorkingState.changeWorkingState(state);
  }

  offhook() {
    this.evSettings.offHook();
  }

  component(_props?: MainViewProps) {
    const { t } = useLocale(i18n);

    const {
      agentStates,
      currentStateIndex,
      stateText,
      time,
      isOffhook,
      isOffhooking,
      isPendingDisposition,
      hideOffHookBtn,
      showLeadsTab,
    } = useConnector(() => ({
      agentStates: this.agentStates,
      currentStateIndex: this.currentStateIndex,
      stateText: this.stateText,
      time: this.evWorkingState.time,
      isOffhook: this.evSettings.isOffhook,
      isOffhooking: this.evSettings.isOffhooking,
      isPendingDisposition: this.evWorkingState.isPendingDisposition,
      hideOffHookBtn: !this.evAuth.agentPermissions?.allowOffHook,
      showLeadsTab: this.showLeadsTab,
    }));

    const [intervalTime, setIntervalTime] = useState(0);

    useEffect(() => {
      const updateTimer = () => {
        if (time > 0) {
          setIntervalTime(Date.now() - time);
        }
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }, [time]);

    const timerText = this.getTimerText(intervalTime);
    const stateColor = this.getStateColor(intervalTime);

    const handleStateChange = useCallback(
      (index: number) => {
        const state = agentStates[index];
        if (state) {
          this.changeWorkingState(state);
        }
      },
      [agentStates],
    );

    const handleOffhook = useCallback(() => {
      this.offhook();
    }, []);

    return (
      <div className="flex flex-col h-full bg-neutral-base">
        {/* Header with state selector */}
        <div className="p-4 border-b border-neutral-b4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stateColor }}
              />
              <span className="typography-subtitle truncate">{stateText}</span>
            </div>
            <span className="typography-mainText text-neutral-b2">
              {timerText}
            </span>
          </div>
        </div>

        {/* State selector */}
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {agentStates.map((state, index) => (
              <button
                key={`${state.agentState}-${state.agentAuxState}`}
                type="button"
                onClick={() => handleStateChange(index)}
                disabled={isPendingDisposition}
                className={`px-3 py-2 rounded-lg typography-descriptor transition-colors ${
                  index === currentStateIndex
                    ? 'bg-primary-b text-neutral-w0'
                    : 'bg-neutral-b5 text-neutral-b1 hover:bg-neutral-b4'
                } ${isPendingDisposition ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {state.title}
              </button>
            ))}
          </div>
        </div>

        {/* Offhook button */}
        {!hideOffHookBtn && (
          <div className="p-4 mt-auto">
            <button
              type="button"
              onClick={handleOffhook}
              disabled={isOffhooking}
              className={`w-full py-3 rounded-lg typography-subtitle transition-colors ${
                isOffhook
                  ? 'bg-success text-neutral-w0'
                  : 'bg-neutral-b5 text-neutral-b1 hover:bg-neutral-b4'
              } ${isOffhooking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isOffhook ? 'Connected' : t('offhook')}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export { MainView };
