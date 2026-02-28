import React, { useCallback, useEffect, useRef, type FunctionComponent } from 'react';
import { DialTextField, DialDelete, IconButton } from '@ringcentral/spring-ui';
import { BackspaceMd } from '@ringcentral/spring-icon';

interface ManualEntryTransferTabProps {
  isActive: boolean;
  value: string;
  onChange: (value: string) => void;
  labels: {
    enterNumber: string;
  };
}

/**
 * Manual entry transfer tab content with dial text field.
 */
export const ManualEntryTransferTab: FunctionComponent<ManualEntryTransferTabProps> = ({
  isActive,
  value,
  onChange,
  labels,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive) {
      inputRef.current?.focus();
    }
  }, [isActive]);

  const handleDelete = useCallback(() => {
    onChange(value.slice(0, -1));
  }, [value, onChange]);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const hasValue = value.trim().length > 0;

  return (
    <div className="flex-1" data-sign="manualEntryTransferTab">
      <DialTextField
        data-sign="transferNumberField"
        value={value}
        onChange={onChange}
        placeholder={labels.enterNumber}
        fullWidth
        onlyAllowKeypadValue
        inputRef={inputRef}
        endAdornment={
          hasValue ? (
            <DialDelete onDelete={handleDelete} onClear={handleClear}>
              <IconButton
                symbol={BackspaceMd}
                variant="icon"
                size="small"
                color="neutral"
                data-sign="deleteButton"
              />
            </DialDelete>
          ) : undefined
        }
      />
    </div>
  );
};
