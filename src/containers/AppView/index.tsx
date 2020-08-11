import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import withPhone from 'ringcentral-widgets/lib/withPhone';

import styles from '@ringcentral-integration/engage-voice-widgets/containers/AppView/styles.scss';

import Environment from '../../components/Environment';

interface AppViewProps {
  server: string;
  redirectUri: string;
  enabled: boolean;
  clientId?: string;
  clientSecret?: string;
  evAuthServer?: string;
  onSetData: (options: any) => any;
}

const AppViewPanel: FunctionComponent<AppViewProps> = (props) => {
  const {
    children,
    server,
    enabled,
    onSetData,
    redirectUri,
    clientId,
    clientSecret,
    evAuthServer
  } = props;
  return (
    <div className={styles.root}>
      {children}
      <Environment
        server={server}
        enabled={enabled}
        onSetData={onSetData}
        redirectUri={redirectUri}
        clientId={clientId}
        clientSecret={clientSecret}
        evAuthServer={evAuthServer}
        recordingHost=""
      />
    </div>
  );
};

AppViewPanel.defaultProps = {
  enabled: false,
  clientId: null,
  clientSecret: null,
  evAuthServer: '',
};

function mapToFunctions(_, { phone: { oAuth, environment } }) {
  return {
    server: environment.server,
    enabled: environment.enabled,
    redirectUri: oAuth.redirectUri,
    clientId: environment.clientId,
    clientSecret: environment.clientSecret,
    evAuthServer: environment.evAuthServer,
  };
}

function mapToProps(_, { phone: { environment } }) {
  return {
    onSetData: (options: any) => {
      environment.setData(options);
    },
  };
}

export const AppView = withPhone(
  connect(mapToFunctions, mapToProps)(AppViewPanel),
);
