import {
  injectable,
  optional,
  RouterPlugin,
  computed,
  UIProps,
} from '@ringcentral-integration/next-core';
import type { IContact } from '@ringcentral-integration/commons/interfaces/Contact.model';
import { HeaderView as BaseHeaderView } from '@ringcentral-integration/micro-core/src/app/views';
import {
  Brand,
  Locale,
} from '@ringcentral-integration/micro-core/src/app/services';

import { EvAuth } from '../../services';
import type { HeaderViewOptions, HeaderViewProps, HeaderContainerProps } from './HeaderView.interface';

/**
 * HeaderView - Extended header view for Engage Voice
 * Extends the base HeaderView from micro-core with custom functionality
 */
@injectable({
  name: 'HeaderView',
})
class HeaderView extends BaseHeaderView {
  constructor(
    protected _router: RouterPlugin,
    protected _locale: Locale,
    protected _brand: Brand,
    protected _evAuth: EvAuth,
    @optional('HeaderViewOptions')
    protected override _headerViewOptions?: HeaderViewOptions,
  ) {
    super(_router, _locale, _brand, _headerViewOptions);
  }

  @computed
  get userContact(): IContact | undefined {
    let agentName = this._evAuth.agentConfig?.agentSettings?.firstName;
    let agentLastName = this._evAuth.agentConfig?.agentSettings?.lastName;
    if (!agentName && !agentLastName) {
      return undefined;
    }
    const userName = this._evAuth.agentSettings?.username || '';
    if (agentName && agentLastName) {
      return {
        name: `${agentName} ${agentLastName}`,
        type: 'company',
        phoneNumber: userName,
      };
    }
    return undefined;
  }

  get userName(): string {
    return this._evAuth.agentSettings?.username || '';
  }

  override getUIProps(props: HeaderContainerProps): UIProps<HeaderViewProps> {
    return {
      ...super.getUIProps(props),
      loginNumber: this.userName,
    };
  }
}

export { HeaderView };
