declare module '*.svg';
declare module '*.scss';

interface Window {
  __rc_shared_worker__?: {
    /**
     * Relative worker URL. next-core's Initiator/PortManager prepend the host
     * path to it, so it must not be absolute.
     */
    url: string;
    worker: SharedWorker;
  };
  workerScriptsFail?: { renderLoadFail?: () => void };
}
