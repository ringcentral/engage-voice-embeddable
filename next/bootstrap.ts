import { logger } from '@ringcentral-integration/next-core';

import { runIndependentApp } from './app';
import './main.global.scss';

logger.log('🚀 Starting Engage Voice Embeddable...');

runIndependentApp();
