import {
  computed,
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback } from 'react';
import { IconButton } from '@ringcentral/spring-ui';
import { AgentMd } from '@ringcentral/spring-icon';
import clsx from 'clsx';

import { EvSettings } from '../../services/EvSettings';
import { EvAuth } from '../../services/EvAuth';
import { EvCallMonitor } from '../../services/EvCallMonitor';
import { EvCall } from '../../services/EvCall';
import type {
  OffhookButtonViewOptions,
  OffhookButtonViewProps,
} from './OffhookButtonView.interface';
import type { OffhookState } from '../../services/EvSettings/EvSettings.interface';
import i18n from './i18n';

/**
 * OffhookButtonView - Offhook toggle button for Engage Voice agent
 * Displays agent offhook status with state-aware icon and tooltip
 */
@injectable({
  name: 'OffhookButtonView',
})
class OffhookButtonView extends RcViewModule {
  constructor(
    private _evSettings: EvSettings,
    private _evAuth: EvAuth,
    private _evCallMonitor: EvCallMonitor,
    private _evCall: EvCall,
    @optional('OffhookButtonViewOptions')
    private _options?: OffhookButtonViewOptions,
  ) {
    super();
  }

  /**
   * Whether the offhook button should be disabled
   * Matches old MainViewUI.isOffHookDisable logic
   */
  @computed((that: OffhookButtonView) => [
    that._evSettings.isOffhooking,
    that._evCallMonitor.isOnCall,
    that._evCall.isDialing,
    that._evAuth.agentPermissions,
  ])
  get isOffHookDisabled(): boolean {
    return (
      this._evSettings.isOffhooking ||
      this._evCallMonitor.isOnCall ||
      this._evCall.isDialing ||
      !this._evAuth.agentPermissions?.allowOffHook
    );
  }

  /**
   * Whether the offhook button should be hidden entirely
   */
  @computed((that: OffhookButtonView) => [that._evAuth.agentPermissions])
  get hideOffHookBtn(): boolean {
    return !this._evAuth.agentPermissions?.allowOffHook;
  }

  /**
   * Toggle offhook state (only when not disabled)
   */
  offhook(): void {
    if (!this.isOffHookDisabled) {
      this._evSettings.offHook();
    }
  }

  /**
   * Get tooltip text based on current offhook state
   */
  private _getTooltipText(
    offhookState: OffhookState,
    isDisabled: boolean,
    isOffhooking: boolean,
    t: (key: string) => string,
  ): string {
    if (isDisabled && !isOffhooking) {
      return t('disabled');
    }
    switch (offhookState) {
      case 'connecting':
        return t('connecting');
      case 'disconnecting':
        return t('disconnecting');
      case 'disconnected':
        return t('turnOn');
      case 'connected':
      default:
        return t('turnOff');
    }
  }

  /**
   * Determine if the button is in a loading/transitioning state
   */
  private _isTransitioning(offhookState: OffhookState): boolean {
    return offhookState === 'connecting' || offhookState === 'disconnecting';
  }

  component(props?: OffhookButtonViewProps) {
    const { t } = useLocale(i18n);
    const {
      isOffhook,
      isOffhooking,
      offhookState,
      hideOffHookBtn,
      isOffHookDisabled,
    } = useConnector(() => ({
      isOffhook: this._evSettings.isOffhook,
      isOffhooking: this._evSettings.isOffhooking,
      offhookState: this._evSettings.offhookState,
      hideOffHookBtn: this.hideOffHookBtn,
      isOffHookDisabled: this.isOffHookDisabled,
    }));
    const handleOffhook = useCallback(() => {
      this.offhook();
    }, []);
    if (hideOffHookBtn) {
      return null;
    }
    const isTransitioning = this._isTransitioning(offhookState);
    const tooltipText = this._getTooltipText(
      offhookState,
      isOffHookDisabled,
      isOffhooking,
      t,
    );
    return (
      <IconButton
        symbol={AgentMd}
        size="small"
        variant={isOffhook ? 'contained' : 'outlined'}
        color={isOffhook ? 'success' : 'neutral'}
        disabled={isOffHookDisabled}
        onClick={handleOffhook}
        aria-label={tooltipText}
        className={clsx(
          isTransitioning && 'animate-pulse',
          props?.className,
        )}
        TooltipProps={{
          title: tooltipText,
          triggerWhenDisabled: true,
        }}
      />
    );
  }
}

export { OffhookButtonView };
