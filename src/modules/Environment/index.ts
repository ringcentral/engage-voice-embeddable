import { Module } from 'ringcentral-integration/lib/di';
import BasicEnvironment from 'ringcentral-integration/modules/Environment';

import { theme } from '@ringcentral-integration/engage-voice-widgets/theme';

const environment = {
  mode: 'sf-lightning',
  theme,
};

@Module({
  name: 'Environment',
})
class Environment extends BasicEnvironment {
  get view() {
    return environment;
  }
}

export { Environment, environment };
