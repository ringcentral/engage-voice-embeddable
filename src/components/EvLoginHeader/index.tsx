import type { FunctionComponent } from 'react';
import React from 'react';

import classNames from 'classnames';
import styles from './styles.scss';
import RingCXLogo from '../../assets/ringCXLogo.svg';

export interface EvLoginHeaderProps {
  wrapperStyle?: string;
  svgStyle?: string;
}

export const EvLoginHeader: FunctionComponent<EvLoginHeaderProps> = ({
  wrapperStyle,
  svgStyle,
}) => {
  return (
    <div className={classNames(styles.evLogin, wrapperStyle)}>
      <RingCXLogo className={svgStyle} />
    </div>
  );
};
