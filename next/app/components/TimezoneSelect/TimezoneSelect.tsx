import { Autocomplete } from '@ringcentral/spring-ui';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type { FunctionComponent, SyntheticEvent } from 'react';
import React, { useMemo, useState, useCallback } from 'react';

import type { TimezoneSelectProps, TimezoneOption } from './TimezoneSelect.interface';

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Format a date with a specific timezone
 * @param date - The date to format
 * @param tz - The timezone to use
 * @returns ISO string with timezone offset
 */
export function formatDateTimeWithTimezone(date: Date, tz: string): string {
  const dateTimeString = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  const timeWithOffset = dayjs.tz(dateTimeString, tz).format();
  return timeWithOffset;
}

/**
 * Format a date to server time (America/New_York)
 * @param date - The date to format
 * @param tz - The source timezone
 * @returns Date string in server timezone
 */
export function formatDateTimeToServerTime(date: Date, tz: string): string {
  const timeWithOffset = formatDateTimeWithTimezone(date, tz);
  const serverTime = dayjs(new Date(timeWithOffset))
    .tz('America/New_York')
    .format('YYYY-MM-DD HH:mm:ss');
  return serverTime;
}

/**
 * Get available timezone options
 */
function getTimezoneOptions(): TimezoneOption[] {
  // Use Intl API if available (modern browsers)
  if (typeof Intl !== 'undefined' && (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf) {
    const timezones = (Intl as unknown as { supportedValuesOf: (key: string) => string[] }).supportedValuesOf('timeZone');
    return timezones.map((tz: string) => ({
      id: tz,
      label: tz,
    }));
  }

  // Fallback to guessing current timezone
  const guessed = dayjs.tz.guess();
  if (guessed) {
    return [{ id: guessed, label: guessed }];
  }
  return [];
}

/**
 * TimezoneSelect - Autocomplete component for selecting timezones
 *
 * Uses Intl.supportedValuesOf for timezone list in modern browsers,
 * falls back to dayjs.tz.guess() for older browsers.
 */
export const TimezoneSelect: FunctionComponent<TimezoneSelectProps> = ({
  value,
  onChange,
  label = 'Timezone',
  placeholder = 'Select timezone',
  helperText,
  error = false,
  required = false,
  disabled = false,
  'data-sign': dataSign = 'timezoneSelect',
  className,
}) => {
  const [inputValue, setInputValue] = useState('');

  const timezones = useMemo(() => getTimezoneOptions(), []);

  const selectedValue = useMemo(() => {
    if (!value) return null;
    return timezones.find((tz) => tz.id === value) || { id: value, label: value };
  }, [value, timezones]);

  const handleChange = useCallback(
    (_event: SyntheticEvent, newValue: TimezoneOption | null) => {
      onChange(newValue?.id || '');
    },
    [onChange],
  );

  const handleInputChange = useCallback(
    (_event: SyntheticEvent, newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [],
  );

  const filterOptions = useCallback(
    (options: TimezoneOption[], state: { inputValue: string }) => {
      const input = state.inputValue?.toLowerCase() || '';
      if (!input) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(input),
      );
    },
    [],
  );

  return (
    <Autocomplete
      options={timezones}
      value={selectedValue}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      filterOptions={filterOptions}
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      error={error}
      required={required}
      disabled={disabled}
      className={className}
      clearOnBlur
      data-sign={dataSign}
    />
  );
};
