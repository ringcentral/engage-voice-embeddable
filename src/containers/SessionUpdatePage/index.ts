import { connectModule } from '@ringcentral-integration/engage-voice-widgets/lib/connectModule';
import { SessionUpdatePanel } from '../../components/SessionUpdatePanel';

export const SessionUpdatePage = connectModule(
  (phone) => phone.evAgentSessionUI,
)(SessionUpdatePanel);
