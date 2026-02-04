import React, {
  FunctionComponent,
  Ref,
  useImperativeHandle,
  useRef,
} from 'react';
import { useMountState } from '@ringcentral/spring-ui';

import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { HeaderViewProps } from '@ringcentral-integration/micro-core/src/app/views/HeaderView/Header.view.interface';

import { Header, HeaderAction } from './Header';
import i18n from './i18n';

const EMPTY_COMPONENT = () => <></>;

export type HeaderPanelAction = {
  closeMenu: () => void;
};

export const HeaderPanel: FunctionComponent<
  HeaderViewProps & {
    action?: Ref<HeaderPanelAction>;
  }
> = (props) => {
  const {
    loginNumber,
    userContact,
    children,
    onActionClick,
    ContactAvatar = EMPTY_COMPONENT,
    action,
  } = props;

  const { t } = useLocale(i18n);

  const actionRef = useRef<HeaderAction>(null);

  const isMountedRef = useMountState();

  const avatarRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(
    action,
    () => ({
      closeMenu() {
        requestAnimationFrame(() => {
          if (isMountedRef.current) actionRef.current?.closeMenu();
        });
      },
    }),
    [isMountedRef],
  );

  return (
    <div className="flex flex-col h-full flex-auto overflow-hidden bg-neutral-base">
      <Header
        title={t('phone')}
        action={actionRef}
        menuHeader={
          <div className="px-3 py-1 typography-descriptor text-neutral-b2 flex items-center h-12">
            {userContact && (
              <ContactAvatar
                contact={userContact}
                contactName={userContact.name}
                phoneNumber={userContact.phoneNumber}
                size="medium"
                variant="squircle"
                aria-label="User avatar"
              />
            )}
            <div className="ml-3 flex-auto overflow-hidden">
              <p
                className="typography-subtitle text-neutral-b0 truncate"
                title={userContact?.name}
              >
                {userContact?.name}
              </p>
              <p
                className="typography-descriptor text-neutral-b2 truncate"
                title={loginNumber}
                data-sign="login-number"
              >
                {loginNumber}
              </p>
            </div>
          </div>
        }
        onActionClick={onActionClick}
      >
        {userContact && (
          <ContactAvatar
            size="small"
            contact={userContact}
            contactName={userContact.name}
            phoneNumber={userContact.phoneNumber}
            variant="circle"
            aria-label="User avatar"
            component={'button' as any}
            avatarShapeRef={avatarRef}
          />
        )}
      </Header>

      {children}
    </div>
  );
};
