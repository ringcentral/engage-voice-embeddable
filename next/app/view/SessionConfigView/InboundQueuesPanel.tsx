import { Button, Checkbox, Icon } from '@ringcentral/spring-ui';
import { ArrowLeftMd, SearchMd } from '@ringcentral/spring-icon';
import React, { useState, useCallback, useMemo } from 'react';

interface InboundQueue {
  gateId: string;
  gateName: string;
  checked?: boolean;
}

interface InboundQueuesPanelProps {
  inboundQueues: InboundQueue[];
  selectedQueueIds: string[];
  onSubmit: (selectedIds: string[]) => void;
  onBack: () => void;
}

/**
 * InboundQueuesPanel - Panel for selecting inbound queues
 * Provides search, select all, and individual selection functionality
 */
function InboundQueuesPanel({
  inboundQueues,
  selectedQueueIds,
  onSubmit,
  onBack,
}: InboundQueuesPanelProps) {
  const [searchText, setSearchText] = useState('');
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedQueueIds);

  const filteredQueues = useMemo(() => {
    if (!searchText.trim()) {
      return inboundQueues;
    }
    const lowerSearch = searchText.toLowerCase();
    return inboundQueues.filter((queue) =>
      queue.gateName.toLowerCase().includes(lowerSearch),
    );
  }, [inboundQueues, searchText]);

  const isAllSelected = useMemo(() => {
    return (
      inboundQueues.length > 0 &&
      inboundQueues.every((queue) => localSelectedIds.includes(queue.gateId))
    );
  }, [inboundQueues, localSelectedIds]);

  const isIndeterminate = useMemo(() => {
    return (
      localSelectedIds.length > 0 &&
      localSelectedIds.length < inboundQueues.length
    );
  }, [inboundQueues, localSelectedIds]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    [],
  );

  const handleQueueToggle = useCallback((gateId: string) => {
    setLocalSelectedIds((prev) =>
      prev.includes(gateId)
        ? prev.filter((id) => id !== gateId)
        : [...prev, gateId],
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setLocalSelectedIds([]);
    } else {
      setLocalSelectedIds(inboundQueues.map((queue) => queue.gateId));
    }
  }, [isAllSelected, inboundQueues]);

  const handleSubmit = useCallback(() => {
    onSubmit(localSelectedIds);
  }, [onSubmit, localSelectedIds]);

  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  return (
    <div className="flex flex-col h-full bg-neutral-base">
      {/* Header */}
      <div className="flex items-center px-2 py-3 border-b border-neutral-b4">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-neutral-b5 transition-colors"
          data-sign="backButton"
          aria-label="Back"
        >
          <Icon symbol={ArrowLeftMd} size="medium" className="text-neutral-b1" />
        </button>
        <span className="typography-subtitle text-neutral-b1 ml-2">
          Inbound queues
        </span>
      </div>
      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Icon symbol={SearchMd} size="medium" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-b3" />
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search"
            className="w-full h-10 pl-10 pr-3 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText text-neutral-b1 placeholder:text-neutral-b3 hover:border-neutral-b3 focus:border-primary-b focus:outline-none transition-colors"
            data-sign="searchInput"
          />
        </div>
      </div>
      {/* Queue List */}
      <div className="flex-1 overflow-y-auto px-4">
        {filteredQueues.map((queue) => (
          <label
            key={queue.gateId}
            className="flex items-center py-2 cursor-pointer hover:bg-neutral-b5 rounded px-2"
          >
            <Checkbox
              checked={localSelectedIds.includes(queue.gateId)}
              onChange={() => handleQueueToggle(queue.gateId)}
            />
            <span className="typography-mainText text-neutral-b1 ml-3 truncate">
              {queue.gateName}
            </span>
          </label>
        ))}
      </div>
      {/* Footer */}
      <div className="px-4 py-4 border-t border-neutral-b4">
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center cursor-pointer">
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
              data-sign="bulkChangeCheckBox"
            />
            <span className="typography-mainText text-neutral-b1 ml-3">
              Select all
            </span>
          </label>
          <span
            className="typography-descriptor text-neutral-b2"
            data-sign="selectedTips"
          >
            {localSelectedIds.length} of {inboundQueues.length} selected
          </span>
        </div>
        <Button
          data-sign="update"
          onClick={handleSubmit}
          fullWidth
        >
          Update
        </Button>
      </div>
    </div>
  );
}

export { InboundQueuesPanel };
export type { InboundQueuesPanelProps };
