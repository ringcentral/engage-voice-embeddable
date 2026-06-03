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
  watch,
  PortManager,
  RouterPlugin,
} from '@ringcentral-integration/next-core';
import type { UIFunctions, UIProps } from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import {
  DialTextField,
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
const PHONE_NUMBER_PATTERN = /^[+\d][\d\s()\-+*#]*$/;

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

  @action
  _setToNumber(value: string): void {
    this.toNumber = value;
  }

  @delegate('server')
  async setToNumber(value: string): Promise<void> {
    this._setToNumber(value);
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
      this.reset();
    });
    watch(
      this,
      () => this.toNumber,
      () => {
        this._scheduleDirectorySearch(this.toNumber);
      },
    );
  }

  /**
   * Debounce directory search on input changes
   */
  private _scheduleDirectorySearch(searchString: string): void {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
    }
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
   * Initiate an outbound call with redial support
   */
  @delegate('server')
  async dialout(): Promise<void> {
    if (this.toNumber) {
      this.setLatestDialoutNumber();
    } else if (this.latestDialoutNumber) {
      this.setToNumber(this.latestDialoutNumber);
      return;
    }
    if (this.toNumber) {
      await this.evCall.dialout(this.toNumber);
    }
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
    } = useConnector(() => this.getUIProps());

    if (!hasDialer) {
      return null;
    }

    if (isPendingDisposition || !isIdle || isOnCall) {
      return (
        <div className="flex flex-col h-full bg-neutral-base p-4">
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
      <div className="flex flex-col h-full bg-neutral-base">
        <div className="px-4 pt-4 [&_input]:text-center flex justify-center">
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
        {!hasInput ? (
          <>
            <div className="px-4 mt-3 text-center">
              <p
                className="typography-descriptor text-neutral-b2"
                data-sign="callButtonTip"
              >
                {t('callButtonTip')}
              </p>
              <p
                className="typography-descriptor text-neutral-b2 mt-2"
                data-sign="callButtonEmergencyTip"
              >
                {t('callButtonEmergencyTip')}
              </p>
            </div>
            <div className="flex-1" />
          </>
        ) : (
          <div className="flex-1 overflow-y-auto mt-2">
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
            {directoryRecords.length > 0 && (
              <div
                className="typography-label uppercase text-neutral-b3 px-4 pt-3 pb-1"
                data-sign="corporateDirectoryHeader"
              >
                {t('corporateDirectory')}
              </div>
            )}
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
            {directoryRecords.length === 0 && isSearchingDirectory && (
              <div
                className="typography-descriptor text-neutral-b2 text-center px-4 py-3"
                data-sign="directoryStatus"
              >
                {t('searchingDirectory')}
              </div>
            )}
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
      <div className="text-center pb-2 pt-2">
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
