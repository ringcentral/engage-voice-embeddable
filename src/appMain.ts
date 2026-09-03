import './main.global.scss';
import { createApp } from './createApp';

const worker = global.__rc_shared_worker__?.worker;

async function runApp() {
  const app = await createApp(
    worker
      ? {
          name: 'cx-embeddable',
          port: 'client',
          type: 'SharedWorker',
          worker,
        }
      : {
          name: 'cx-embeddable',
          type: 'SharedTab',
        },
    [],
  );

  if (typeof document !== 'undefined') {
    const container = document.getElementById('app');
    if (container) {
      app.bootstrap(container);
    }
  }
  return app;
}

runApp();
