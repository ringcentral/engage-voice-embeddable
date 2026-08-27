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
import {
  EvDirectorySearch,
  directorySearchScopes,
  formatDirectoryRecordName,
  type DirectoryRecord,
} from '../../services/EvDirectorySearch';
import { isDialableNumberInput } from '../../../lib/isDialableNumberInput';
import { formatPhoneNumber } from '../../../lib/FormatPhoneNumber';
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
    private _evDirectorySearch: EvDirectorySearch,
    private _router: RouterPlugin,
    @optional('TransferViewOptions')
    private _options?: TransferViewOptions,
  ) {
    super();
  }

  private readonly _searchScope = directorySearchScopes.transferManualEntry;

  @state
  private _manualEntryNumber = '';

  /**
   * Only the id is kept, not the record: a selection is meaningful just while
   * the record is still in the result list, so looking it up on read means a
   * new search or a cleared list drops the selection with no extra bookkeeping.
   */
  @state
  private _selectedDirectoryRecordId: string | null = null;

  /**
   * Whether the current input was entered on the keypad rather than typed.
   * Decides whether directory results are allowed to take over the tab body.
   */
  @state
  private _isInputFromKeypad = false;

  @action
  private _setInputFromKeypad(fromKeypad: boolean) {
    this._isInputFromKeypad = fromKeypad;
  }

  @action
  private _setManualEntryNumber(value: string) {
    this._manualEntryNumber = value;
  }

  @action
  private _setSelectedDirectoryRecordId(id: string | null) {
    this._selectedDirectoryRecordId = id;
  }

  get manualEntryDirectoryRecords(): DirectoryRecord[] {
    return this._evDirectorySearch.getRecords(this._searchScope);
  }

  get selectedDirectoryRecordId(): string | null {
    return this.selectedDirectoryRecord?.id ?? null;
  }

  get selectedDirectoryRecord(): DirectoryRecord | null {
    if (!this._selectedDirectoryRecordId) return null;
    return (
      this.manualEntryDirectoryRecords.find(
        (record) => record.id === this._selectedDirectoryRecordId,
      ) ?? null
    );
  }

  get isSearchingDirectory(): boolean {
    return this._evDirectorySearch.isSearching(this._searchScope);
  }

  /**
   * The keypad yields the tab body to directory results, except while the agent
   * is entering on the pad itself: pad input searches now, so without that
   * exception the list would appear mid-entry and pull the pad out from under
   * the next keypress. Entering on the pad surfaces an exact extension match as
   * a name above it instead, while typing keeps the full pickable list.
   */
  get showManualEntryKeypad(): boolean {
    return (
      this._isInputFromKeypad ||
      !this._evDirectorySearch.hasResults(this._searchScope)
    );
  }

  /**
   * The directory member whose extension is exactly what has been typed. This
   * is what makes a keypad-entered extension transferable: on its own it is not
   * a routable destination.
   */
  get matchedDirectoryRecord(): DirectoryRecord | null {
    return this._evDirectorySearch.findExactExtensionMatch(
      this._searchScope,
      this._manualEntryNumber,
    );
  }

  get matchedDirectoryName(): string {
    const record = this.matchedDirectoryRecord;
    return record ? formatDirectoryRecordName(record) : '';
  }

  /**
   * A name in the field means the agent is searching the directory rather than
   * entering a destination. Transferring it would hand it to `parseNumber`,
   * which throws, so the typed value only counts once it looks dialable.
   */
  get isManualEntryDialable(): boolean {
    return isDialableNumberInput(this._manualEntryNumber);
  }

  /**
   * What the manual tab would transfer to right now, or null if there is
   * nothing usable.
   *
   * A record the agent picked from the list wins over the typed text, since the
   * text is only the search query that produced it. Failing that, an extension
   * typed on the keypad resolves through its exact directory match, because the
   * digits alone are not a routable destination. A plain phone number is used
   * as typed.
   */
  get manualEntryDestination(): { value: string; skipParse: boolean } | null {
    const record = this.selectedDirectoryRecord ?? this.matchedDirectoryRecord;
    if (record) {
      const destination = this._evDirectorySearch.buildRecordDestination(
        this._searchScope,
        record,
      );
      if (destination) {
        return { value: destination, skipParse: true };
      }
    }
    return this.isManualEntryDialable
      ? { value: this._manualEntryNumber, skipParse: false }
      : null;
  }

  /**
   * Who the Transfer button would transfer to, named where the directory knows
   * them. Empty on the other tabs, whose destination is already spelled out in
   * the tab itself, and empty when there is nothing transferable.
   */
  get transferDestinationLabel(): string {
    if (this._evTransferCall.transferType !== transferTypes.manualEntry) {
      return '';
    }
    // A record is labelled by name and extension rather than by the field,
    // which for a name search holds the query text, not a number
    const record = this.selectedDirectoryRecord ?? this.matchedDirectoryRecord;
    if (record) {
      return [formatDirectoryRecordName(record), record.extensionNumber]
        .filter(Boolean)
        .join(' ');
    }
    return this.isManualEntryDialable
      ? formatPhoneNumber({ phoneNumber: this._manualEntryNumber.trim() })
      : '';
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
    this._setSelectedDirectoryRecordId(null);
    this._setInputFromKeypad(false);
    this._evTransferCall.changeTransferType(transferTypes.manualEntry);
    this._evDirectorySearch.search(this._searchScope, value);
  }

  /**
   * Pick a directory record as the transfer destination.
   *
   * Selecting only marks the row: the footer Transfer button issues the
   * transfer, like the agent and phone book tabs. The pending search is
   * cancelled so a late response cannot drop the record out of the list and
   * silently unselect it.
   */
  @delegate('server')
  async selectDirectoryRecord(record: DirectoryRecord): Promise<void> {
    this._evDirectorySearch.cancel(this._searchScope);
    this._setSelectedDirectoryRecordId(record.id);
    this._evTransferCall.changeTransferType(transferTypes.manualEntry);
  }

  /**
   * Append a keypad key to the manual entry field.
   *
   * Keypad input searches the directory just like typing does: an extension
   * entered on the pad is only transferable once the search has resolved it to
   * a member. Appending happens here rather than in the component so that rapid
   * presses cannot drop a key while state syncs back to the client port.
   */
  @delegate('server')
  async appendManualEntryKey(key: string): Promise<void> {
    const value = this._manualEntryNumber + key;
    this._setManualEntryNumber(value);
    this._setSelectedDirectoryRecordId(null);
    this._setInputFromKeypad(true);
    this._evTransferCall.changeTransferType(transferTypes.manualEntry);
    this._evDirectorySearch.search(this._searchScope, value);
  }

  /**
   * Slicing runs on the server so it reads the authoritative value. The input
   * source is deliberately left alone: correcting a keypad entry should not
   * flip the tab over to the result list mid-correction.
   */
  @delegate('server')
  async backspaceManualEntry(): Promise<void> {
    const value = this._manualEntryNumber.slice(0, -1);
    this._setManualEntryNumber(value);
    this._setSelectedDirectoryRecordId(null);
    this._evTransferCall.changeTransferType(transferTypes.manualEntry);
    this._evDirectorySearch.search(this._searchScope, value);
  }

  @delegate('server')
  async clearManualEntry(): Promise<void> {
    await this.setManualEntryNumber('');
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

  /** Whether a transfer can be issued right now, regardless of destination */
  private get _canTransferNow(): boolean {
    return (
      !this._evTransferCall.transferring &&
      !this._evRequeueCall.requeuing &&
      !this._evCall.currentCall?.endedCall
    );
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
    that._selectedDirectoryRecordId,
    that.manualEntryDirectoryRecords,
    that.isSearchingDirectory,
    that._evRequeueCall.selectedGateId,
    that._evTransferCall.transferring,
    that._evRequeueCall.requeuing,
    that._evCall.currentCall,
  ])
  get isTransferDisabled(): boolean {
    const { transferType } = this._evTransferCall;
    if (!this._canTransferNow) return true;
    switch (transferType) {
      case transferTypes.internal:
        return !this._evTransferCall.transferAgentId;
      case transferTypes.phoneBook:
        return this._evTransferCall.transferPhoneBookSelectedIndex === null;
      case transferTypes.manualEntry:
        // A search in flight means the destination is not settled yet: the
        // extension being typed resolves to a member only once results land, so
        // transferring now would either be rejected or go to the previous
        // query's match.
        return this.isSearchingDirectory || !this.manualEntryDestination;
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
          const destination = this.manualEntryDestination;
          if (!destination) return;
          // A picked directory record is a fully-qualified EV destination and
          // skips the parser; a typed number goes through it as before
          this._evTransferCall.changeRecipientNumber(destination.value, {
            skipParse: destination.skipParse,
          });
          this._evDirectorySearch.cancel(this._searchScope);
        }
        await this._evTransferCall.transfer();
      }
      // Only on success: a failed transfer keeps the destination so the agent
      // can retry it. Without this the number outlives the call, and the panel
      // opened on the previous transfer's input for the next one.
      this._resetManualEntry();
      this._returnToActiveCall();
    } catch (error) {
      this.logger.error('Transfer failed:', error);
    }
  }

  /** Drop the manual tab's destination: typed number, pick and search results */
  private _resetManualEntry(): void {
    this._setManualEntryNumber('');
    this._setSelectedDirectoryRecordId(null);
    this._setInputFromKeypad(false);
    this._evDirectorySearch.clear(this._searchScope);
  }

  /**
   * A transfer with 'Stay on call' off ends the agent's call, and Redirect
   * routes to the disposition page from its own `onCallEnded` handler. That can
   * land before the transfer request resolves, so only navigate while the
   * transfer page is still the current route: otherwise this replaces the
   * disposition page with the active call page for a call that has already
   * ended, leaving the user on a call they cannot hang up.
   */
  private _returnToActiveCall(): void {
    if (!/^\/activityCallLog\/.+\/transferCall$/.test(this._router.currentPath)) {
      return;
    }
    this._router.replace(`/activityCallLog/${this.callId}`);
  }

  @delegate('server')
  async cancelTransfer(): Promise<void> {
    this._evTransferCall.resetTransferStatus();
    this._resetManualEntry();
    this._options?.onCancel?.();
    this._router.replace(`/activityCallLog/${this.callId}`);
  }

  @delegate('server')
  async goBack(): Promise<void> {
    this._router.replace(`/activityCallLog/${this.callId}`);
  }

  /**
   * Also covers mount: TransferPanel reports its initially active tab through
   * `onTabChange`, so opening the page always starts with an empty result list
   * even though `_manualEntryNumber` survives between visits.
   */
  @delegate('server')
  async handleTabChange(type: EvTransferType): Promise<void> {
    this._setSelectedDirectoryRecordId(null);
    this._evDirectorySearch.clear(this._searchScope);
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
      manualEntryDirectoryRecords: this.manualEntryDirectoryRecords,
      selectedDirectoryRecordId: this.selectedDirectoryRecordId,
      matchedDirectoryName: this.matchedDirectoryName,
      transferDestinationLabel: this.transferDestinationLabel,
      isSearchingDirectory: this.isSearchingDirectory,
      showManualEntryKeypad: this.showManualEntryKeypad,
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
      onManualEntryKeypadPress: (key) => this.appendManualEntryKey(key),
      onManualEntryBackspace: () => this.backspaceManualEntry(),
      onManualEntryClear: () => this.clearManualEntry(),
      onSelectDirectoryRecord: (record) => this.selectDirectoryRecord(record),
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
          manualEntryDirectoryRecords={uiProps.manualEntryDirectoryRecords}
          selectedDirectoryRecordId={uiProps.selectedDirectoryRecordId}
          matchedDirectoryName={uiProps.matchedDirectoryName}
          transferDestinationLabel={uiProps.transferDestinationLabel}
          isSearchingDirectory={uiProps.isSearchingDirectory}
          showManualEntryKeypad={uiProps.showManualEntryKeypad}
          queueGroups={uiProps.queueGroups}
          selectedQueueGroupId={uiProps.selectedQueueGroupId}
          selectedGateId={uiProps.selectedGateId}
          onTabChange={uiFunctions.onTabChange}
          onStayOnCallChange={uiFunctions.onStayOnCallChange}
          onSelectAgent={uiFunctions.onSelectAgent}
          onSelectPhoneBookContact={uiFunctions.onSelectPhoneBookContact}
          onManualEntryChange={uiFunctions.onManualEntryChange}
          onManualEntryKeypadPress={uiFunctions.onManualEntryKeypadPress}
          onManualEntryBackspace={uiFunctions.onManualEntryBackspace}
          onManualEntryClear={uiFunctions.onManualEntryClear}
          onSelectDirectoryRecord={uiFunctions.onSelectDirectoryRecord}
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
