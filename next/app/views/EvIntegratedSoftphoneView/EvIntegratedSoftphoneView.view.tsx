import {
  ModalView,
  useModalItemView,
} from '@ringcentral-integration/micro-core/src/app/views';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import {
  injectable,
  portal,
  RcViewModule,
} from '@ringcentral-integration/next-core';
import type { PortalInstance } from '@ringcentral-integration/next-core';
import { Button } from '@ringcentral/spring-ui';
import { format } from '@ringcentral-integration/utils';
import React from 'react';

import { EvCallbackTypes } from '../../services/EvClient/enums';
import { EvIntegratedSoftphone } from '../../services/EvIntegratedSoftphone';
import { EvSubscription } from '../../services/EvSubscription';
import { EvPresence } from '../../services/EvPresence';
import { EvClient } from '../../services/EvClient';
import type { EvSipRingingData } from '../../services/EvClient/interfaces/EvClientCallMapping.interface';
import i18n from './i18n';

/**
 * Ringing modal payload
 */
interface RingingPayload {
  displayName: string;
  queueName: string;
  isInbound: boolean;
}

/**
 * EvIntegratedSoftphoneView - Modal view for SIP call ringing and registration failure
 * Handles UI modals triggered by SIP events from the EvIntegratedSoftphone service
 */
@injectable({
  name: 'EvIntegratedSoftphoneView',
})
class EvIntegratedSoftphoneView extends RcViewModule {
  private _ringingInstance: PortalInstance | null = null;

  constructor(
    private modalView: ModalView,
    private evIntegratedSoftphone: EvIntegratedSoftphone,
    private evSubscription: EvSubscription,
    private evPresence: EvPresence,
    private evClient: EvClient,
  ) {
    super();
    this._bindSipModalEvents();
  }

  /**
   * Ringing modal content - shows incoming/outbound call info with Answer/Reject
   */
  private RingingContent = () => {
    const { action, props } = useModalItemView<RingingPayload>();
    const { t } = useLocale(i18n);
    const payload = props?.payload;
    const isInbound = payload?.isInbound ?? false;
    const displayName = payload?.displayName ?? '';
    const queueName = payload?.queueName ?? '';

    return (
      <div className="m-4 flex flex-col gap-3" data-sign="ringingModal">
        <h3 className="typography-title" data-sign="ringingTitle">
          {t('inviteModalTitle')}
        </h3>
        <div className="typography-mainText text-neutral-b2" data-sign="ringingInfo">
          {isInbound ? (
            <>
              <p className="truncate" title={format(t('incomingText'), { displayName })}>
                {format(t('incomingText'), { displayName })}
              </p>
              {queueName && (
                <p className="truncate" title={format(t('queueNameText'), { queueName })}>
                  {format(t('queueNameText'), { queueName })}
                </p>
              )}
            </>
          ) : (
            <p className="truncate" title={format(t('outboundText'), { displayName })}>
              {format(t('outboundText'), { displayName })}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <div data-sign="ringingAnswer">
            <Button
              fullWidth
              size="xlarge"
              onClick={() => action?.confirm()}
            >
              {t('inviteModalAnswer')}
            </Button>
          </div>
          <div data-sign="ringingReject">
            <Button
              fullWidth
              size="xlarge"
              variant="outlined"
              onClick={() => action?.cancel()}
            >
              {t('inviteModalReject')}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Registration failed modal content
   */
  private RegistrationFailedContent = () => {
    const { action } = useModalItemView();
    const { t } = useLocale(i18n);

    return (
      <div className="m-4 flex flex-col gap-3" data-sign="registrationFailedModal">
        <h3 className="typography-title" data-sign="registrationFailedTitle">
          {t('registrationFailedTitle')}
        </h3>
        <p className="typography-mainText text-neutral-b2" data-sign="registrationFailedContent">
          {t('registrationFailedContent')}
        </p>
        <div className="mt-4">
          <div data-sign="registrationFailedConfirm">
            <Button
              fullWidth
              size="xlarge"
              onClick={() => action?.confirm()}
            >
              {t('registrationFailedConfirm')}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Ringing confirmation modal definition
   */
  @portal
  private ringingModal = this.modalView.create<RingingPayload>({
    view: () => <this.RingingContent />,
    props: () => ({
      type: 'drawer',
      header: null,
      disableBackdropClick: true,
      'aria-label': 'incoming call',
    }),
  });

  /**
   * Registration failed alert modal definition
   */
  @portal
  private registrationFailedModal = this.modalView.create({
    view: () => <this.RegistrationFailedContent />,
    props: () => ({
      type: 'drawer',
      header: null,
      disableBackdropClick: true,
      'aria-label': 'registration failed',
    }),
  });

  /**
   * Bind SIP events to show/close modals automatically
   */
  private _bindSipModalEvents() {
    // On ringing: show modal if auto-answer is not handling it
    this.evIntegratedSoftphone.onRinging((ringingCall?: EvSipRingingData) => {
      if (this.evIntegratedSoftphone.autoAnswerCheckFn?.()) {
        return;
      }
      const displayName = ringingCall?.data?.request?.from?.displayName ?? '';
      const queueName = this.evClient.currentCall?.queue?.name ?? '';
      const { dialoutStatus, isOffhooking, isManualOffhook } = this.evPresence;
      const isInbound =
        dialoutStatus !== 'dialing' &&
        !(isManualOffhook && isOffhooking) &&
        this.evClient.currentCall?.callType === 'INBOUND';
      this.showRingingModal({ displayName, queueName, isInbound });
    });
    // On SIP ended: close ringing modal if still open
    this.evSubscription.subscribe(EvCallbackTypes.SIP_ENDED, () => {
      this.closeRingingModal();
    });
    // On registration failed: show failed modal
    this.evSubscription.subscribe(
      EvCallbackTypes.SIP_REGISTRATION_FAILED,
      () => {
        this.showRegistrationFailedModal();
      },
    );
  }

  /**
   * Show the ringing confirmation modal with ringtone
   */
  showRingingModal(payload: RingingPayload): void {
    // Prevent duplicate modals
    if (this._ringingInstance) {
      return;
    }
    this.evIntegratedSoftphone.playRingtone();
    const instance = this.modalView.open(this.ringingModal, payload);
    this._ringingInstance = instance;
    instance.closed.then((answer) => {
      this.evIntegratedSoftphone.stopRingtone();
      this._ringingInstance = null;
      if (answer) {
        this.evIntegratedSoftphone.sipAnswer();
      } else {
        this.evIntegratedSoftphone.sipReject();
      }
    });
  }

  /**
   * Close the ringing modal if open (e.g. when SIP_ENDED fires)
   */
  closeRingingModal(): void {
    if (this._ringingInstance) {
      this.evIntegratedSoftphone.stopRingtone();
      this.modalView.close(this.ringingModal);
      this._ringingInstance = null;
    }
  }

  /**
   * Show the registration failed alert modal, reloads app on confirm
   */
  async showRegistrationFailedModal(): Promise<void> {
    const result = this.modalView.open(this.registrationFailedModal);
    await result.closed;
    window.location.reload();
  }

  /**
   * Component method required by RcViewModule (not rendered directly)
   */
  component() {
    return null;
  }
}

export { EvIntegratedSoftphoneView };
