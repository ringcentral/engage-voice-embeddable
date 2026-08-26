import React, { useRef } from 'react';
import {
  action,
  computed,
  delegate,
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  state,
  useConnector,
  type UIProps,
  type UIFunctions,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import {
  AppFooterNav,
  AppHeaderNav,
} from '@ringcentral-integration/micro-core/src/app/components';
import { PageHeader } from '@ringcentral-integration/next-widgets/components';

import type { EvTransferType } from '../../../enums';
import { transferTypes } from '../../../enums';
import { EvTransferCall } from '../../services/EvTransferCall';
import { EvRequeueCall } from '../../services/EvRequeueCall';
import { EvCall } from '../../services/EvCall';
import { EvAuth } from '../../services/EvAuth';
import { TransferPanel } from '../../components/TransferPanel';
import type {
  TransferViewOptions,
  TransferViewProps,
  TransferTab,
  TransferViewUIProps,
  TransferViewUIFunctions,
} from './TransferView.interface';
import i18n, { t as translate } from './i18n';

/**
 * TransferView - Unified transfer view with tabbed navigation.
 * Replaces the multi-page transfer flow with a single page using
 * pill tabs for transfer type selection and inline destination selection.
 */
@injectable({
  name: 'TransferView',
})
class TransferView extends RcViewModule {
  constructor(
    private _evTransferCall: EvTransferCall,
    private _evRequeueCall: EvRequeueCall,
    private _evCall: EvCall,
    private _evAuth: EvAuth,
    private _router: RouterPlugin,
    @optional('TransferViewOptions')
    private _options?: TransferViewOptions,
  ) {
    super();
  }

  @state
  private _manualEntryNumber = '';

  @action
  private _setManualEntryNumber(value: string) {
    this._manualEntryNumber = value;
  }

  /**
   * The view runs in a client port while its state lives on the server, so
   * every handler in this view that mutates state has to be delegated: a
   * client-side action is replaced by the server's copy on the next full-state
   * sync, which reverted the user's input a few seconds after they made it.
   */
  @delegate('server')
  async setManualEntryNumber(value: string): Promise<void> {
    this._setManualEntryNumber(value);
    this._evTransferCall.changeTransferType(transferTypes.manualEntry);
  }

  get callId(): string {
    return this._evCall.activityCallId;
  }

  get isQueueTransfer(): boolean {
    return this._evTransferCall.transferType === transferTypes.queue;
  }

  /**
   * A queue transfer is executed by EvRequeueCall, which keeps its own
   * `stayOnCall` for the requeue `maintain` flag, so the switch has to read and
   * write that module instead of EvTransferCall while the queue tab is active.
   */
  @computed((that: TransferView) => [
    that.isQueueTransfer,
    that._evRequeueCall.stayOnCall,
    that._evTransferCall.stayOnCall,
  ])
  get isStayOnCall(): boolean {
    return this.isQueueTransfer
      ? this._evRequeueCall.stayOnCall
      : this._evTransferCall.stayOnCall;
  }

  /** Whether the current call allows non-queue transfer actions */
  get allowTransferCall(): boolean {
    const call = this._evCall.currentCall;
    return !!(call?.allowTransfer && !call?.endedCall);
  }

  @computed((that: TransferView) => [
    that._evCall.currentCall,
    that._evTransferCall.allowInternalTransfer,
    that._evTransferCall.transferPhoneBook,
    that._evRequeueCall.allowRequeueCall,
  ])
  get allTabs(): TransferTab[] {
    const canTransfer = this.allowTransferCall;
    return [
      {
        value: transferTypes.internal,
        label: translate('internalTransfer'),
        disabled: !canTransfer || !this._evTransferCall.allowInternalTransfer,
      },
      {
        value: transferTypes.queue,
        label: translate('queue'),
        disabled: !this._evRequeueCall.allowRequeueCall,
      },
      {
        value: transferTypes.phoneBook,
        label: translate('phoneBook'),
        disabled:
          !canTransfer || this._evTransferCall.transferPhoneBook.length === 0,
      },
      {
        value: transferTypes.manualEntry,
        label: translate('manualEntry'),
        disabled: !canTransfer,
      },
    ];
  }

  @computed((that: TransferView) => [that.allTabs])
  get defaultTab(): EvTransferType | null {
    const firstEnabled = this.allTabs.find((tab) => !tab.disabled);
    return firstEnabled?.value ?? null;
  }

  @computed((that: TransferView) => [that.allTabs])
  get hasAvailableTab(): boolean {
    return this.allTabs.some((tab) => !tab.disabled);
  }

  @computed((that: TransferView) => [
    that._evTransferCall.transferType,
    that._evTransferCall.transferAgentId,
    that._evTransferCall.transferPhoneBookSelectedIndex,
    that._manualEntryNumber,
    that._evRequeueCall.selectedGateId,
    that._evTransferCall.transferring,
    that._evRequeueCall.requeuing,
    that._evCall.currentCall,
  ])
  get isTransferDisabled(): boolean {
    const { transferType, transferring } = this._evTransferCall;
    const { requeuing } = this._evRequeueCall;
    const isCallEnded = !!this._evCall.currentCall?.endedCall;
    if (transferring || requeuing || isCallEnded) return true;
    switch (transferType) {
      case transferTypes.internal:
        return !this._evTransferCall.transferAgentId;
      case transferTypes.phoneBook:
        return this._evTransferCall.transferPhoneBookSelectedIndex === null;
      case transferTypes.manualEntry:
        return this._manualEntryNumber.trim().length === 0;
      case transferTypes.queue:
        return !this._evRequeueCall.selectedGateId;
      default:
        return true;
    }
  }

  @delegate('server')
  async executeTransfer(): Promise<void> {
    try {
      if (this.isQueueTransfer) {
        await this._evRequeueCall.requeueCall();
      } else {
        if (this._evTransferCall.transferType === transferTypes.manualEntry) {
          this._evTransferCall.changeRecipientNumber(this._manualEntryNumber);
        }
        await this._evTransferCall.transfer();
      }
      this._router.replace(`/activityCallLog/${this.callId}`);
    } catch (error) {
      this.logger.error('Transfer failed:', error);
    }
  }

  @delegate('server')
  async cancelTransfer(): Promise<void> {
    this._evTransferCall.resetTransferStatus();
    this._setManualEntryNumber('');
    this._options?.onCancel?.();
    this._router.replace(`/activityCallLog/${this.callId}`);
  }

  @delegate('server')
  async goBack(): Promise<void> {
    this._router.replace(`/activityCallLog/${this.callId}`);
  }

  @delegate('server')
  async handleTabChange(type: EvTransferType): Promise<void> {
    this._evTransferCall.changeTransferType(type);
    if (type === transferTypes.internal) {
      await this._evTransferCall.fetchAgentList();
    }
  }

  @delegate('server')
  async handleStayOnCallChange(): Promise<void> {
    if (this.isQueueTransfer) {
      this._evRequeueCall.setStatus({
        stayOnCall: !this._evRequeueCall.stayOnCall,
      });
      return;
    }
    this._evTransferCall.changeStayOnCall(this._evTransferCall.stayOnCall);
  }

  @delegate('server')
  async selectAgent(agentId: string): Promise<void> {
    this._evTransferCall.changeTransferAgentId(agentId);
    this._evTransferCall.changeTransferType(transferTypes.internal);
  }

  @delegate('server')
  async selectPhoneBookContact(index: number | null): Promise<void> {
    this._evTransferCall.changeTransferPhoneBookSelected(index);
    this._evTransferCall.changeTransferType(transferTypes.phoneBook);
  }

  @delegate('server')
  async fetchAgentList(): Promise<void> {
    await this._evTransferCall.fetchAgentList();
  }

  @delegate('server')
  async handleQueueGroupChange(groupId: string): Promise<void> {
    this._evRequeueCall.setStatus({
      selectedQueueGroupId: groupId,
      selectedGateId: '',
    });
  }

  @delegate('server')
  async handleGateChange(gateId: string): Promise<void> {
    this._evRequeueCall.setStatus({ selectedGateId: gateId });
  }

  getUIProps(): UIProps<TransferViewUIProps> {
    return {
      transferType: this._evTransferCall.transferType,
      isStayOnCall: this.isStayOnCall,
      isTransferring:
        this._evTransferCall.transferring || this._evRequeueCall.requeuing,
      isDisabled: this.isTransferDisabled,
      allTabs: this.allTabs,
      defaultTab: this.defaultTab,
      agentList: this._evTransferCall.transferAgentList,
      phoneBook: this._evTransferCall.transferPhoneBook,
      selectedAgentId: this._evTransferCall.transferAgentId,
      selectedPhoneBookIndex:
        this._evTransferCall.transferPhoneBookSelectedIndex,
      manualEntryNumber: this._manualEntryNumber,
      queueGroups: this._evAuth.availableRequeueQueues,
      selectedQueueGroupId: this._evRequeueCall.selectedQueueGroupId,
      selectedGateId: this._evRequeueCall.selectedGateId,
    };
  }

  getUIFunctions(): UIFunctions<TransferViewUIFunctions> {
    return {
      onTabChange: (type) => this.handleTabChange(type),
      onStayOnCallChange: () => this.handleStayOnCallChange(),
      onSelectAgent: (agentId) => this.selectAgent(agentId),
      onSelectPhoneBookContact: (index) => this.selectPhoneBookContact(index),
      onManualEntryChange: (value) => this.setManualEntryNumber(value),
      onQueueGroupChange: (groupId) => this.handleQueueGroupChange(groupId),
      onGateChange: (gateId) => this.handleGateChange(gateId),
      onTransfer: () => this.executeTransfer(),
      onCancel: () => this.cancelTransfer(),
      onBack: () => this.goBack(),
      fetchAgentList: () => this.fetchAgentList(),
    };
  }

  component(_props?: TransferViewProps) {
    const { t } = useLocale(i18n);
    const { current: uiFunctions } = useRef(this.getUIFunctions());
    const uiProps = useConnector(() => this.getUIProps());

    return (
      <>
        <AppHeaderNav override>
          <PageHeader onBackClick={uiFunctions.onBack}>
            {t('transfer')}
          </PageHeader>
        </AppHeaderNav>
        <TransferPanel
          allTabs={uiProps.allTabs}
          defaultTab={uiProps.defaultTab}
          isStayOnCall={uiProps.isStayOnCall}
          isTransferring={uiProps.isTransferring}
          isDisabled={uiProps.isDisabled}
          agentList={uiProps.agentList}
          phoneBook={uiProps.phoneBook}
          selectedAgentId={uiProps.selectedAgentId}
          selectedPhoneBookIndex={uiProps.selectedPhoneBookIndex}
          manualEntryNumber={uiProps.manualEntryNumber}
          queueGroups={uiProps.queueGroups}
          selectedQueueGroupId={uiProps.selectedQueueGroupId}
          selectedGateId={uiProps.selectedGateId}
          onTabChange={uiFunctions.onTabChange}
          onStayOnCallChange={uiFunctions.onStayOnCallChange}
          onSelectAgent={uiFunctions.onSelectAgent}
          onSelectPhoneBookContact={uiFunctions.onSelectPhoneBookContact}
          onManualEntryChange={uiFunctions.onManualEntryChange}
          onQueueGroupChange={uiFunctions.onQueueGroupChange}
          onGateChange={uiFunctions.onGateChange}
          onTransfer={uiFunctions.onTransfer}
          onCancel={uiFunctions.onCancel}
          fetchAgentList={uiFunctions.fetchAgentList}
        />
        <AppFooterNav />
      </>
    );
  }
}

export { TransferView };
