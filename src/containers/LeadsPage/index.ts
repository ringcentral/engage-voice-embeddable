import { connectModule } from '@ringcentral-integration/engage-voice-widgets/lib/connectModule';
import { LeadsPanel } from '../../components/LeadsPanel';

export const LeadsPage = connectModule(
  (phone) => phone.evLeadsUI,
)(LeadsPanel);
