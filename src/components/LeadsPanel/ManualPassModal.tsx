import React, { useState, useEffect } from 'react';
import {
  RcDialog,
  RcDialogContent,
  RcDialogActions,
  RcDialogTitle,
  RcButton,
  RcTextarea,
  RcSelect,
  RcCheckbox,
  RcMenuItem,
  RcDatePicker,
  RcTimePicker,
} from '@ringcentral/juno';
import {
  updateFullTime,
  updateFullYear,
} from '@ringcentral-integration/commons/helpers/meetingHelper';
import { TimezoneSelect, formatDateTimeToServerTime } from '../TimezoneSelect';

export function ManualPassModal({
  onClose,
  open,
  fetchDispositionList,
  onPass,
  disabled,
  campaignId,
  defaultTimezone,
}: {
  onClose: () => void;
  open: boolean;
  fetchDispositionList: (campaignId: string) => Promise<{ value: string; label: string }[]>;
  onPass: ({
    dispositionId,
    notes,
    callback,
    callbackDTS,
  }: {
    dispositionId: string;
    notes: string;
    callback: boolean;
    callbackDTS: string;
  }) => Promise<void>;
  disabled: boolean;
  campaignId: string;
  defaultTimezone: string;
}) {
  const [dispositionList, setDispositionList] = useState<{ value: string; label: string }[]>([]);
  const [notes, setNotes] = useState('');
  const [callback, setCallback] = useState(false);
  const [callbackDTS, setCallbackDTS] = useState(new Date(new Date().getTime() + 1000 * 60 * 60 * 24)); // 1 day from now
  const [disposition, setDisposition] = useState('');
  const [loading, setLoading] = useState(false);
  const [timezone, setTimezone] = useState(defaultTimezone);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const list = await fetchDispositionList(campaignId);
        if (!mounted) return;
        setDispositionList(list);
        setTimezone(defaultTimezone || 'America/New_York');
      } catch (error) {
        console.error('error', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
}, [open, campaignId]);

  if (!open) {
    return null;
  }

  return (
    <RcDialog open={open} onClose={onClose} fullScreen>
      <RcDialogTitle>
        Manual Pass
      </RcDialogTitle>
      <RcDialogContent>
        <RcTextarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          minRows={1}
          maxRows={5}
          fullWidth
          gutterBottom
        />
        <RcSelect
          label="Disposition"
          value={disposition}
          onChange={(e) => setDisposition(e.target.value as string)}
          fullWidth
          required
          gutterBottom
        >
          {dispositionList.map((item) => (
            <RcMenuItem key={item.value} value={item.value}>
              {item.label}
            </RcMenuItem>
          ))}
        </RcSelect>
        {
          disposition && (
            <>
              <RcCheckbox
                label="Set a specific callback time"
                checked={callback}
                formControlLabelProps={{
                  labelPlacement: 'end',
                }}
                onChange={(e, checked) => setCallback(checked)}
              />
              {
                callback && (
                  <>
                    <TimezoneSelect
                      value={timezone}
                      onChange={(value) => setTimezone(value)}
                      label="Timezone"
                      placeholder="Select timezone"
                    />
                    <RcDatePicker
                      value={callbackDTS}
                      onChange={(value) => {
                        setCallbackDTS(
                          new Date(updateFullYear(callbackDTS, value))
                        );
                      }}
                      disablePast
                      fullWidth
                      label="Callback date"
                      clearBtn={false}
                      gutterBottom
                    />
                    <RcTimePicker
                      value={callbackDTS}
                      onChange={(value) => setCallbackDTS(
                        new Date(updateFullTime(callbackDTS, value))
                      )}
                      fullWidth
                      dateMode
                      isTwelveHourSystem
                      label="Callback time"
                      clearBtn={false}
                      gutterBottom
                    />
                  </>
                )
              }
            </>
          )
        }
      </RcDialogContent>
      <RcDialogActions>
        <RcButton variant="plain" onClick={onClose}>
          Cancel
        </RcButton>
        <RcButton
          variant="contained"
          color="primary"
          onClick={() => onPass({
            dispositionId: disposition,
            notes,
            callback,
            callbackDTS: callback ? formatDateTimeToServerTime(callbackDTS, timezone) : '',
          })}
          disabled={disabled || loading || !disposition}
        >
          Submit
        </RcButton>
      </RcDialogActions>
    </RcDialog>
  );
}