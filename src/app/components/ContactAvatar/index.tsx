import { CallQueueMd, ProfileMd } from '@ringcentral/spring-icon';
import { Avatar } from '@ringcentral/spring-ui';
import clsx from 'clsx';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import type {
  ContactAvatarProps,
  ContactAvatarRef,
} from '@ringcentral-integration/micro-contacts/src/app/components/ContactAvatar';
import { getAvatarLetter, jRcContactAvatarColorId } from '@ringcentral-integration/micro-contacts/src/app/components/ContactAvatar/libs';
import { useAvatarColorToken } from '@ringcentral-integration/micro-contacts/src/app/components/ContactAvatar/useAvatarColorToken';

export const ContactAvatar = forwardRef<HTMLDivElement, ContactAvatarProps>(
  (props, ref) => {
    const {
      contact,
      contactName,
      textAvatarColor,
      phoneNumber,
      variant = 'circle',
      dataRef,
      size = 'large',
      url,
      showPresence: showPresenceProp,
      isDepartment,
      ...rest
    } = props;
    const showPresence =
      showPresenceProp &&
      // only company type contact can show presence
      contact?.type === 'company';

    const showPresenceRef = useRef(showPresence);

    if (process.env.NODE_ENV !== 'production') {
      if (showPresence !== showPresenceRef.current) {
        // eslint-disable-next-line no-console
        console.warn(
          'showPresence is static value, not able to change after initial, please ensure that value only use once in the component lifetime when initial',
        );
      }
    }

    const contactId = contact?.id;

    const contractUrl = null;

    const colorId = useMemo(
      () => jRcContactAvatarColorId(contactId, phoneNumber),
      [contactId, phoneNumber],
    );

    const avatarColor = useAvatarColorToken(colorId);

    const shortName = useMemo(
      () => contactName && getAvatarLetter(contactName),
      [contactName],
    );

    const avatarProps = useMemo(() => {
      const avatarProps: ContactAvatarRef = {
        src: contractUrl,
        size,
        ...rest,
      };

      avatarProps.rootProps ??= {};
      (avatarProps.rootProps as any)['data-sign'] = 'contactAvatar';

      avatarProps.classes ??= {};
      if (contractUrl) {
        avatarProps.imgProps = {
          loading: 'lazy',
        };
        avatarProps['data-sign'] = 'contactAvatarImg';
        avatarProps['onErrorCapture'] = (err) => {
          // eslint-disable-next-line no-console
          console.warn('avatar onErrorCapture error?', err);
        };

        return avatarProps;
      }

      if (contactName) {
        avatarProps['data-sign'] = 'contactAvatarText';
        avatarProps['data-color-id'] = colorId;

        const bgColor = textAvatarColor || avatarColor;

        if (variant === 'circle') {
          avatarProps.classes.content = clsx(
            avatarProps.classes.content,
            bgColor,
            bgColor ? 'text-neutral-static-w0' : undefined,
          );
        } else {
          avatarProps.classes.shape = clsx(
            avatarProps.classes.shape,
            bgColor
              ? // that color able to use is because the tailwind static scan be scan in  apps/micro-contacts/src/app/components/ContactAvatar/useAvatarColorToken.ts
                `sui-squircle-bg-color-${bgColor.replace('bg-', '')}`
              : undefined,
            bgColor ? 'text-neutral-static-w0' : undefined,
          );
        }
        avatarProps.children = shortName;

        return avatarProps;
      }

      // if isDepartment is true and custom avatar or contactName not set, use callQueue default department avatar
      if (isDepartment) {
        return {
          symbol: CallQueueMd,
          ...avatarProps,
          'data-sign': 'contactAvatarDepartmentDefault',
        };
      }

      return {
        symbol: ProfileMd,
        ...avatarProps,
        'data-sign': 'contactAvatarDefault',
      };
    }, [
      contractUrl,
      size,
      rest,
      contactName,
      isDepartment,
      colorId,
      textAvatarColor,
      avatarColor,
      variant,
      shortName,
    ]);

    useImperativeHandle(dataRef, () => avatarProps);

    return (
      <Avatar
        variant={variant}
        ref={ref}
        aria-label="contact avatar"
        {...avatarProps}
      />
    );
  },
);

ContactAvatar.displayName = 'ContactAvatar';
