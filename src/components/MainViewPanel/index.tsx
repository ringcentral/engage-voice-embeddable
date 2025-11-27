import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';

import classNames from 'classnames';

import type { TabPropTypes } from '@ringcentral-integration/widgets/components/NavigationBar';
import { Tooltip } from '@ringcentral-integration/widgets/components/Rcui/Tooltip';
import TabNavigationView from '@ringcentral-integration/widgets/components/TabNavigationView';
import type { RcIconProps } from '@ringcentral/juno';
import { RcIcon } from '@ringcentral/juno';
import {
  Phone as phoneSvg,
  PhoneBorder as phoneBorderSvg,
  Settings as settingsSvg,
  SettingsBorder as settingsBorderSvg,
  Time as TimeSvg,
  TimeBorder as TimeBorderSvg,
  Contacts as contactsSvg,
  ContactsBorder as contactsBorderSvg,
} from '@ringcentral/juno-icon';

import offHookSvgConnecting from '@ringcentral-integration/engage-voice-widgets/assets/icons/icon-pvc-connecting.svg';
import offHookSvgDisabled from '@ringcentral-integration/engage-voice-widgets/assets/icons/icon-pvc-disabled.svg';
import offHookSvgDisconnecting from '@ringcentral-integration/engage-voice-widgets/assets/icons/icon-pvc-disconnecting.svg';
import offHookSvgOff from '@ringcentral-integration/engage-voice-widgets/assets/icons/icon-pvc-off.svg';
import offHookSvgOn from '@ringcentral-integration/engage-voice-widgets/assets/icons/icon-pvc-on.svg';
import type {
  EvMainViewUIFunctions,
  EvMainViewUIProps,
} from '@ringcentral-integration/engage-voice-widgets/interfaces/EvMainViewUI.interface';
import i18n from '@ringcentral-integration/engage-voice-widgets/components/MainViewPanel/i18n';
import styles from '@ringcentral-integration/engage-voice-widgets/components/MainViewPanel/styles.scss';
import { WorkingStateSelect } from '@ringcentral-integration/engage-voice-widgets/components/MainViewPanel/WorkingStateSelect';

export type MainViewPanelProps = EvMainViewUIProps & EvMainViewUIFunctions & {
  showLeadsTab?: boolean;
};

const CustomIcon: FunctionComponent<RcIconProps> = (props) => {
  return <RcIcon className={styles.icon} {...props} />;
};

const MainViewPanel: FunctionComponent<MainViewPanelProps> = ({
  currentPath,
  goTo,
  agentStates,
  changeWorkingState,
  currentStateIndex,
  getStateColor,
  handleWithIntervalTime,
  stateText,
  time,
  getTimerText,
  disabled,
  children,
  currentLocale,
  isOffHookDisable,
  offhookState,
  offhook,
  isWide,
  isOffhooking,
  hideOffHookBtn,
  showLeadsTab,
}) => {
  const tabs: TabPropTypes[] = [
    {
      icon: () => <CustomIcon symbol={phoneBorderSvg} />,
      activeIcon: () => <CustomIcon symbol={phoneSvg} />,
      label: i18n.getString('dialpadLabel', currentLocale),
      path: '/dialer',
      isActive: (currentPath) =>
        currentPath === '/dialer' || /^\/activityCallLog/.test(currentPath),
      className: styles.tab,
    },
    showLeadsTab && {
      icon: () => <CustomIcon symbol={contactsBorderSvg} />,
      activeIcon: () => <CustomIcon symbol={contactsSvg} />,
      label: 'Leads',
      path: '/leads',
      isActive: (currentPath) => /^\/leads/.test(currentPath),
      className: styles.tab,
    },
    {
      icon: () => <CustomIcon symbol={TimeBorderSvg} />,
      activeIcon: () => <CustomIcon symbol={TimeSvg} />,
      label: i18n.getString('historyLabel', currentLocale),
      path: '/history',
      isActive: (currentPath) => /^\/history/.test(currentPath),
      className: styles.tab,
    },
    {
      icon: () => <CustomIcon symbol={settingsBorderSvg} />,
      activeIcon: () => <CustomIcon symbol={settingsSvg} />,
      label: i18n.getString('settingsLabel', currentLocale),
      path: '/settings',
      isActive: (currentPath) => /^\/settings/.test(currentPath),
      className: styles.tab,
    },
  ].filter(Boolean);

  const offHookIcon = useMemo(() => {
    let className;
    let symbol;
    let title;
    if (isOffHookDisable && !isOffhooking) {
      className = styles.offHookIcon;
      symbol = offHookSvgDisabled;
      title = i18n.getString('disabled', currentLocale);
    } else {
      switch (offhookState) {
        case 'connecting':
          className = styles.loading;
          symbol = offHookSvgConnecting;
          title = i18n.getString('disabled', currentLocale);
          break;
        case 'disconnecting':
          className = styles.loading;
          symbol = offHookSvgDisconnecting;
          title = i18n.getString('disabled', currentLocale);
          break;
        case 'disconnected':
          className = styles.offHookIcon;
          symbol = offHookSvgOff;
          title = i18n.getString('turnOn', currentLocale);
          break;
        case 'connected':
        default:
          className = styles.offHookIcon;
          symbol = offHookSvgOn;
          title = i18n.getString('turnOff', currentLocale);
      }
    }
    return (
      <Tooltip title={title}>
        <RcIcon className={className} symbol={symbol} />
      </Tooltip>
    );
  }, [offhookState, isOffHookDisable]);

  return (
    <TabNavigationView
      goTo={goTo}
      currentPath={currentPath}
      tabNavigationViewClassName={styles.tabNavigationView}
      navBarClassName={styles.navigationBar}
      className={styles.mainView}
      tabs={tabs}
    >
      <div className={styles.header}>
        <WorkingStateSelect
          handleWithIntervalTime={handleWithIntervalTime}
          getTimerText={getTimerText}
          time={time}
          stateText={stateText}
          getStateColor={getStateColor}
          currentStateIndex={currentStateIndex}
          changeWorkingState={changeWorkingState}
          agentStates={agentStates}
          disabled={disabled}
          isWide={isWide}
          hideOffHookBtn={hideOffHookBtn}
        />
        {!hideOffHookBtn && (
          <div
            className={classNames([
              styles.offHookState,
              isOffHookDisable ? styles.disabled : styles.enabled,
            ])}
            onClick={isOffHookDisable ? null : offhook}
          >
            {offHookIcon}
          </div>
        )}
      </div>
      {children}
    </TabNavigationView>
  );
};

export { MainViewPanel };
