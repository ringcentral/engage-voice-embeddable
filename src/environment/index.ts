import { theme } from '@ringcentral-integration/engage-voice-widgets/theme';
import { getMode } from '../lib/getMode';

export const environment = {
  mode: getMode(),
  theme,
};
