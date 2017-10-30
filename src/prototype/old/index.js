import moment from 'moment';
import toString from './toString';

const defaultOptions = {
  freq: '',
  byMonthDay: '',
  byMonth: '',
  bySetPos: '',
  byDay: [],
  interval: '',
  count: '',
  repeatByMonthlyType: '',
  untilType: '',
  until: '',
};

export const freqs = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY'
};

export const weekdays = {
  SU: 'Sunday',
  MO: 'Monday',
  TU: 'Tuesday',
  WE: 'Wednesday',
  TH: 'Thursday',
  FR: 'Friday',
  SA: 'Saturday'
};

export const repeatBy = {
  DOM: 'DAY OF MONTH',
  DOW: 'DAY OF WEEK'
};

export const untilTypes = {
  NEVER: 'never',
  DATE: 'date',
  COUNT: 'count'
};

export default function rrule(optionArgs) {
  const options = Object.assign({}, defaultOptions, optionArgs);

  console.log('options: ', options);

  let rruleArray, rrule;

  // Set up date from options
  switch (options.freq) {
    case freqs.DAILY:
      rruleArray = dailyRecurrence(options);
      break;
    case freqs.WEEKLY:
      rruleArray = weeklyRecurrence(options);
      break;
    case freqs.MONTHLY:
      rruleArray = monthlyRecurrence(options);
      break;
    case freqs.YEARLY:
      rruleArray = yearlyRecurrence(options);
      break;
    default:
      throw new Error('RRULE missing frequency');
  }

  rrule = rruleArray.filter(r => !!r).join(';');
  const stringValue = toString(options);
  return { options, rrule, toString:stringValue };
}

export function dailyRecurrence(options) {
  const rruleArray = [
    parseDaily(),
    parseInterval(options),
    parseRecurrenceEnd(options)
  ];
  return rruleArray;
}

export function weeklyRecurrence(options) {
  const rruleArray = [
    parseWeekly(),
    parseByDay(options),
    parseInterval(options),
    parseRecurrenceEnd(options)
  ];
  return rruleArray;
}

export function monthlyRecurrence(options) {
  const repeatType = (options.repeatByMonthlyType === repeatBy.DOW) ?
    [parseByDay(options), parseBySetPos(options)] : [parseByMonthDay(options)];
  const rruleArray = [
    parseMonthly(),
    ...repeatType,
    parseInterval(options),
    parseRecurrenceEnd(options)
  ];
  return rruleArray;
}

export function yearlyRecurrence(options) {
  const rruleArray = [
    parseYearly(),
    parseByMonth(options),
    parseByMonthDay(options),
    parseInterval(options),
    parseRecurrenceEnd(options)
  ];
  return rruleArray;
}

export function parseDaily() {
  return `FREQ=${freqs.DAILY}`;
}

export function parseWeekly() {
  return `FREQ=${freqs.WEEKLY}`;
}

export function parseMonthly() {
  return `FREQ=${freqs.MONTHLY}`;
}

export function parseYearly() {
  return `FREQ=${freqs.YEARLY}`;
}

export function parseByMonthDay(options) {
  return (options.byMonthDay) ? `BYMONTHDAY=${parseInt(options.byMonthDay, 10)}` : false;
}

export function parseByMonth(options) {
  return (options.byMonth) ? `BYMONTH=${parseInt(options.byMonth, 10)}` : false;
}

export function parseBySetPos(options) {
  return (options.bySetPos) ? `BYSETPOS=${parseInt(options.bySetPos, 10)}` : false;
}

export function parseByDay(options) {
  return (options.byDay && options.byDay.length) ? `BYDAY=${options.byDay.join(',')}` : false;
}

export function parseInterval(options) {
  return (options.interval) ? `INTERVAL=${parseInt(options.interval, 10)}` : 'INTERVAL=1';
}

export function parseRecurrenceEnd(options) {
  if (options.count) {
    return parseCount(options);
  } else if (options.until) {
    return parseUntil(options);
  } else {
    return false;
  }
}

export function parseCount(options) {
  return (options.count) ? `COUNT=${parseInt(options.count, 10)}` : false;
}

export function parseUntil(options) {
  return (options.until) ? `UNTIL=${moment(options.until).format('YYYYMMDD')}` : false;
}


// https://www.rahulsingla.com/blog/2010/12/parsing-ical-rrule

 const display = opt => `toString: ${toString(opt)}\nrrule: ${rrule(opt).rrule}\n\n`;
 const r1 = {
 freq: 'YEARLY',
 byMonthDay: '',
 byMonth: '3',
 bySetPos: '1',
 byDay: ['TU'],
 interval: '',
 count: '',
 until: ''
 };
 console.log(display(r1));

 const r2 = {
 freq: 'YEARLY',
 byMonthDay: '22',
 byMonth: '3',
 bySetPos: '',
 byDay: [],
 interval: '',
 count: '',
 until: ''
 };
 console.log(display(r2));

 const r3 = {
 freq: 'MONTHLY',
 byMonthDay: '22',
 byMonth: '',
 bySetPos: '',
 byDay: [],
 interval: '3',
 count: '',
 until: ''
 };
 console.log(display(r3));

 const r4 = {
 freq: 'MONTHLY',
 byMonthDay: '',
 byMonth: '',
 bySetPos: '2',
 byDay: ['SU'],
 interval: '1',
 count: '',
 until: ''
 };
 console.log(display(r4));

 const r5 = {
 freq: 'WEEKLY',
 byMonthDay: '',
 byMonth: '',
 bySetPos: '',
 byDay: ['SU'],
 interval: '3',
 count: '',
 until: '20170909'
 };
 console.log(display(r5));

 const r6 = {
 freq: 'DAILY',
 byMonthDay: '',
 byMonth: '',
 bySetPos: '',
 byDay: [],
 interval: '3',
 count: '10',
 until: ''
 };
 console.log(display(r6));

