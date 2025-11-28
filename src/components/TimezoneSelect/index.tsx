import React, { useMemo, useState } from 'react';
import { RcDownshift } from '@ringcentral/juno';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZoneFilter = (options, { inputValue, getOptionLabel, inputChanged  }) => {
  if (!inputChanged) {
    return options;
  }

  const input = inputValue?.toLowerCase() || '';
  return options.filter((item) =>
    getOptionLabel?.(item)
      .toLowerCase()
      .includes(input),
  );
};

export interface TimezoneSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  dataSign?: string;
}

export function formatDateTimeToServerTime(date: Date, timezone: string) {
  const dateTimeString = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  const timeWithOffset = dayjs.tz(dateTimeString, timezone).format();
  // convert to server time
  const serverTime = dayjs(new Date(timeWithOffset)).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
  return serverTime;
}

export function TimezoneSelect({
  value,
  onChange,
  label = 'Timezone',
  placeholder,
  helperText,
  error,
  required,
  disabled,
  dataSign = 'timezoneSelect',
}: TimezoneSelectProps) {
  const [inputValue, setInputValue] = useState('');
  const timezones = useMemo(() => {
    if (typeof Intl !== 'undefined' && (Intl as any).supportedValuesOf) {
      return (Intl as any).supportedValuesOf('timeZone').map((tz: string) => ({
        id: tz,
        label: tz,
      }));
    }
    // Fallback to basic guessing or empty if not supported
    const guessed = dayjs.tz.guess();
    if (guessed) {
      return [{ id: guessed, label: guessed }];
    }
    return [];
  }, []);

  const selectedItems = useMemo(() => {
    if (!value) return [];
    const found = timezones.find((tz) => tz.id === value);
    return found ? [found] : [{ id: value, label: value }];
  }, [value, timezones]);

  return (
    <RcDownshift
      variant="autocomplete"
      label={label}
      placeholder={placeholder}
      options={timezones}
      inputValue={inputValue}
      onInputChange={(newValue) => setInputValue(newValue || '')}
      value={selectedItems}
      onChange={(items) => {
        const selected = items[0];
        onChange(selected ? (selected.id as string) : '');
      }}
      multiple={false}
      freeSolo={false}
      clearBtn
      error={error}
      helperText={helperText}
      required={required}
      disabled={disabled}
      fullWidth
      inputProps={{
        'data-sign': dataSign,
      }}
      disableCloseOnSelect={false}
      filterOptions={timeZoneFilter}
      openOnFocus
      gutterBottom
    />
  );
}
