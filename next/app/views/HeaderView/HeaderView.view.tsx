import type { IContact } from '@ringcentral-integration/commons/interfaces/Contact.model';
import {
  computed,
  dynamic,
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  UIFunctions,
  UIProps,
  useConnector,
} from '@ringcentral-integration/next-core';
import type { PropsWithChildren } from 'react';
import React, { useRef } from 'react';

import { Brand, Locale } from '@ringcentral-integration/micro-core/src/app/services';
import type {
  HeaderContainerProps,
  HeaderViewOptions,
  HeaderViewProps,
} from '@ringcentral-integration/micro-core/src/app/views/HeaderView/Header.view.interface';
import { HeaderPanel } from './HeaderPanel';
import { EvAuth } from '../../services';

@injectable({
  name: 'HeaderView',
})
class HeaderView extends RcViewModule {
  constructor(
    protected _router: RouterPlugin,
    protected _locale: Locale,
    protected _brand: Brand,
    protected _evAuth: EvAuth,
    @optional('HeaderViewOptions')
    protected _headerViewOptions?: HeaderViewOptions,
  ) {
    super();
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
        id: this._evAuth.agentId,
        phoneNumber: userName,
      };
    }
  }

  get userName(): string {
    return this._evAuth.agentSettings?.username || '';
  }

  getUIProps({ standAlone }: HeaderContainerProps): UIProps<HeaderViewProps> {
    const logoUrl = this._brand.brandConfig.assets?.logo as string;

    return {
      standAlone,
      logoUrl,
      currentPath: this._router.currentPath,
      currentLocale: this._locale.currentLocale,
      userContact: this.userContact,
      loginNumber: this.userName,
    };
  }

  getUIFunctions(_: HeaderContainerProps): UIFunctions<HeaderViewProps> {
    return {
      // spring-ui only
      onActionClick: (action) => {
        switch (action) {
          case 'logout':
            this._evAuth?.logout();
            break;

          default:
            break;
        }
      },
    };
  }

  component(props: PropsWithChildren<Partial<HeaderViewProps>>) {
    const { current: uiFunctions } = useRef(this.getUIFunctions(props));

    const _props = useConnector(() => {
      const uiProps = this.getUIProps(props);

      return {
        ...props,
        ...uiProps,
      };
    });

    return <HeaderPanel {..._props} {...uiFunctions} />;
  }
}

export { HeaderView };

