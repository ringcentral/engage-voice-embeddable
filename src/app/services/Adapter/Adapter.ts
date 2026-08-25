import { Toast } from '@ringcentral-integration/micro-core/src/app/services';
import {
  action,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
  PortManager,
  watch,
  delegate,
} from '@ringcentral-integration/next-core';
import MessageTransport from '@ringcentral-integration/commons/lib/MessageTransport';
import { adapterMessageTypes } from '../../../enums';
import { t } from './i18n';
import { EvAuth } from '../EvAuth';
import { EvCall } from '../EvCall';
import { EvLeads } from '../EvLeads';
import { EvPresence } from '../EvPresence';
import { EvAgentSession } from '../EvAgentSession';
import { TabManager } from '../EvTabManager';
import { EvSubscription } from '../EvSubscription';
import { EvCallbackTypes } from '../EvClient/enums';
import { DialerView } from '../../views/DialerView';

/**
 * Adapter options for configuration
 */
export interface AdapterOptions {
  targetWindow?: Window;
}

/**
 * Size state
 */
export interface AdapterSize {
  width: number;
  height: number;
}

/**
 * Position state
 */
export interface AdapterPosition {
  translateX: number | null;
  translateY: number | null;
  minTranslateX: number | null;
  minTranslateY: number | null;
}

/**
 * Frame width used while a side widget is open: the 300px main column plus the
 * 360px expanded area.
 */
export const EXPANDED_APP_WIDTH = 660;

/** Frame width used while no side widget is open. */
export const DEFAULT_APP_WIDTH = 300;

/** Default frame height. */
export const DEFAULT_APP_HEIGHT = 540;

/**
 * The default frame height before the dialer gained a keypad. Sessions still
 * sitting on exactly this value are migrated up to `DEFAULT_APP_HEIGHT`.
 */
export const LEGACY_APP_HEIGHT = 500;

/**
 * Lead properties for dialLead lookup
 */
export interface LeadProps {
  leadId?: string;
  requestId?: string;
  externId?: string;
}

/**
 * Manual pass lead parameters
 */
export interface ManualPassLeadParams {
  callbackDTS?: string;
  [key: string]: any;
}

/**
 * Adapter module - Parent window communication
 * Handles click-to-dial, environment changes, and adapter state
 */
@injectable({
  name: 'Adapter',
})
class Adapter extends RcModule {
  /**
   * Public message types for external use
   */
  public messageTypes = adapterMessageTypes;

  /**
   * Public transport for message communication
   */
  public transport!: MessageTransport;

  private _lastClosed: boolean = false;
  private _lastMinimized: boolean = false;
  private _lastSize: Partial<AdapterSize> = {};
  private _lastPosition: any = {};
  private _sizeBeforeExpanded: AdapterSize | null = null;
  private _isExpanded = false;
  private _staleExpandedWidthChecked = false;

  constructor(
    private evAuth: EvAuth,
    private evCall: EvCall,
    private evLeads: EvLeads,
    private evPresence: EvPresence,
    private evAgentSession: EvAgentSession,
    private evSubscription: EvSubscription,
    private tabManager: TabManager,
    private toast: Toast,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional() private dialerView?: DialerView,
    @optional('AdapterOptions') private adapterOptions?: AdapterOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    if (this.portManager?.shared) {
      this.portManager.onClient(() => {
        this.initializeClient();
      });
      this.portManager.onServer(() => {
        this.initializeServer();
      });
    } else {
      this.initializeClient();
      this.initializeServer();
    }
  }

  /**
   * Initialize adapter - setup transport, listeners, and state watcher
   */
  initializeClient(): void {
    if (typeof window === 'undefined') return;
    this.transport = new MessageTransport({
      targetWindow: this.adapterOptions?.targetWindow ?? window.parent,
    } as any);
    this.addListeners();
    this._setupStateWatcher();
  }

  /**
   * Subscribe to SIP lifecycle events and forward them to the parent window
   */
  initializeServer(): void {
    // Runs on whichever port owns the state. `onRehydrated` fires immediately
    // when storage has already been restored, so registering late is safe.
    this.storagePlugin.onRehydrated(() => {
      this._migrateStoredHeight();
    });
    this.evSubscription.subscribe(EvCallbackTypes.SIP_REGISTERED, () => {
      this.onSIPRegistered();
    });
    this.evSubscription.subscribe(EvCallbackTypes.SIP_UNREGISTERED, () => {
      this.onSIPUnregistered();
    });
    this.evSubscription.subscribe(EvCallbackTypes.SIP_UNSTABLE_CONNECTION, () => {
      this.onSIPUnstable();
    });
    this.evSubscription.subscribe(EvCallbackTypes.SIP_REGISTRATION_FAILED, () => {
      this.onSIPFailed();
    });
  }

