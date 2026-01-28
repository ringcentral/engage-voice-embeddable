import { createSharedApp } from '@ringcentral-integration/next-core';

import { appConfig } from '../config';
import { getAppConfig } from './app/getAppConfig';

/**
 * Run the application in standalone/independent mode
 */
export async function runIndependentApp() {
  const { brandConfig, sdkConfig, evAgentConfig, version, prefix } = appConfig;

  const config = getAppConfig({
    appVersion: version?.appVersion || '0.0.1',
    prefix,
    brandConfig,
    sdkConfig,
    evAgentConfig,
    modules: [],
    share: {
      name: prefix,
      type: 'Base',
    },
  });

  const app = await createSharedApp(config);

  if (typeof document !== 'undefined') {
    const container = document.getElementById('app');
    if (container) {
      app.bootstrap(container);
    }
  }

  return app;
}
