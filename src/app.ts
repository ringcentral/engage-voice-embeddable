/**
 * Shared worker bootstrap.
 *
 * This lives in the entry rather than in an inline <script> in app.html so that
 * app.js — cached independently at a fixed URL — names the worker from its own
 * build: webpack rewrites the `new URL` below to this build's folder. Choosing
 * the worker in app.html would tie it to app.html's build instead, and app.html
 * and app.js are cached separately, so the two could disagree.
 *
 * Ported from next-builder's `loadWorker.js` template. Its MFE dependency
 * handling is a no-op for this app (no `mfeConfig`), and `__RC_MFE_SATISFY__` is
 * deliberately left unset: @ringcentral/mfe-shared falls back to an equivalent
 * local implementation when that global is absent.
 */
// Keep in sync with `disableRcSharedWorkerKey` in @ringcentral-integration/next-core.
const DISABLE_SHARED_WORKER_KEY = 'disableRcSharedWorker';

const loadWorker = () => {
  if (localStorage.getItem(DISABLE_SHARED_WORKER_KEY)) return;
  if (!window.SharedWorker) return;
  // Safari is excluded, as it was by the inline template.
  // if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) return;

  // The worker reads its configuration out of `self.location.search`
  // (`readUrlParams` in createApp), so the page's params have to be forwarded
  // onto the worker URL — without them the worker falls back to defaults for
  // clientId, rcServer, jwt, enableAgentScript and the rest.
  const params = new URLSearchParams(window.location.search);
  // Volatile, page-only params are dropped: a SharedWorker is keyed by its URL,
  // so leaving these in would spawn a fresh worker on every reload or popup.
  ['_t', 'fromAdapter', 'fromPopup'].forEach((key) => params.delete(key));
  const search = params.toString();

  // `process.env.WORKER_URL` is the file webpack emits for `./worker.ts` — see
  // the `createWorker` reference below, which is what makes it emit at all.
  const workerUrl = search
    ? `${process.env.WORKER_URL}?${search}`
    : `${process.env.WORKER_URL}`;
  // Same name the inline template produced, so a worker started by an older
  // build keeps a distinct identity rather than being reused.
  const name = `worker#${btoa('{}')}`;
  const worker = new SharedWorker(workerUrl, { name });

  window.__rc_shared_worker__ = {
    // Relative: Initiator/PortManager prepend the host path before comparing.
    url: `${workerUrl}?${name}`,
    worker,
  };

  worker.addEventListener('error', (event) => {
    // eslint-disable-next-line no-console
    console.error('load __rc_shared_worker__ worker fail', event);
    window.workerScriptsFail?.renderLoadFail?.();
  });
};

// Just for worker can be build https://webpack.js.org/guides/web-workers/
// Never called: this is the syntactic form webpack detects in order to emit the
// worker chunk. The worker itself is started by `loadWorker` above, which needs
// to append query params and so cannot use this form directly.
export const createWorker = () => {
  new SharedWorker(
    // @ts-ignore
    /* webpackChunkName: "worker" */ new URL('./worker.ts', import.meta.url),
  );
};

loadWorker();

/**
 * The app is loaded across an async boundary so this entry stays a small file at
 * a fixed URL.
 *
 * Everything below is then requested by the webpack runtime, which resolves each
 * chunk against the build folder baked into this file — so an older cached
 * `app.js` keeps loading its own build's chunks. Chunks injected into app.html
 * as <script> tags would instead be pinned by the HTML, and would have to be
 * versioned together with whichever `app.js` the browser happens to hold.
 *
 * The `webpackChunkName` is required: the splitChunks predicate only splits
 * named chunks, and without it this becomes one chunk far past the size
 * CloudFront will compress.
 */
import(/* webpackChunkName: "main" */ './appMain');