  @storage
  @state
  closed = false;

  @storage
  @state
  minimized = false;

  @storage
  @state
  size: AdapterSize = {
    width: DEFAULT_APP_WIDTH,
    height: DEFAULT_APP_HEIGHT,
  };

  @storage
  @state
  position: AdapterPosition = {
    translateX: null,
    translateY: null,
    minTranslateX: null,
    minTranslateY: null,
  };

  @action
  _setClosed(closed: boolean) {
    this.closed = closed;
  }

  @delegate('server')
  async setClosed(closed: boolean): Promise<void> {
    this._setClosed(closed);
  }

  @action
  _setMinimized(minimized: boolean) {
    this.minimized = minimized;
  }

  @delegate('server')
  async setMinimized(minimized: boolean): Promise<void> {
    this._setMinimized(minimized);
  }

  @action
  _setSize(size: AdapterSize) {
    this.size = size;
  }

  /**
   * Raise sessions still on the pre-keypad default frame height.
   *
   * `size` is persisted, so bumping `DEFAULT_APP_HEIGHT` only reaches new
   * installs -- everyone else keeps 500 and a cramped dialer keypad. Runs once
   * per store rehydration, before the host is told anything, so the frame comes
   * up at the new height rather than visibly resizing.
   *
   * Only the exact legacy default is touched: any other height is a deliberate
   * drag-resize and is not ours to override. A user who happened to resize to
   * exactly 500 is indistinguishable from an untouched default and gets the
   * extra 40px too, which is the intended outcome either way.
   */
  private _migrateStoredHeight(): void {
    if (this.size.height !== LEGACY_APP_HEIGHT) {
      return;
    }
    this._setSize({ ...this.size, height: DEFAULT_APP_HEIGHT });
  }

  @delegate('server')
  async setSize(size: AdapterSize): Promise<void> {
    this._setSize(
      this._isExpanded && size.width < EXPANDED_APP_WIDTH
        ? {
            ...size,
            width: EXPANDED_APP_WIDTH,
          }
        : size,
    );
  }

  /**
   * Widen the host frame while a side widget is open, and restore the previous
   * size when the last one closes. Driven by `SideWidget`.
   */
  @delegate('server')
  async setExpanded(expanded: boolean): Promise<void> {
    if (expanded) {
      if (!this._isExpanded) {
        this._sizeBeforeExpanded = { ...this.size };
        this._isExpanded = true;
      }

      // Size sync messages can arrive after the side widget mounts. Do not let
      // a late 300px host size collapse the expanded area, and make an
      // idempotent expansion call repair the width if it was changed outside
      // this module.
      if (this.size.width < EXPANDED_APP_WIDTH) {
        this._setSize({
          ...this.size,
          width: EXPANDED_APP_WIDTH,
        });
      }
      return;
    }

    if (!this._isExpanded) {
      // `size` is persisted but `_isExpanded` is not, so a worker restart while
      // expanded rehydrates a 660px frame that nothing owns any more. Give the
      // width back instead of leaving the host stuck wide with no widget in it.
      //
      // Only once, and only before this instance has expanded anything: past
      // that point a frame this wide is the user's own doing (a drag-resize
      // arrives as `syncSize`) and is not ours to reset.
      if (!this._staleExpandedWidthChecked) {
        this._staleExpandedWidthChecked = true;
        if (this.size.width >= EXPANDED_APP_WIDTH) {
          this._setSize({ ...this.size, width: DEFAULT_APP_WIDTH });
        }
      }
      return;
    }

    this._isExpanded = false;
    if (this._sizeBeforeExpanded) {
      this._setSize(this._sizeBeforeExpanded);
    }
    this._sizeBeforeExpanded = null;
  }

  /**
   * Host override for the side widget layout, set through
   * `setSideWidgetExtended`. `null` means "no opinion" and leaves the decision
   * to the app's own viewport measurement.
   *
   * This is the opt-in for hosts we cannot measure our way out of: an embedding
   * page that can grow its container tells us so explicitly instead of relying
   * on us guessing from the frame width.
   */
  @state
  sideWidgetExtendedOverride: boolean | null = null;

