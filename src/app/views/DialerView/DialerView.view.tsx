import {
  action,
  injectable,
  optional,
  RcViewModule,
  state,
  storage,
  StoragePlugin,
  useConnector,
  delegate,
  PortManager,
  RouterPlugin,
} from '@ringcentral-integration/next-core';
import type { UIFunctions, UIProps } from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import {
  DialTextField,
  DialPad,
  DialerPadSoundsMPEG,
  CallButton,
  Button,
  IconButton,
  Link,
  ListItem,
  ListItemText,
} from '@ringcentral/spring-ui';
import { BackspaceMd, EnterMd } from '@ringcentral/spring-icon';
import React, { useRef } from 'react';

import { EvCall } from '../../services/EvCall';
import { EvAuth } from '../../services/EvAuth';
import { EvSettings } from '../../services/EvSettings';
import { EvClient } from '../../services/EvClient';
import { EvCallMonitor } from '../../services/EvCallMonitor';
import { EvWorkingState } from '../../services/EvWorkingState';
import type {
  DialerViewOptions,
  DialerViewProps,
  DialerViewUIProps,
  DialerViewUIFunctions,
  DirectoryRecord,
  SearchDirectoryResponse,
} from './DialerView.interface';
import i18n from './i18n';
import type { I18nKey } from './i18n';

