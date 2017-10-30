import moment from 'moment';
import { freqs, weekdays } from './index';

export default function toString(optionArgs) {
  const oa = optionArgs;
  const stringParts = [];
  stringParts.push('Every');

  const ivLabel = (name, oa) => (oa.interval && parseInt(oa.interval, 10) > 1) ? `${oa.interval} ${name}s` : `${name}`;
  const dayPart = (oa) => `on ${oa.byDay.map(day => { console.log(day); return weekdays[day]; }).join(', ')}`;
  const ords = (n) => (n < 11 || n > 13) ? ['st', 'nd', 'rd', 'th'][Math.min((n - 1) % 10, 3)] : 'th';
  const monthName = (monthNum) => {
    const monthNumber = (parseInt(monthNum, 10));
    const monthString = (monthNumber < 10) ? `0${monthNumber}` : `${monthNumber}`;
    return moment(`2000-${monthString}-01`).format('MMMM');
  };
  const getSetPos = (oa) => {
    console.log('getSetPos');
    let setPos;
    if (parseInt(oa.bySetPos, 10) < 0) {
      setPos = 'last';
    } else {
      const ordinal = ['first', 'second', 'third', 'fourth'];
      setPos = ordinal[(parseInt(oa.bySetPos, 10) - 1)];
    }
    return setPos;
  };

  switch (oa.freq) {
    case freqs.DAILY: {
      let dayIntervalPart = ivLabel('day', oa);
      stringParts.push(dayIntervalPart);
      let byDayPart = dayPart(oa);
      stringParts.push(byDayPart);
      break;
    }

    case freqs.WEEKLY: {
      let weekIntervalPart = ivLabel('week', oa);
      stringParts.push(weekIntervalPart);
      let byDayPart = dayPart(oa);
      stringParts.push(byDayPart);
      break;
    }

    case freqs.MONTHLY: {
      let monthIntervalPart = ivLabel('month', oa);
      stringParts.push(monthIntervalPart);
      if (oa.bySetPos && oa.byDay) {
        stringParts.push(`on the ${getSetPos(oa)}`);
        stringParts.push(oa.byDay.map(day => weekdays[day]).join(', '));
      } else {
        const date = oa.byMonthDay;
        stringParts.push(`on the ${date}${ords(date)}`);
      }
      break;
    }

    case freqs.YEARLY: {
      let yearIntervalPart = ivLabel('year', oa);
      stringParts.push(yearIntervalPart);
      if (oa.bySetPos) {
        stringParts.push(`on the ${getSetPos(oa)} ${weekdays[oa.byDay[0]]} of ${monthName(oa.byMonth)}`);
      } else {
        const monthDay = parseInt(oa.byMonthDay, 10);
        stringParts.push(`on ${monthName(oa.byMonth)} ${monthDay}${ords(monthDay)}`);
      }
      break;
    }
  }

  if (oa.count || oa.interval) {
    let untilPart;
    if (oa.count && parseInt(oa.count, 10) > 0) {
      untilPart = `for ${oa.count} times`;
    } else if (oa.until) {
      untilPart = `until ${moment(oa.until).format('MM/DD/YYYY')}`;
    }
    stringParts.push(untilPart);
  }

  return stringParts.join(' ');
}