  @action
  _setSideWidgetExtendedOverride(extended: boolean | null) {
    this.sideWidgetExtendedOverride = extended;
  }

  @delegate('server')
  async setSideWidgetExtended(extended: boolean | null): Promise<void> {
    this._setSideWidgetExtendedOverride(
      extended === null || extended === undefined ? null : !!extended,
    );
  }

  /**
   * Tell the host page about the side widget, so it can size its own container
   * and answer with `setSideWidgetExtended`. Driven by `SideWidget`.
   *
   * `open` means a widget exists for the current call and wants room - that is
   * the host's cue to make some. `visible` is whether it is actually on screen,
   * which it will not be while there is nowhere to put it.
   */
  @delegate('clients')
  async notifySideWidgetOpen(open: boolean, visible: boolean): Promise<void> {
    this._postExternalMessage({
      type: this.messageTypes.sideWidgetOpenNotify,
      open,
      visible,
    });
  }

  @action
  _setPosition(position: AdapterPosition) {
    this.position = position;
  }

  @delegate('server')
  async setPosition(position: AdapterPosition): Promise<void> {
    this._setPosition(position);
  }

  /**
   * Setup watcher for adapter state changes
   */
  private _setupStateWatcher(): void {
    watch(
      this,
      () => [this.closed, this.minimized, this.size, this.position] as const,
      () => {
        // Storage hydration and shared-module state replication can update the
        // observable directly instead of going through setSize(). Keep the
        // expanded layout invariant at the state boundary too.
        if (this._isExpanded && this.size.width < EXPANDED_APP_WIDTH) {
          this._setSize({
            ...this.size,
            width: EXPANDED_APP_WIDTH,
          });
          return;
        }
        this._pushAdapterState();
      },
      { multiple: true },
    );
  }

  /**
   * Add message listeners for parent window communication
   */
  addListeners(): void {
    if (!this.transport) return;
    // @ts-ignore
    this.transport.addListeners({
      push: async (payload: any): Promise<void> => {
        if (typeof payload !== 'object') return;
        switch (payload.type) {
          case this.messageTypes.syncClosed:
            this.setClosed(payload.closed);
            break;
          case this.messageTypes.syncMinimized:
            this.setMinimized(payload.minimized);
            break;
          case this.messageTypes.syncSize:
            this.setSize(payload.size);
            break;
          case this.messageTypes.syncPosition:
            this.setPosition(payload.position);
            break;
          case this.messageTypes.clickToDial:
            this.clickToDial(payload.phoneNumber);
            break;
          case this.messageTypes.setEnvironment:
            this.setEnvironment();
            break;
          case this.messageTypes.logout:
            this.evAuth.logout();
            break;
          case this.messageTypes.dialLead:
            this.dialLead(payload.lead, payload.destination);
            break;
          case this.messageTypes.setSideWidgetExtended:
            this.setSideWidgetExtended(payload.extended);
            break;
          default:
            break;
        }
      },
      request: async ({ requestId, payload }: { requestId: string; payload: any }) => {
        if (payload.type === this.messageTypes.checkPopupWindow) {
          let result = this.tabManager.isPopupWindowOpened;
          if (result) {
            this.toast.warning({
              message: t('popupWindowOpened'),
            });
          }
          if (
            !result &&
            this.evAgentSession.isIntegratedSoftphone &&
            this.evPresence.calls.length > 0
          ) {
            result = true;
            this.toast.warning({
              message: t('cannotPopupWindowWithCall'),
            });
          }
          this.response({ requestId, result });
        }
      },
    });
  }

  /**
   * Send response for request type messages
   */
  protected response({ requestId, result }: { requestId: string; result: any }): void {
    if (!this.transport) return;
    this.transport.response({
      requestId,
      result,
      error: null,
    });
  }


  @delegate('server')
  async clickToDial(phoneNumber: string): Promise<void> {
    if (this.dialerView) {
      await this.dialerView.setToNumber(phoneNumber);
      this.dialerView.setLatestDialoutNumber();
      await this.evCall.dialout(this.dialerView.toNumber);
    } else {
      await this.evCall.dialout(phoneNumber);
    }
  }

