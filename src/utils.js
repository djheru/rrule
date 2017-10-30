import moment from 'moment';

export const ords = (n) => (n < 11 || n > 13) ?
  ['st', 'nd', 'rd', 'th'][Math.min((n - 1) % 10, 3)] : 'th';

export const defaultOptions = {
  repeatType: '',
  repeatByType: '',
  interval: 0, // e.g. every 3 days
  dayArray: [],
  count: 0, // e.g. occurs 10 times
  startDate: '',
  endDate: ''
};

export const repeatTypes = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY_MONTHDAY: 'MONTHLY_MONTHDAY',
  MONTHLY_SETPOS: 'MONTHLY_SETPOS',
  YEARLY_MONTH_MONTHDAY: 'YEARLY_MONTH_MONTHDAY',
  YEARLY_MONTH_SETPOS: 'YEARLY_MONTH_SETPOS'
};

export const weekDays = {
  SU: 'Sunday',
  MO: 'Monday',
  TU: 'Tuesday',
  WE: 'Wednesday',
  TH: 'Thursday',
  FR: 'Friday',
  SA: 'Saturday'
};

export function getSetPos(startDate, dayArray) {
  const startDay = moment(startDate).format('dd').toUpperCase();
  const startDayIndex = Object.keys(weekDays).indexOf(startDay);
  const byDayFirstIndex = Object.keys(weekDays).indexOf(dayArray[0]);
  const dayDelta = byDayFirstIndex - startDayIndex;
  const actualFirstDay = moment(startDate).add(dayDelta);

  const startDateObj = moment(actualFirstDay, 'YYYY-MM-DD');
  const dayOfMonth = parseInt(startDateObj.format('D'), 10);
  return (Math.ceil(dayOfMonth / 7) <= 4) ? Math.ceil(dayOfMonth / 7) : -1;
}

export function endDateString(endDate, count) {
  let stringValue = '';
  if (!!endDate) {
    const endString = moment(endDate).format('MM/DD/YYYY');
    stringValue = `and ending on ${endString}`;
  } else if (!!count && parseInt(count, 10) > 1) {
    stringValue = `and ending after ${count} occurrences.`;
  }
  return stringValue;
}
