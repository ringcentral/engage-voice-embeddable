import {
  computed,
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
  useParams,
  type UIFunctions,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import {
  AppHeaderNav,
} from '@ringcentral-integration/micro-core/src/app/components';
import { PageHeader } from '@ringcentral-integration/next-widgets/components';
import {
  IconButton,
  ListItem,
  ListItemText,
} from '@ringcentral/spring-ui';
import {
  HoldMd,
  MuteMd,
  MicrophoneMd,
  CallOffMd,
} from '@ringcentral/spring-icon';
import React, { useRef } from 'react';

import { EvCall } from '../../services/EvCall';
import { EvAuth } from '../../services/EvAuth';
import { EvCallMonitor } from '../../services/EvCallMonitor';
import { EvActiveCallControl } from '../../services/EvActiveCallControl';
import { EvIntegratedSoftphone } from '../../services/EvIntegratedSoftphone';
import { EvAgentSession } from '../../services/EvAgentSession';
import type { EvCallData } from '../../services/EvCallDataSource';
import { formatPhoneNumber } from '../../../lib/FormatPhoneNumber';
import type {
  ActiveCallListViewOptions,
  ActiveCallListViewUIProps,
  ActiveCallListViewUIFunctions,
} from './ActiveCallListView.interface';
import i18n from './i18n';

/**
 * ActiveCallListView - Display active call sessions during warm transfer
 * Shows all participants (everyone, caller/callee, agent, transfer targets)
 * with per-session call controls (hangup, hold, mute)
 */
@injectable({
  name: 'ActiveCallListView',
})
class ActiveCallListView extends RcViewModule {
  constructor(
    private _evCall: EvCall,
    private _evAuth: EvAuth,
    private _evCallMonitor: EvCallMonitor,
    private _evActiveCallControl: EvActiveCallControl,
    private _evIntegratedSoftphone: EvIntegratedSoftphone,
    private _evAgentSession: EvAgentSession,
    private _router: RouterPlugin,
    @optional('ActiveCallListViewOptions')
    private _options?: ActiveCallListViewOptions,
  ) {
    super();
  }

  get callId(): string {
    return this._evCall.activityCallId;
  }

  @computed((that: ActiveCallListView) => [
    that.callId,
    that._evCallMonitor.callIds,
    that._evCallMonitor.otherCallIds,
    that._evCallMonitor.callsMapping,
    that._evAuth.agentId,
  ])
  get callList(): EvCallData[] {
    const { callIds, otherCallIds, callsMapping } = this._evCallMonitor;
    return this._evCallMonitor.getActiveCallList(
      callIds,
      otherCallIds,
      callsMapping,
      this.callId,
    ) as unknown as EvCallData[];
  }

  onHangup(call: EvCallData): void {
    this._evActiveCallControl.hangupSession({
      sessionId: call.session!.sessionId,
    });
  }

  onHold(call: EvCallData): void {
    this._evActiveCallControl.holdSession({
      sessionId: call.session!.sessionId,
      state: true,
    });
  }

  onUnHold(call: EvCallData): void {
    this._evActiveCallControl.holdSession({
      sessionId: call.session!.sessionId,
      state: false,
    });
  }

  getUIProps(callId: string): ActiveCallListViewUIProps {
    this._evCall.activityCallId = callId;
    return {
      callList: this.callList,
      isOnMute: this._evIntegratedSoftphone.muteActive,
      showMuteButton: this._evAgentSession.isIntegratedSoftphone,
      userName: this._evAuth.agentSettings?.username ?? '',
      isInbound: this._evCall.isInbound,
    };
  }

  getUIFunctions(): UIFunctions<ActiveCallListViewUIFunctions> {
    return {
      goBack: () => this._router.replace(`/activityCallLog/${this.callId}`),
      onHangup: (call: EvCallData) => this.onHangup(call),
      onHold: (call: EvCallData) => this.onHold(call),
      onUnHold: (call: EvCallData) => this.onUnHold(call),
      onMute: () => this._evActiveCallControl.mute(),
      onUnmute: () => this._evActiveCallControl.unmute(),
    };
  }

  component() {
    const params = useParams<{ id?: string }>();
    const callId = params?.id ?? '';
    const { t } = useLocale(i18n);
    const { current: uiFunctions } = useRef(this.getUIFunctions());

    const {
      callList,
      isOnMute,
      showMuteButton,
      userName,
      isInbound,
    } = useConnector(() => this.getUIProps(callId));

    if (callList.length < 2) {
      return (
        <>
          <AppHeaderNav override>
            <PageHeader onBackClick={uiFunctions.goBack}>
              {t('activeCall')}
            </PageHeader>
          </AppHeaderNav>
          <div className="flex-1" />
        </>
      );
    }

    const [everyoneCaller, ownCall, ...transferCalls] = callList;

    return (
      <>
        <AppHeaderNav override>
          <PageHeader onBackClick={uiFunctions.goBack}>
            {t('activeCall')}
          </PageHeader>
        </AppHeaderNav>

        <div className="flex-1 overflow-y-auto">
          {/* Everyone row */}
          <ListItem hoverable={false} data-sign="callItem" size="large">
            <ListItemText primary={t('everyone')} />
            <IconButton
              className="mr-1"
              symbol={CallOffMd}
              onClick={() => uiFunctions.onHangup(everyoneCaller)}
              size="small"
              variant="contained"
              color="danger"
              data-sign="hangupEveryone"
            />
          </ListItem>

          {/* Caller/Callee row */}
          <ListItem hoverable={false} data-sign="callItem" size="large" className="pl-8">
            <ListItemText
              primary={`${formatPhoneNumber({ phoneNumber: everyoneCaller.session?.phone ?? '' })}(${t(isInbound ? 'caller' : 'callee')})`}
            />
            <IconButton
              className="mr-1"
              symbol={HoldMd}
              onClick={() =>
                everyoneCaller.isHold
                  ? uiFunctions.onUnHold(everyoneCaller)
                  : uiFunctions.onHold(everyoneCaller)
              }
              size="small"
              variant="inverted"
              color={everyoneCaller.isHold ? 'warning' : 'neutral'}
              data-sign="holdCaller"
            />
            <IconButton
              className="mr-1"
              symbol={CallOffMd}
              onClick={() => uiFunctions.onHangup(everyoneCaller)}
              size="small"
              variant="contained"
              color="danger"
              data-sign="hangupCaller"
            />
          </ListItem>

          {/* Agent (Me) row */}
          <ListItem hoverable={false} data-sign="callItem" size="large" className="pl-8">
            <ListItemText
              primary={`${(ownCall as any).agentName || userName || ''}(${t('me')})`}
            />
            {showMuteButton && (
              <IconButton
                symbol={isOnMute ? MuteMd : MicrophoneMd}
                onClick={() =>
                  isOnMute ? uiFunctions.onUnmute() : uiFunctions.onMute()
                }
                size="small"
                variant="inverted"
                color={isOnMute ? 'danger' : 'neutral'}
                data-sign="muteButton"
                className="mr-1"
              />
            )}
            <IconButton
              className="mr-1"
              symbol={CallOffMd}
              onClick={() => uiFunctions.onHangup(ownCall)}
              size="small"
              variant="contained"
              color="danger"
              data-sign="hangupMe"
            />
          </ListItem>

          {/* Transfer call rows */}
          {transferCalls.map((callItem, index) => {
            const destination =
              callItem.session?.transferSessions?.[callItem.session.sessionId]
                ?.destination;
            return (
              <ListItem
                key={callItem.session?.sessionId ?? index}
                hoverable={false}
                data-sign="callItem"
                size="large"
                className="pl-8"
              >
                <ListItemText
                  primary={formatPhoneNumber({ phoneNumber: destination ?? '' })}
                />
                <IconButton
                  className="mr-1"
                  symbol={HoldMd}
                  onClick={() =>
                    callItem.isHold
                      ? uiFunctions.onUnHold(callItem)
                      : uiFunctions.onHold(callItem)
                  }
                  size="small"
                  variant="inverted"
                  color={callItem.isHold ? 'warning' : 'neutral'}
                  data-sign="holdTransfer"
                />
                <IconButton
                  className="mr-1"
                  symbol={CallOffMd}
                  onClick={() => uiFunctions.onHangup(callItem)}
                  size="small"
                  variant="contained"
                  color="danger"
                  data-sign="hangupTransfer"
                />
              </ListItem>
            );
          })}
        </div>
      </>
    );
  }
}

export { ActiveCallListView };
