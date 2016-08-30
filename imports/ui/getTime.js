import Moment from 'moment';

export function getTime(timestamp) {
  if (!timestamp) return;

  return Moment(timestamp).calendar(null, {
    lastDay : '[Yesterday]',
    sameDay : 'LT',
    lastWeek : 'dddd',
    sameElse : 'DD/MM/YY'
  });
}