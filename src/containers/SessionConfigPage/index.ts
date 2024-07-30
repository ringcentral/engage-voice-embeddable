import { connectModule } from '@ringcentral-integration/engage-voice-widgets/lib/connectModule';
import { SessionConfigPanel } from '../../components/SessionConfigPanel';

export const SessionConfigPage = connectModule(
  (phone) => phone.evAgentSessionUI,
)(SessionConfigPanel);
