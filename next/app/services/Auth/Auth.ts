import { action, inject, injectable, optional, Root, StoragePlugin } from '@ringcentral-integration/next-core';
import {
  Analytics,
  Auth as AuthBase,
  AuthOptions,
  Client,
  Environment,
  RateLimiter,
} from '@ringcentral-integration/micro-auth/src/app/services';
import type { SDKConfig } from '@ringcentral-integration/commons/lib/createSdkConfig';
import {
  Locale,
  Toast,
} from '@ringcentral-integration/micro-core/src/app/services';

/**
 * Auth service that extends the base Auth module
 * Provides RingCentral authentication with JWT and OAuth support
 */
@injectable({
  name: 'Auth',
})
export class Auth extends AuthBase {
  constructor(
    protected override _client: Client,
    protected override _toast: Toast,
    protected override _locale: Locale,
    protected override _storage: StoragePlugin,
    protected override _root: Root,
    @inject('SdkConfig') protected override _sdkConfig: SDKConfig,
    @optional() protected override _rateLimiter?: RateLimiter,
    @optional() protected override _environment?: Environment,
    @optional() protected override _analytics?: Analytics,
    @optional('AuthOptions') protected override _authOptions?: AuthOptions,
  ) {
    super(
      _client,
      _toast,
      _locale,
      _storage,
      _root,
      _sdkConfig,
      _rateLimiter,
      _environment,
      _analytics,
      _authOptions,
    );
  }

  @action
  setNotFreshLogin() {
    this.isFreshLogin = false;
  }
}
