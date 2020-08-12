import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from 'ringcentral-widgets/components/Environment/styles.scss';

import BackHeader from 'ringcentral-widgets/components/BackHeader';
import Panel from 'ringcentral-widgets/components/Panel';
import Line from 'ringcentral-widgets/components/Line';
import IconLine from 'ringcentral-widgets/components/IconLine';
import TextInput from 'ringcentral-widgets/components/TextInput';
import Switch from 'ringcentral-widgets/components/Switch';
import { Button } from 'ringcentral-widgets/components/Button';

/**
 * Environment component for switching api server. Intended only for testing.
 * This component current does not comply to use redux properly.
 */

class Environment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: props.defaultHidden,
      serverValue: props.server,
      recordingHostValue: props.recordingHost,
      enabledValue: props.enabled,
      clientIdValue: props.clientId,
      clientSecretValue: props.clientSecret,
      evAuthServerValue: props.evAuthServer,
    };

    this.onServerChange = (e) => {
      this.setState({
        serverValue: e.currentTarget.value,
      });
    };
    this.onClientIdChange = (e) => {
      this.setState({
        clientIdValue: e.currentTarget.value,
      });
    };
    this.onClientSecretChange = (e) => {
      this.setState({
        clientSecretValue: e.currentTarget.value,
      });
    };
    this.onEvAuthServerChange = (e) => {
      this.setState({
        evAuthServerValue: e.currentTarget.value,
      });
    };
    this.onToggleEnabled = (e) => {
      this.setState({
        enabledValue: !this.state.enabledValue,
      });
    };
    this.onOk = () => {
      this.props.onSetData({
        server: this.state.serverValue,
        recordingHost: this.state.recordingHostValue,
        enabled: this.state.enabledValue,
        clientId: this.state.clientIdValue,
        clientSecret: this.state.clientSecretValue,
        evAuthServer: this.state.evAuthServerValue,
      });
      this.toggleEnv();
    };
    this.onCancel = () => {
      this.setState({
        serverValue: this.props.server,
        recordingHostValue: this.props.recordingHost,
        enabledValue: this.props.enabled,
        clientIdValue: this.props.clientId,
        clientSecretValue: this.props.clientSecret,
        evAuthServerValue: this.props.evAuthServer,
      });
      this.toggleEnv();
    };
    this.toggleEnv = () => {
      this.setState({
        hidden: !this.state.hidden,
      });
    };
    if (typeof window !== 'undefined') {
      window.toggleEnv = this.toggleEnv;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.server !== this.props.server) {
      this.setState({
        serverValue: nextProps.server,
      });
    }
    if (nextProps.recordingHost !== this.props.recordingHost) {
      this.setState({
        recordingHostValue: nextProps.recordingHost,
      });
    }
    if (nextProps.enabled !== this.props.enabled) {
      this.setState({
        enabledValue: nextProps.enabled,
      });
    }
  }

  render() {
    if (this.state.hidden) {
      return null;
    }
    const hasChanges = !(
      this.state.serverValue === this.props.server &&
      this.state.enabledValue === this.props.enabled &&
      this.state.recordingHostValue === this.props.recordingHost &&
      this.state.clientIdValue === this.props.clientId &&
      this.state.clientSecretValue === this.props.clientSecret &&
      this.state.evAuthServerValue === this.props.evAuthServer
    );
    return (
      <div className={styles.root}>
        <BackHeader onBackClick={this.onCancel} buttons={[]}>
          Environment
        </BackHeader>
        <Panel classname={styles.content}>
          <Line>
            Server
            <TextInput
              dataSign="envServerUrl"
              value={this.state.serverValue}
              onChange={this.onServerChange}
            />
          </Line>
          <Line>
            RingCentral Client Id
            <TextInput
              value={this.state.clientIdValue}
              onChange={this.onClientIdChange}
              placeholder="Optional"
            />
          </Line>
          <Line>
            RingCentral Client Secret
            <TextInput
              value={this.state.clientSecretValue}
              onChange={this.onClientSecretChange}
              placeholder="Optional"
            />
          </Line>
          <Line>
            Engage Voice Auth server
            <TextInput
              value={this.state.evAuthServerValue}
              onChange={this.onEvAuthServerChange}
            />
          </Line>
          <IconLine
            icon={
              <Switch
                dataSign="envToggle"
                checked={this.state.enabledValue}
                onChange={this.onToggleEnabled}
              />
            }
          >
            Enable
          </IconLine>
          <Line>
            Redirect Url
            <TextInput
              value={this.props.redirectUri}
              disabled
            />
          </Line>
          <Line>
            <Button
              dataSign="envSave"
              className={classnames(
                styles.saveButton,
                !hasChanges ? styles.disabled : null,
              )}
              onClick={this.onOk}
              disabled={!hasChanges}
            >
              Save
            </Button>
          </Line>
        </Panel>
      </div>
    );
  }
}

Environment.propTypes = {
  server: PropTypes.string.isRequired,
  recordingHost: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  onSetData: PropTypes.func.isRequired,
  defaultHidden: PropTypes.bool,
  clientId: PropTypes.string,
  clientSecret: PropTypes.string,
  evAuthServer: PropTypes.string,
  redirectUri: PropTypes.string,
};

Environment.defaultProps = {
  defaultHidden: true,
  clientId: '',
  clientSecret: '',
  evAuthServer: '',
  redirectUri: '',
};

export default Environment;
