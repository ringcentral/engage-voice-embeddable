import { formatCallLogTask } from 'src/app/utils/formatCallLogTask';

const pickList = [
  { dispositionId: '100', label: 'Sale Made' },
  { dispositionId: '200', label: 'No Answer' },
];

describe('formatCallLogTask', () => {
  it('adds the selected disposition label as dispositionName', () => {
    expect(
      formatCallLogTask(
        { dispositionId: '200', notes: 'call back later', summary: 'summary' },
        pickList,
      ),
    ).toEqual({
      dispositionId: '200',
      dispositionName: 'No Answer',
      notes: 'call back later',
      summary: 'summary',
    });
  });

  it('sets dispositionName to null when no disposition is selected', () => {
    expect(
      formatCallLogTask(
        { dispositionId: null, notes: 'notes', summary: '' },
        pickList,
      ),
    ).toEqual({
      dispositionId: null,
      dispositionName: null,
      notes: 'notes',
      summary: '',
    });
  });

  it('sets dispositionName to null when the id is not in the pick list', () => {
    expect(
      formatCallLogTask(
        { dispositionId: '999', notes: '', summary: '' },
        pickList,
      )?.dispositionName,
    ).toBeNull();
  });

  it('returns undefined when the call has no disposition data', () => {
    expect(formatCallLogTask(undefined, pickList)).toBeUndefined();
  });
});
