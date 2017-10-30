import moment from 'moment';
import { freqs, repeatBy } from './index';

const dayNumbers = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

export default function setPos(options) {
  console.log('ohailog');
  let {
    freq,
    repeatByMonthlyType,
    startDate
  } = options;
  if (freq !== freqs.MONTHLY || repeatByMonthlyType !== repeatBy.DOW) {
    return options;
  }
  // Find the next byDay occurring on or after the startDate
  // Make that the new startDate
  startDate = getFirstOccurrence(options);

  // Find out the position of the byDay in the month
  const bySetPos = getSetPos(startDate);
  const updatedState = Object.assign({}, options, {startDate, bySetPos});
  console.log('bySetPos returns: ', updatedState);
  return updatedState;
}

export function getFirstOccurrence(options) {
  let {
    byDay,
    startDate
  } = options;

  const day = byDay[0]; // Only one setPos based byDay is supported
  const dayNumber = dayNumbers[day];
  const startDateObj = moment(startDate, 'YYYY-MM-DD');

  let firstOccurrence = (startDateObj.isoWeekday() <= dayNumber) ?
    startDateObj.isoWeekday(dayNumber) :
    startDateObj.add(1, 'weeks').isoWeekday(dayNumber);

  return firstOccurrence.format('YYYY-MM-DD');
}

export function getSetPos(startDate) {
  const startDateObj = moment(startDate, 'YYYY-MM-DD');
  const dayOfMonth = parseInt(startDateObj.format('D'), 10);
  return (Math.ceil(dayOfMonth / 7) <= 4) ? Math.ceil(dayOfMonth / 7) : -1;
}
