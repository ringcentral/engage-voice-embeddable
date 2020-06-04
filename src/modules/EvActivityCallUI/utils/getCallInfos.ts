import { EvCall } from '@ringcentral-integration/engage-voice-widgets/interfaces';
import moment from 'moment-timezone';

const callInfoMapList: {
  attr: keyof EvCall | keyof EvCall['endedCall'];
  name: string;
  formatTime?: boolean;
}[] = [
  { attr: 'dnis', name: 'DNIS' },
  { attr: 'uii', name: 'Call ID' },
  { attr: 'termParty', name: 'Term Party' },
  { attr: 'termReason', name: 'Term Reason' },
  { attr: 'timestamp', name: 'Call Time', formatTime: true },
];

export const getCallInfos = (dataSource: EvCall) => {
  return callInfoMapList.reduce((list, { attr, name, formatTime }) => {
    let value: string;
    if (dataSource[attr]) {
      value = dataSource[attr] || '';
    }

    if (!value && dataSource.endedCall) {
      value = dataSource.endedCall[attr] || '';
    }

    if (value !== undefined) {
      list.push({
        attr,
        name,
        content: formatTime
          ? moment(value).format('YYYY-MM-DD HH:mm:ss')
          : value,
      });
    }
    return list;
  }, []);
};
