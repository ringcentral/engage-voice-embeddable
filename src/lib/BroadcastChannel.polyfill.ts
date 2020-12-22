import { EventEmitter } from 'events';

export class BroadcastChannelWithStorage extends EventEmitter {
  private _name: string;
  public onmessage?: ({ data } : { data: any }) => void;
  public onmessageerror?: (e: Error) => void;

  constructor(name: string) {
    super();
    this._name = name;
    this._initStorageListener();
  }

  _initStorageListener() {
    window.addEventListener('storage', this._onStorageMessage);
  }

  _onStorageMessage = (e) => {
    if (!e.newValue) {
      return;
    }
    if (e.key === this._name) {
      try {
        const data = JSON.parse(e.newValue);
        this.emit('message', { data });
        if (typeof this.onmessage === 'function') {
          this.onmessage({ data });
        }
      } catch (e) {
        this.emit('messageerror', e);
        if (typeof this.onmessageerror === 'function') {
          this.onmessageerror(e);
        }
      }
    }
  }

  _safeStringify(data) {
    // remove Circular object
    const seen = new WeakSet();
    return JSON.stringify(
      data,
      (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      }
    );
  }

  postMessage(message: any) {
    localStorage.setItem(this._name, this._safeStringify(message));
    localStorage.removeItem(this._name);
  }

  addEventListener(event: 'message' | 'messageerror', listener: ({ data }: { data: any}) => void) {
    this.on(event, listener);
  }

  removeEventListener(event: 'message' | 'messageerror', listener: ({ data }: { data: any}) => void) {
    this.off(event, listener);
  }

  get name() {
    return this._name;
  }
}

let environment;
if (typeof window !== 'undefined') {
  environment = window;
}
if (typeof global !== 'undefined') {
  environment = global.window || global;
}

if (environment && !environment.BroadcastChannel) {
  environment.BroadcastChannel = BroadcastChannelWithStorage;
}
