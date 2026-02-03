import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { TextField, Switch, Icon } from '@ringcentral/spring-ui';
import { CaretDownMd } from '@ringcentral/spring-icon';
import React, { useCallback, useMemo } from 'react';

import type { LoginTypes } from '../../../enums';
import type { SessionConfigProps } from './SessionConfig.interface';
import i18n from './i18n';

/**
 * SessionConfig - Reusable session configuration form component
 * Provides skill profile, inbound queues, dial group, voice connection,
 * and auto answer configuration options using Spring UI components
 */
function SessionConfig({
  skillProfileList = [],
  selectedSkillProfileId,
  onSkillProfileChange,
  showSkillProfile = false,
  inboundQueues = [],
  selectedInboundQueueIds = [],
  onInboundQueuesChange,
  showInboundQueues = false,
  showInboundQueuesPanel = false,
  onShowInboundQueuesPanelChange,
  dialGroups = [],
  dialGroupId,
  onDialGroupChange,
  showDialGroup = false,
  autoAnswer = false,
  onAutoAnswerChange,
  showAutoAnswer = false,
  loginTypeList = [],
  loginType,
  onLoginTypeChange,
  showVoiceConnection = false,
  extensionNumber = '',
  onExtensionNumberChange,
  showExtensionNumber = false,
}: SessionConfigProps) {
  const { t } = useLocale(i18n);

  const handleSkillProfileChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSkillProfileChange?.(e.target.value);
    },
    [onSkillProfileChange],
  );

  const handleDialGroupChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onDialGroupChange?.(e.target.value);
    },
    [onDialGroupChange],
  );

  const handleLoginTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onLoginTypeChange?.(e.target.value as LoginTypes);
    },
    [onLoginTypeChange],
  );

  const handleAutoAnswerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onAutoAnswerChange?.(e.target.checked);
    },
    [onAutoAnswerChange],
  );

  const handleExtensionNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onExtensionNumberChange?.(e.target.value);
    },
    [onExtensionNumberChange],
  );

  const handleOpenQueuesPanel = useCallback(() => {
    onShowInboundQueuesPanelChange?.(true);
  }, [onShowInboundQueuesPanelChange]);

  const inboundQueuesFieldText = useMemo(() => {
    if (selectedInboundQueueIds.length === 0) {
      return t('noneSelected');
    }
    if (selectedInboundQueueIds.length === inboundQueues.length) {
      return `${t('all')} (${inboundQueues.length})`;
    }
    return `${selectedInboundQueueIds.length} ${t('selected')}`;
  }, [selectedInboundQueueIds, inboundQueues.length, t]);

  // Add "None" option to dial groups only if there isn't one already
  const dialGroupOptions = useMemo(() => {
    const hasNoneOption = dialGroups.some((group) => !group.groupId);
    if (hasNoneOption) {
      return dialGroups;
    }
    const noneOption = { groupId: '', groupName: t('none'), groupDesc: '' };
    return [noneOption, ...dialGroups];
  }, [dialGroups, t]);

  // Don't render form when inbound queues panel is shown
  if (showInboundQueuesPanel) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Inbound Queues */}
      {showInboundQueues && inboundQueues.length > 0 && (
        <button
          type="button"
          onClick={handleOpenQueuesPanel}
          className="w-full text-left"
          data-sign="inboundQueues"
        >
          <div className="relative">
            <label className="typography-descriptor text-neutral-b2 block mb-1">
              {t('inboundQueues')}
            </label>
            <div className="w-full h-10 px-3 flex items-center justify-between border border-neutral-b4 rounded-lg bg-neutral-base hover:border-neutral-b3 transition-colors cursor-pointer">
              <span className="typography-mainText text-neutral-b1 truncate">
                {inboundQueuesFieldText}
              </span>
              <Icon symbol={CaretDownMd} size="medium" className="text-neutral-b2 flex-shrink-0" />
            </div>
          </div>
        </button>
      )}
      {/* Skill Profile */}
      {showSkillProfile && skillProfileList.length > 0 && (
        <div>
          <label className="typography-descriptor text-neutral-b2 block mb-1">
            {t('skillProfile')}
          </label>
          <div className="relative">
            <select
              value={selectedSkillProfileId || ''}
              onChange={handleSkillProfileChange}
              className="w-full h-10 px-3 pr-8 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText text-neutral-b1 appearance-none cursor-pointer hover:border-neutral-b3 focus:border-primary-b focus:outline-none transition-colors"
              data-sign="skillProfile"
              aria-label={t('skillProfile')}
            >
              {skillProfileList.map((profile) => (
                <option key={profile.profileId} value={profile.profileId}>
                  {profile.profileName}
                </option>
              ))}
            </select>
            <Icon symbol={CaretDownMd} size="medium" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-b2 pointer-events-none" />
          </div>
        </div>
      )}
      {/* Dial Group - Always show when showDialGroup is true */}
      {showDialGroup && (
        <div>
          <label className="typography-descriptor text-neutral-b2 block mb-1">
            {t('dialGroup')}
          </label>
          <div className="relative">
            <select
              value={dialGroupId || ''}
              onChange={handleDialGroupChange}
              className="w-full h-10 px-3 pr-8 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText text-neutral-b1 appearance-none cursor-pointer hover:border-neutral-b3 focus:border-primary-b focus:outline-none transition-colors"
              data-sign="dialGroup"
              aria-label={t('dialGroup')}
            >
              {dialGroupOptions.map((group) => (
                <option key={group.groupId || 'none'} value={group.groupId}>
                  {group.groupId ? `ID: ${group.groupId} ${group.groupName}` : t('none')}
                </option>
              ))}
            </select>
            <Icon symbol={CaretDownMd} size="medium" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-b2 pointer-events-none" />
          </div>
        </div>
      )}
      {/* Voice Connection */}
      {showVoiceConnection && loginTypeList.length > 0 && (
        <div>
          <label className="typography-descriptor text-neutral-b2 block mb-1">
            {t('voiceConnection')}
          </label>
          <div className="relative">
            <select
              value={loginType as string || ''}
              onChange={handleLoginTypeChange}
              className="w-full h-10 px-3 pr-8 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText text-neutral-b1 appearance-none cursor-pointer hover:border-neutral-b3 focus:border-primary-b focus:outline-none transition-colors"
              data-sign="loginType"
              aria-label={t('voiceConnection')}
            >
              {loginTypeList.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
            <Icon symbol={CaretDownMd} size="medium" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-b2 pointer-events-none" />
          </div>
        </div>
      )}
      {/* Extension Number */}
      {showExtensionNumber && (
        <TextField
          label={t('extensionNumber')}
          value={extensionNumber}
          onChange={handleExtensionNumberChange}
          placeholder={t('enterYourPhoneNumber')}
          variant="outlined"
          size="large"
          fullWidth
          clearBtn={false}
          inputProps={{
            maxLength: 255,
            'data-sign': 'extensionNumber',
          }}
        />
      )}
      {/* Auto Answer */}
      {showAutoAnswer && (
        <div className="flex items-center justify-between">
          <span className="typography-mainText text-neutral-b1">
            {t('autoAnswer')}
          </span>
          <Switch
            checked={autoAnswer}
            onChange={handleAutoAnswerChange}
            data-sign="autoAnswer"
          />
        </div>
      )}
    </div>
  );
}

export { SessionConfig };
