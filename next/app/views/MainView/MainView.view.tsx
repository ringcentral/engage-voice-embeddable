import {
  computed,
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback } from 'react';

import { EvWorkingState } from '../../services/EvWorkingState';
import { EvSettings } from '../../services/EvSettings';
import { EvAuth } from '../../services/EvAuth';
import { EvCall } from '../../services/EvCall';
import { EvAgentSession } from '../../services/EvAgentSession';
import { WorkingStateSelectView } from '../WorkingStateSelectView';
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
    private _evWorkingState: EvWorkingState,
    private _evSettings: EvSettings,
    private _evAuth: EvAuth,
    private _evCall: EvCall,
    private _workingStateSelectView: WorkingStateSelectView,
    @optional() private _evAgentSession?: EvAgentSession,
    @optional('MainViewOptions') private _mainViewOptions?: MainViewOptions,
  ) {
    super();
  }

  /**
   * Show leads tab based on dial mode (PREDICTIVE or PREVIEW)
   */
  @computed((that: MainView) => [that._evAgentSession?.currentDialMode])
  get showLeadsTab(): boolean {
    const dialMode = this._evAgentSession?.currentDialMode;
    return dialMode === 'PREDICTIVE' || dialMode === 'PREVIEW';
  }

  /**
   * Toggle offhook state
   */
  offhook(): void {
    this._evSettings.offHook();
  }

  component(_props?: MainViewProps) {
    const { t } = useLocale(i18n);

    const {
      isOffhook,
      isOffhooking,
      hideOffHookBtn,
      showLeadsTab,
    } = useConnector(() => ({
      isOffhook: this._evSettings.isOffhook,
      isOffhooking: this._evSettings.isOffhooking,
      hideOffHookBtn: !this._evAuth.agentPermissions?.allowOffHook,
      showLeadsTab: this.showLeadsTab,
    }));

    const handleOffhook = useCallback(() => {
      this.offhook();
    }, []);

    return (
      <div className="flex flex-col h-full bg-neutral-base">
        {/* Working state selector */}
        <div className="px-3 py-2 border-b border-neutral-b4">
          {this._workingStateSelectView.component()}
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
