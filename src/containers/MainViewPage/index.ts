import { connectModule } from '@ringcentral-integration/engage-voice-widgets/lib/connectModule';
import { MainViewPanel } from '../../components/MainViewPanel';

export const MainViewPage = connectModule(
  (phone) => phone.mainViewUI,
)(MainViewPanel);
