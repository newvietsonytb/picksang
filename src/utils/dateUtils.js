import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/vi';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isoWeek);
dayjs.locale('vi');

const TZ = 'Asia/Ho_Chi_Minh';

export function now() {
  return dayjs().tz(TZ);
}

export function formatTime(dateStr) {
  return dayjs(dateStr).tz(TZ).format('HH:mm');
}

export function formatDate(dateStr) {
  const d = dayjs(dateStr).tz(TZ);
  const today = now();
  
  if (d.isSame(today, 'day')) return 'Hôm nay';
  if (d.isSame(today.subtract(1, 'day'), 'day')) return 'Hôm qua';
  
  return d.format('DD [Thg] M');
}

export function formatFullDate(dateStr) {
  return dayjs(dateStr).tz(TZ).format('DD/MM/YYYY HH:mm');
}

export function filterByPeriod(matches, period) {
  const today = now();
  
  return matches.filter(m => {
    const matchDate = dayjs(m.created_at).tz(TZ);
    switch (period) {
      case 'today':
        return matchDate.isSame(today, 'day');
      case 'week':
        return matchDate.isSame(today, 'isoWeek');
      case 'month':
        return matchDate.isSame(today, 'month');
      default:
        return true;
    }
  });
}

export function getDateKey(dateStr) {
  return dayjs(dateStr).tz(TZ).format('YYYY-MM-DD');
}

export function minutesAgo(dateStr) {
  return now().diff(dayjs(dateStr).tz(TZ), 'minute');
}
