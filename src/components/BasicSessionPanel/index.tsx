import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { RcSwitch, RcTextField, RcListItemText, RcMenuItem } from '@ringcentral/juno';
import { AnimationPanel } from '@ringcentral-integration/widgets/components/AnimationPanel';
import { CustomArrowButton } from '@ringcentral-integration/widgets/components/Rcui/CustomArrowButton';

import type { BasicSessionProps } from '@ringcentral-integration/engage-voice-widgets/interfaces/EvAgentSessionUI.interface';
import type { InboundQueuesPanelProps } from '@ringcentral-integration/engage-voice-widgets/components/InboundQueuesPanel';
import { InboundQueuesPanel } from '@ringcentral-integration/engage-voice-widgets/components/InboundQueuesPanel';
import { PickList } from '@ringcentral-integration/engage-voice-widgets/components/PickList';

import i18n from '@ringcentral-integration/engage-voice-widgets/components/BasicSessionPanel/i18n';
import styles from '@ringcentral-integration/engage-voice-widgets/components/BasicSessionPanel/styles.scss';
import pickStyles from '@ringcentral-integration/engage-voice-widgets/components/PickList/styles.scss';

export type BasicSessionPanelProps = BasicSessionProps &
  Omit<InboundQueuesPanelProps, 'goBack'> & {
    classes?: {
      root?: string;
    };
  } & {
    dialGroups: {
      groupId: string;
      groupName: string;
      groupDesc: string;
    }[];
    dialGroupId: string;
    setDialGroupId: (dialGroupId: string) => void;
  }

export const BasicSessionPanel: FunctionComponent<BasicSessionPanelProps> = ({
  currentLocale,
  selectedSkillProfileId,
  skillProfileList,
  setSkillProfileId,
  loginTypeList,
  loginType,
  setLoginType,
  extensionNumber,
  setExtensionNumber,
  inboundQueuesFieldText,
  isExtensionNumber,
  searchOption,
  inboundQueues,
  submitInboundQueues,
  getAssignedInboundQueues,
  isAllAssign,
  isSeveralAssign,
  checkBoxOnChange,
  allCheckBoxOnChange,
  setAutoAnswer,
  autoAnswer,
  showAutoAnswer,
  classes,
  showInboundQueues,
  showSkillProfile,
  dialGroups,
  dialGroupId,
  setDialGroupId,
}) => {
  const [inboundQueuesPageShow, setInboundQueuesPageShow] = useState(false);

  return (
    <>
      {showInboundQueues && (
        <AnimationPanel open={inboundQueuesPageShow}>
          <InboundQueuesPanel
            searchOption={searchOption}
            currentLocale={currentLocale}
            inboundQueues={inboundQueues}
            submitInboundQueues={submitInboundQueues}
            getAssignedInboundQueues={getAssignedInboundQueues}
            isAllAssign={isAllAssign}
            isSeveralAssign={isSeveralAssign}
            checkBoxOnChange={checkBoxOnChange}
            allCheckBoxOnChange={allCheckBoxOnChange}
            goBack={() => setInboundQueuesPageShow(false)}
          />
        </AnimationPanel>
      )}
      <div className={classes.root}>
        {showInboundQueues && (
          <RcTextField
            label={i18n.getString('inboundQueues', currentLocale)}
            gutterBottom
            title={inboundQueuesFieldText}
            value={inboundQueuesFieldText}
            fullWidth
            classes={{
              root: styles.customSelect,
            }}
            inputProps={{
              'data-sign': 'inboundQueues',
            }}
            InputProps={{
              readOnly: true,
              endAdornment: <CustomArrowButton />,
            }}
            clearBtn={false}
            onClick={() => setInboundQueuesPageShow(true)}
          />
        )}
        {showSkillProfile && (
          <PickList
            data-sign="skillProfile"
            options={skillProfileList}
            label={i18n.getString('skillProfile', currentLocale)}
            value={selectedSkillProfileId}
            optionValueKey="profileId"
            optionLabelKey="profileName"
            onChange={setSkillProfileId}
          />
        )}
        <PickList
          data-sign="dialGroup"
          options={dialGroups}
          label="Dial groups"
          value={dialGroupId}
          onChange={setDialGroupId}
          optionValueKey="groupId"
          optionLabelKey="groupName"
          placeholder="None"
          renderValue={(value) => {
            const selected = dialGroups.find((group) => group.groupId === value);
            if (!selected || !selected.groupId) {
              return "None"
            }
            return (
              <div
                className={pickStyles.menuItem}
                title={`ID: ${selected.groupId} ${selected.groupName}`}
              >
                {`ID: ${selected.groupId} ${selected.groupName}`}
              </div>
            );
          }}
          renderItem={(item) => {
            if (!item.groupId) {
              return (
                <RcListItemText
                  primary="None"
                />
              )
            }
            return (
              <RcListItemText
                primary={`${item.groupName}`}
                secondary={`ID: ${item.groupId} description: ${item.groupDesc}`}
              />
            );
          }}
        />
        <PickList
          data-sign="loginType"
          options={loginTypeList}
          label={i18n.getString('voiceConnection', currentLocale)}
          value={loginType}
          onChange={setLoginType}
        />
        {isExtensionNumber && (
          <RcTextField
            gutterBottom
            label={i18n.getString('extensionNumber', currentLocale)}
            fullWidth
            value={extensionNumber}
            placeholder={i18n.getString('enterYourPhoneNumber', currentLocale)}
            inputProps={{
              maxLength: 255,
              'data-sign': 'extensionNumber',
            }}
            clearBtn={false}
            classes={{
              root: styles.customSelect,
            }}
            onChange={({ target: { value } }) => {
              setExtensionNumber(value);
            }}
          />
        )}
        {/* <RcSwitch
        data-sign="takingCall"
        formControlLabelProps={{
          labelPlacement: 'start',
          classes: {
            labelPlacementStart: styles.root,
            label: styles.label,
          },
        }}
        label={i18n.getString('takingCall', currentLocale)}
        onChange={() => {
          // setTakingCall(!takingCall);
        }}
        // checked={takingCall}
      /> */}
        {showAutoAnswer && (
          <RcSwitch
            data-sign="autoAnswer"
            className={styles.switchRoot}
            formControlLabelProps={{
              labelPlacement: 'start',
              classes: {
                labelPlacementStart: styles.root,
                label: styles.label,
              },
            }}
            label={i18n.getString('answerCalls', currentLocale)}
            onChange={() => {
              setAutoAnswer(!autoAnswer);
            }}
            checked={autoAnswer}
          />
        )}
      </div>
    </>
  );
};

BasicSessionPanel.defaultProps = {
  classes: {},
};
