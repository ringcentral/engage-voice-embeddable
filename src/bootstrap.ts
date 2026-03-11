import { logger } from '@ringcentral-integration/next-core';

import { runApp } from './createApp';
import './main.global.scss';

logger.log('🚀 Starting Engage Voice Embeddable...');

window.app = runApp();
