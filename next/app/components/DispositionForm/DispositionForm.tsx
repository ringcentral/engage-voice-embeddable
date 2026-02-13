import { Select, Option, Textarea } from '@ringcentral/spring-ui';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';

import type { DispositionFormProps } from './DispositionForm.interface';

/**
 * DispositionForm - Call disposition form with validation
 *
 * Renders a disposition dropdown and optional notes textarea
 * with Spring UI Select and Textarea components.
 * Supports validation and required field indicators.
 */
export const DispositionForm: FunctionComponent<DispositionFormProps> = ({
  dispositionPickList,
  dispositionData,
  validated,
  required,
  hideCallNote = false,
  onFieldChange,
  selectPlaceholder = 'Please select',
  dispositionErrorText = 'Please choose a disposition before submitting.',
  notesErrorText = 'Notes are required for this disposition.',
  dispositionLabel = 'Disposition',
  notesLabel = 'Notes',
  notesPlaceholder = 'Enter notes...',
  className,
  'data-sign': dataSign = 'dispositionForm',
}) => {
  const hasDispositions = dispositionPickList.length > 0;
  const showNotes = !hideCallNote;

  if (!hasDispositions && !showNotes) {
    return null;
  }

  const dispositionOptions = dispositionPickList.map((item) => ({
    value: item.dispositionId,
    label: item.disposition,
  }));

  const handleDispositionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange('dispositionId', e.target.value || '');
    },
    [onFieldChange],
  );

  const selectedValue = dispositionData?.dispositionId || null;

  return (
    <div className={clsx('space-y-4', className)} data-sign={dataSign}>
      {/* Disposition Dropdown */}
      {hasDispositions && (
        <div data-sign="dispositionField">
          <Select
            label={dispositionLabel}
            value={selectedValue}
            placeholder={selectPlaceholder}
            onChange={handleDispositionChange}
            error={!validated.dispositionId}
            helperText={!validated.dispositionId ? dispositionErrorText : undefined}
            required
            data-sign="dispositionSelect"
            renderValue={(value) => {
              if (!value) return selectPlaceholder;
              const selected = dispositionOptions.find((item) => item.value === value);
              return selected?.label || selectPlaceholder;
            }}
          >
            {dispositionOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      )}
      {/* Notes Textarea */}
      {showNotes && (
        <div data-sign="notesField">
          <Textarea
            label={
              required.notes
                ? `${notesLabel} *`
                : notesLabel
            }
            value={dispositionData?.notes || ''}
            onChange={(event) => {
              onFieldChange('notes', (event.target as HTMLTextAreaElement).value);
            }}
            error={!validated.notes}
            helperText={!validated.notes ? notesErrorText : undefined}
            placeholder={notesPlaceholder}
            maxLength={32000}
            fullWidth
            rows={4}
            data-sign="notesTextarea"
          />
        </div>
      )}
    </div>
  );
};