  @delegate('server')
  async dialLead(leadProps: LeadProps, destination: string): Promise<void> {
    const leads = this.evLeads.filteredLeads;
    const lead = leads.find((l: any) => {
      if (leadProps.leadId) return l.leadId === leadProps.leadId;
      if (leadProps.requestId) return l.requestId === leadProps.requestId;
      if (leadProps.externId) return l.externId === leadProps.externId;
      if (destination) {
        if (l.destinationE164) {
          return l.destinationE164.includes(destination);
        }
        if (l.destination) {
          return l.destination.includes(destination);
        }
      }
      return false;
    });
    if (!lead) return;
    try {
      await this.evLeads.dialLead(lead, destination);
      this.onCallLead(lead, destination);
    } catch (error) {
      this.logger.error('Error calling lead', error);
    }
  }

  @delegate('server')
  async setEnvironment(): Promise<void> {
    if ((window as any).toggleEnv) {
      (window as any).toggleEnv();
    }
  }

  @delegate('clients')
  async onNewCall(call: any): Promise<void> {
    this._postExternalMessage({ type: this.messageTypes.newCall, call });
  }

  @delegate('clients')
  async onRingCall(call: any): Promise<void> {
    this._postExternalMessage({ type: this.messageTypes.ringCall, call });
  }

  @delegate('clients')
  async onSIPRingCall(message: any): Promise<void> {
    this._postExternalMessage({ type: this.messageTypes.sipRingCall, message });
  }

  @delegate('clients')
  async onSIPEndCall(message: any): Promise<void> {
    this._postExternalMessage({ type: this.messageTypes.sipEndCall, message });
  }

  @delegate('clients')
  async onSIPRegistered(): Promise<void> {
    this._postExternalMessage({ type: this.messageTypes.sipRegistered });
  }

  @delegate('clients')
  async onSIPUnregistered(): Promise<void> {
    this._postExternalMessage({ type: this.messageTypes.sipUnregistered });
  }

  @delegate('clients')
  async onSIPUnstable(): Promise<void> {
    this._postExternalMessage({ type: this.messageTypes.sipUnstable });
  }

  @delegate('clients')
  async onSIPFailed(): Promise<void> {
    this._postExternalMessage({ type: this.messageTypes.sipFailed });
  }

  @delegate('clients')
  async onEndCall(call: any): Promise<void> {
    this._postExternalMessage({ type: this.messageTypes.endCall, call });
  }

  @delegate('clients')
  async onManualPassLead({ callbackDTS, ...params }: ManualPassLeadParams): Promise<void> {
    this._postExternalMessage({
      type: this.messageTypes.manualPassLead,
      ...params,
    });
  }

  @delegate('clients')
  async onCallLead(lead: any, destination: string): Promise<void> {
    this._postExternalMessage({ type: this.messageTypes.callLead, lead, destination });
  }

  @delegate('clients')
  async onLoadLeads(leads: any[]): Promise<void> {
    this._postExternalMessage({ type: this.messageTypes.loadLeads, leads });
  }

  popUpWindow(): void {
    this.setMinimized(false);
  }

  /**
   * Push adapter state to parent window when state changes
   */
  async _pushAdapterState(): Promise<void> {
    if (
      this._lastClosed !== this.closed ||
      this._lastMinimized !== this.minimized ||
      this._lastSize.width !== this.size.width ||
      this._lastSize.height !== this.size.height ||
      this._lastPosition.translateX !== this.position.translateX ||
      this._lastPosition.translateY !== this.position.translateY ||
      this._lastPosition.minTranslateX !== this.position.minTranslateX ||
      this._lastPosition.minTranslateY !== this.position.minTranslateY
    ) {
      this._lastClosed = this.closed;
      this._lastMinimized = this.minimized;
      this._lastSize = { ...this.size };
      this._lastPosition = this.position;
      this._postMessage({
        type: this.messageTypes.pushAdapterState,
        size: this.size,
        minimized: this.minimized,
        closed: this.closed,
        position: this.position,
      });
    }
  }

  /**
   * Post message to parent window via transport
   */
  _postMessage(msg: any): void {
    if (!this.transport) return;
    this.transport._postMessage({
      type: this.transport.events.push,
      payload: msg,
    });
  }

  private _postExternalMessage(msg: any): void {
    if (!this.portManager?.isActiveTab) return;
    this._postMessage(msg);
  }
}

export { Adapter };
