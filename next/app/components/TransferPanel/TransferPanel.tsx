import React, { useCallback, useEffect, useMemo, useState, type FunctionComponent } from 'react';
import { TabContext, Tabs, Tab, TabPanel, Switch, Button } from '@ringcentral/spring-ui';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';

import type { EvTransferType } from '../../../enums';
import { transferTypes } from '../../../enums';
import type { EvDirectAgentListItem, EvTransferPhoneBookItem } from '../../services/EvTransferCall/EvTransferCall.interface';
import type { EvAvailableRequeueQueue } from '../../services/EvClient';
import { InternalTransferTab } from './InternalTransferTab';
import { PhoneBookTransferTab } from './PhoneBookTransferTab';
import { ManualEntryTransferTab } from './ManualEntryTransferTab';
import { QueueTransferTab } from './QueueTransferTab';
import i18n from './i18n';

interface TransferTab {
  value: EvTransferType;
  label: string;
  disabled: boolean;
}

interface TransferPanelProps {
  allTabs: TransferTab[];
  defaultTab: EvTransferType | null;
  isStayOnCall: boolean;
  isTransferring: boolean;
  isDisabled: boolean;
  agentList: EvDirectAgentListItem[];
  phoneBook: EvTransferPhoneBookItem[];
  selectedAgentId: string | null;
  selectedPhoneBookIndex: number | null;
  manualEntryNumber: string;
  queueGroups: EvAvailableRequeueQueue[];
  selectedQueueGroupId: string;
  selectedGateId: string;
  onTabChange: (type: EvTransferType) => void;
  onStayOnCallChange: () => void;
  onSelectAgent: (agentId: string) => void;
  onSelectPhoneBookContact: (index: number | null) => void;
  onManualEntryChange: (value: string) => void;
  onQueueGroupChange: (groupId: string) => void;
  onGateChange: (gateId: string) => void;
  onTransfer: () => Promise<void>;
  onCancel: () => void;
  fetchAgentList: () => void;
}

/**
 * TransferPanel renders the tabbed transfer UI with destination selection and action buttons.
 */
export const TransferPanel: FunctionComponent<TransferPanelProps> = ({
  allTabs,
  defaultTab,
  isStayOnCall,
  isTransferring,
  isDisabled,
  agentList,
  phoneBook,
  selectedAgentId,
  selectedPhoneBookIndex,
  manualEntryNumber,
  queueGroups,
  selectedQueueGroupId,
  selectedGateId,
  onTabChange,
  onStayOnCallChange,
  onSelectAgent,
  onSelectPhoneBookContact,
  onManualEntryChange,
  onQueueGroupChange,
  onGateChange,
  onTransfer,
  onCancel,
  fetchAgentList,
}) => {
  const { t } = useLocale(i18n);
  const [activeTab, setActiveTab] = useState<EvTransferType | null>(defaultTab);

  const sortedTabs = useMemo(
    () => [...allTabs].sort((a, b) => Number(a.disabled) - Number(b.disabled)),
    [allTabs],
  );

  const disabledTabValues = new Set(
    sortedTabs.filter((tab) => tab.disabled).map((tab) => tab.value),
  );

  useEffect(() => {
    const shouldReset = activeTab === null || disabledTabValues.has(activeTab);
    if (shouldReset && defaultTab !== null) {
      setActiveTab(defaultTab);
      onTabChange(defaultTab);
    }
  }, [activeTab, defaultTab, disabledTabValues, onTabChange]);

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent | null, value: string | number | null) => {
      if (value === null) return;
      const tabValue = value as EvTransferType;
      if (disabledTabValues.has(tabValue)) return;
      setActiveTab(tabValue);
      onTabChange(tabValue);
    },
    [onTabChange, disabledTabValues],
  );

  return (
    <div className="flex flex-col flex-1 bg-neutral-base overflow-hidden">
      <TabContext value={activeTab} onChange={handleTabChange}>
        <div className="px-4 pt-2 flex-shrink-0">
          <Tabs variant="moreMenu" data-sign="transferTabs">
            {sortedTabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                id={tab.value}
                label={tab.label}
                disabled={tab.disabled}
                data-sign={`transferTab-${tab.value}`}
              />
            ))}
          </Tabs>
        </div>
        <div className="flex-1 px-4 pt-4 pb-2 overflow-auto">
          <TabPanel value={transferTypes.internal}>
            <InternalTransferTab
              isActive={activeTab === transferTypes.internal}
              agentList={agentList}
              selectedAgentId={selectedAgentId}
              onSelectAgent={onSelectAgent}
              fetchAgentList={fetchAgentList}
              labels={{
                searchAgents: t('searchAgents'),
                noAgents: t('noAgents'),
                available: t('available'),
                unavailable: t('unavailable'),
              }}
            />
          </TabPanel>
          <TabPanel value={transferTypes.phoneBook}>
            <PhoneBookTransferTab
              isActive={activeTab === transferTypes.phoneBook}
              phoneBook={phoneBook}
              selectedIndex={selectedPhoneBookIndex}
              onSelectContact={onSelectPhoneBookContact}
              labels={{
                searchContacts: t('searchContacts'),
                noContacts: t('noContacts'),
              }}
            />
          </TabPanel>
          <TabPanel value={transferTypes.manualEntry}>
            <ManualEntryTransferTab
              isActive={activeTab === transferTypes.manualEntry}
              value={manualEntryNumber}
              onChange={onManualEntryChange}
              labels={{ enterNumber: t('enterNumber') }}
            />
          </TabPanel>
          <TabPanel value={transferTypes.queue}>
            <QueueTransferTab
              queueGroups={queueGroups}
              selectedQueueGroupId={selectedQueueGroupId}
              selectedGateId={selectedGateId}
              onQueueGroupChange={onQueueGroupChange}
              onGateChange={onGateChange}
              labels={{
                selectQueueGroup: t('selectQueueGroup'),
                selectQueue: t('selectQueue'),
                noGroups: t('noGroups'),
                noQueues: t('noQueues'),
                selectAGroup: t('selectAGroup'),
                selectAQueue: t('selectAQueue'),
              }}
            />
          </TabPanel>
        </div>
      </TabContext>
      <div className="flex-shrink-0 px-4 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <Switch
            data-sign="stayOnCall"
            checked={isStayOnCall}
            onChange={onStayOnCallChange}
          />
          <span className="typography-mainText">{t('stayOnCall')}</span>
        </div>
        <div className="flex gap-2">
          <Button
            data-sign="cancelTransfer"
            variant="outlined"
            color="neutral"
            fullWidth
            onClick={onCancel}
          >
            {t('cancel')}
          </Button>
          <Button
            data-sign="executeTransfer"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isDisabled}
            loading={isTransferring}
            onClick={onTransfer}
          >
            {t('transfer')}
          </Button>
        </div>
      </div>
    </div>
  );
};
