import { getAlertRenderer as getAlertRendererBase } from '@ringcentral-integration/engage-voice-widgets/components/AlertRenderer';

export function getAlertRenderer() {
  const baseRenderer = getAlertRendererBase();
  return (message) => {
    const baseMessage = baseRenderer(message);
    if (baseMessage) {
      return baseMessage;
    }
    if (message.message === 'popupWindowOpened') {
      return () => 'You have a popup window opened.';
    }
    if (message.message === 'cannotPopupWindowWithCall') {
      return () => 'Sorry, app can\'t open popup window when there are active calls.';
    }
    if (message.message === 'leadPassFailed') {
      return () => 'Lead pass failed. Please try again.';
    }
    if (message.message === 'requiredLeadCall') {
      return () => 'You must call all currently fetched leads before fetching new leads';
    }
    return null;
  };
}
