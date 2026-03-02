import dayjs from 'dayjs';

import type { CallInfoItem } from '../components/CallInfoHeader';

interface CallInfoMapping {
  attr: string;
  name: string;
  formatTime?: boolean;
}

const CALL_INFO_MAP_LIST: CallInfoMapping[] = [
  { attr: 'dnis', name: 'DNIS' },
  { attr: 'uii', name: 'Call ID' },
  { attr: 'termParty', name: 'Term Party' },
  { attr: 'termReason', name: 'Term Reason' },
  { attr: 'callDts', name: 'Call Time', formatTime: true },
];

/**
 * Extract call detail metadata from call data for display in call info panel.
 */
export function getCallInfos(call: Record<string, any>): CallInfoItem[] {
  const endedCall = call.endedCall ?? {};
  return CALL_INFO_MAP_LIST.reduce<CallInfoItem[]>(
    (list, { attr, name, formatTime }) => {
      const value: string = call[attr] || endedCall[attr] || '';
      if (value) {
        list.push({
          name,
          content: formatTime
            ? dayjs(value).format('YYYY-MM-DD HH:mm:ss')
            : value,
        });
      }
      return list;
    },
    [],
  );
}