const SEARCH_DEBOUNCE_MS = 400;
// `*` and `#` are allowed to lead so that star codes typed on the keypad
// (`*67`, `*82`, …) count as dialable. Directory names never start with them.
const PHONE_NUMBER_PATTERN = /^[+\d*#][\d\s()\-+*#]*$/;

/**
 * DialerView - Phone dialer view for outbound calls
 * Displays phone number input field and call button
 */
@injectable({
  name: 'DialerView',
})
class DialerView extends RcViewModule {
  constructor(
    private evCall: EvCall,
    private evAuth: EvAuth,
    private evSettings: EvSettings,
    private evClient: EvClient,
    private evCallMonitor: EvCallMonitor,
    private evWorkingState: EvWorkingState,
    private router: RouterPlugin,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional('DialerViewOptions') private dialerViewOptions?: DialerViewOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    if (this.portManager?.shared) {
      this.portManager.onServer(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  @storage
  @state
  toNumber = '';

  @storage
  @state
  latestDialoutNumber = '';

  @state
  directoryRecords: DirectoryRecord[] = [];

  @state
  directoryMainNumber = '';

  @state
  isSearchingDirectory = false;

  private _searchDebounceTimer?: ReturnType<typeof setTimeout>;

  /**
   * Check if agent has permission to make manual calls
   */
  get hasDialer(): boolean {
    return !!this.evAuth.agentPermissions?.allowManualCalls;
  }

  /**
   * Check if dialout status is idle
   */
  get isIdle(): boolean {
    return this.evCall.isIdle;
  }

  /**
   * Check if the current input looks like a phone number (no letters)
   */
  get isToNumberPhoneNumber(): boolean {
    const value = this.toNumber.trim();
    return !!value && PHONE_NUMBER_PATTERN.test(value);
  }

  /**
   * The keypad and call button yield the panel to directory results
   */
  get showKeypad(): boolean {
    return this.directoryRecords.length === 0;
  }

  @action
  _setToNumber(value: string): void {
    this.toNumber = value;
  }

  @delegate('server')
  async setToNumber(value: string): Promise<void> {
    this._setToNumber(value);
    this._scheduleDirectorySearch(value);
  }

  /**
   * Append a keypad key to the input.
   *
   * The keypad can only emit digits, `*`, `#` and `+`, so there is nothing to
   * look up: this never searches the directory and drops any results left over
   * from earlier keyboard input. Appending happens here rather than in the
   * component so that rapid presses cannot drop a key while state syncs back
   * to the calling port.
   */
  @delegate('server')
  async appendToNumber(key: string): Promise<void> {
    this._setToNumber(this.toNumber + key);
    this._cancelDirectorySearch();
    this.clearDirectoryResults();
  }

  @action
  setLatestDialoutNumber(): void {
    this.latestDialoutNumber = this.toNumber;
  }

  @action
  setDirectoryResults(records: DirectoryRecord[], mainNumber: string): void {
    this.directoryRecords = records;
    this.directoryMainNumber = mainNumber;
  }

  @action
  clearDirectoryResults(): void {
    this.directoryRecords = [];
    this.directoryMainNumber = '';
    this.isSearchingDirectory = false;
  }

  @action
  setSearchingDirectory(isSearching: boolean): void {
    this.isSearchingDirectory = isSearching;
  }

  @action
  reset(): void {
    this.toNumber = '';
    this.latestDialoutNumber = '';
    this.directoryRecords = [];
    this.directoryMainNumber = '';
    this.isSearchingDirectory = false;
  }

  initialize(): void {
    this.evAuth.beforeAgentLogout(() => {
      this._cancelDirectorySearch();
      this.reset();
    });
  }

  /**
   * Drop any pending debounced directory search
   */
  private _cancelDirectorySearch(): void {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = undefined;
    }
  }

  /**
   * Debounce directory search on input changes
   */
  private _scheduleDirectorySearch(searchString: string): void {
    this._cancelDirectorySearch();
    const trimmed = searchString.trim();
    if (!trimmed) {
      this.clearDirectoryResults();
      return;
    }
    this._searchDebounceTimer = setTimeout(() => {
      this._performDirectorySearch(trimmed);
    }, SEARCH_DEBOUNCE_MS);
  }

  /**
   * Query the corporate directory and store results
   */
  private async _performDirectorySearch(searchString: string): Promise<void> {
    this.setSearchingDirectory(true);
    try {
      const authorized = await this.evAuth.refreshEvToken();
      if (!authorized) {
        return;
      }
      // Ignore stale responses if the input changed while authenticating
      if (this.toNumber.trim() !== searchString) {
        return;
      }
      const response: SearchDirectoryResponse =
        await this.evClient.searchDirectory(searchString);
      // Ignore stale responses if the input changed while searching
      if (this.toNumber.trim() !== searchString) {
        return;
      }
      this.setDirectoryResults(
        response?.records ?? [],
        response?.mainNumber ?? '',
      );
    } catch (error) {
      if (this.toNumber.trim() === searchString) {
        this.clearDirectoryResults();
      }
    } finally {
      if (this.toNumber.trim() === searchString) {
        this.setSearchingDirectory(false);
      }
    }
  }

  /**
   * Initiate an outbound call.
   *
   * The call button is never shown disabled, so this is also the guard: an
   * empty field does nothing, and letters mean the user is searching the
   * directory rather than dialling, so that does nothing either instead of
   * placing a call that cannot connect.
   */
  @delegate('server')
  async dialout(): Promise<void> {
    if (!this.toNumber || !this.isToNumberPhoneNumber) {
      return;
    }
    this.setLatestDialoutNumber();
    await this.evCall.dialout(this.toNumber);
  }

  /**
   * Dial a corporate directory record using the main_number*extension@RC_EXT format
   */
  @delegate('server')
  async dialDirectoryRecord(record: DirectoryRecord): Promise<void> {
    const mainNumber =
      record.account?.mainNumber?.phoneNumber || this.directoryMainNumber;
    if (!mainNumber || !record.extensionNumber) {
      return;
    }
    const destination = `${mainNumber}*${record.extensionNumber}@RC_EXT`;
    await this.evCall.dialout(destination, { skipParse: true });
  }

  /**
   * Cancel the current outbound call
   */
  @delegate('server')
  async hangup(): Promise<void> {
    await this.evCall.outdialCancel();
    if (!this.evSettings.isManualOffhook) {
      await this.evClient.offhookTerm();
    }
  }

  /**
   * Navigate to manual dial settings page
   */
  goToManualDialSettings(): void {
    this.router.push('/settings/manualDial');
  }

  /**
   * Get reactive UI state props for the component
   */
  getUIProps(): UIProps<DialerViewUIProps> {
    return {
      toNumber: this.toNumber,
      hasDialer: this.hasDialer,
      isIdle: this.isIdle,
      isOnCall: this.evCallMonitor.isOnCall,
      isPendingDisposition: this.evWorkingState.isPendingDisposition,
      directoryRecords: this.directoryRecords,
      isSearchingDirectory: this.isSearchingDirectory,
      isToNumberPhoneNumber: this.isToNumberPhoneNumber,
      showKeypad: this.showKeypad,
    };
  }

  /**
   * Get stable UI action functions for the component
   */
  getUIFunctions(): UIFunctions<DialerViewUIFunctions> {
    return {
      onBackspace: () => {
        this.setToNumber(this.toNumber.slice(0, -1));
      },
      onDial: async () => {
        await this.dialout();
      },
      onHangup: () => {
        this.hangup();
      },
      onInputChange: (value: string) => {
        this.setToNumber(value);
      },
      onKeypadPress: (key: string) => {
        this.appendToNumber(key);
      },
      onGoToSettings: () => {
        this.goToManualDialSettings();
      },
      onDialDirectoryRecord: (record: DirectoryRecord) => {
        this.dialDirectoryRecord(record);
      },
    };
  }

  component(_props?: DialerViewProps) {
    const { t } = useLocale(i18n);
    const { current: uiFunctions } = useRef(this.getUIFunctions());

    const {
      toNumber,
      hasDialer,
      isIdle,
      isOnCall,
      isPendingDisposition,
      directoryRecords,
      isSearchingDirectory,
      isToNumberPhoneNumber,
      showKeypad,
    } = useConnector(() => this.getUIProps());

    if (!hasDialer) {
      return null;
    }

    if (isPendingDisposition || !isIdle || isOnCall) {
      return (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-neutral-base p-4">
          <div className="flex-1 flex flex-col justify-center items-center">
            {isPendingDisposition ? (
              <p
                className="typography-descriptor text-neutral-b2 text-center"
                data-sign="callBusyTip"
              >
                {t('pendingDispositionTip')}
              </p>
            ) : (
              <>
                <p
                  className="typography-descriptor text-neutral-b2 text-center"
                  data-sign="callBusyTip"
                >
                  {t('callInProgressTip')}
                </p>
                <div className="flex justify-center mt-4">
                  <Button
                    size="large"
                    onClick={uiFunctions.onHangup}
                    data-sign="hangupButton"
                    color="danger"
                  >
                    {t('hangupButton')}
                  </Button>
                </div>
              </>
            )}
          </div>
          {this._renderSettingsLink(t, uiFunctions)}
        </div>
      );
    }

    const hasInput = !!toNumber;

    return (
      // `flex-1 min-h-0`, not `h-full`: SyncTabView's TabContext renders no DOM
      // node, so this is a direct flex child of AppView's column alongside the
      // header nav and the tab bar. Claiming 100% height there overflows the
      // column by the height of those siblings and pushes the settings link
      // out of view. Filling the remaining space instead lets the keypad
      // region absorb the difference.
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-neutral-base">
        <div className="px-4 pt-2 [&_input]:text-center flex justify-center">
          <DialTextField
            value={toNumber}
            onChange={uiFunctions.onInputChange}
            placeholder={t('enterNumber')}
            inputProps={{
              'data-sign': 'dialerInput',
            }}
            startAdornment={
              hasInput && (
                <IconButton
                  symbol={BackspaceMd}
                  size="large"
                  variant="icon"
                  className="invisible pointer-events-none"
                />
              )
            }
            endAdornment={
              hasInput && (
                <IconButton
                  symbol={BackspaceMd}
                  size="large"
                  variant="icon"
                  onClick={uiFunctions.onBackspace}
                  data-sign="backspaceButton"
                />
              )
            }
          />
        </div>
        {showKeypad ? (
          <>
            {/* Reserved whether or not a search is running. The keypad below
                takes the remaining height, so rendering this row conditionally
                would resize the pad the moment the status appears. Keeping the
                row in the fixed chrome holds the pad at one size. */}
            <div className="h-4 flex-shrink-0 px-4 text-center leading-4">
              {hasInput && isSearchingDirectory && (
                <span
                  className="typography-descriptor text-neutral-b2"
                  data-sign="directoryStatus"
                >
                  {t('searchingDirectory')}
                </span>
              )}
            </div>
            {/* Keypad + call button block, matching micro-phone's DialerPage:
                a fixed `size="medium"` pad (200x248, 56px keys) whose `gap-y-2`
                replaces the pad's default percentage `gap`. The fixed row gap
                matters beyond spacing -- a percentage row-gap resolves against
                the pad's own height, so it only stays self-consistent while
                nothing constrains that height.
                Two deliberate departures from the reference:
                - `min-h-0 overflow-y-auto`, because this panel is shorter than
                  micro-phone's. The block is a fixed 312px and scrolls here
                  rather than pushing the settings link out of the tab.
                - no `<Dialer>` wrapper, and an explicit `onChange`. That
                  context auto-inserts keys into the DialTextField, which would
                  route keypad presses through onInputChange and trigger a
                  directory search. Keeping the two paths separate is what
                  makes keypad input skip the search. */}
            <main
              className="px-10 pb-2 flex flex-col items-center flex-auto min-h-0 overflow-y-auto"
              data-sign="dialerKeypad"
            >
              <DialPad
                size="medium"
                className="gap-y-2"
                onChange={uiFunctions.onKeypadPress}
                sounds={DialerPadSoundsMPEG}
                data-sign="dialerDialPad"
              />
              <div className="flex justify-center items-center pt-2">
                <CallButton
                  variant="start"
                  size="medium"
                  onClick={uiFunctions.onDial}
                  data-sign="callButton"
                  TooltipProps={{ title: t('callButton') }}
                />
              </div>
            </main>
          </>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto mt-2">
            {/* The keypad hosts the dial action, so the raw number is only
                offered as a list row once directory results hide the keypad */}
            {isToNumberPhoneNumber && (
              <ListItem
                size="large"
                onClick={uiFunctions.onDial}
                data-sign="requestACall"
                hoverActions={<IconButton symbol={EnterMd} variant="icon" />}
                alwaysShowHoverActions
              >
                <ListItemText
                  primary={t('requestACall')}
                  secondary={toNumber}
                />
              </ListItem>
            )}
            <div
              className="typography-label uppercase text-neutral-b3 px-4 pt-3 pb-1"
              data-sign="corporateDirectoryHeader"
            >
              {t('corporateDirectory')}
            </div>
            {directoryRecords.map((record) => (
              <ListItem
                key={record.id}
                size="large"
                onClick={() => uiFunctions.onDialDirectoryRecord(record)}
                data-sign="directoryRecord"
              >
                <ListItemText
                  primary={this._formatRecordName(record)}
                  secondary={`Ext. ${record.extensionNumber}`}
                />
              </ListItem>
            ))}
          </div>
        )}
        {this._renderSettingsLink(t, uiFunctions)}
      </div>
    );
  }

  /**
   * Build a display name for a directory record
   */
  private _formatRecordName(record: DirectoryRecord): string {
    const fullName = [record.firstName, record.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
    return fullName || record.name || record.extensionNumber;
  }

  /**
   * Render the bottom manual dial settings link
   */
  private _renderSettingsLink(
    t: (key: I18nKey) => string,
    uiFunctions: UIFunctions<DialerViewUIFunctions>,
  ) {
    return (
      <div className="text-center py-0.5 flex-shrink-0">
        <Link
          onClick={uiFunctions.onGoToSettings}
          data-sign="manualDialSettings"
          className="typography-descriptor"
        >
          {t('manualDialSettings')}
        </Link>
      </div>
    );
  }
}

export { DialerView };
