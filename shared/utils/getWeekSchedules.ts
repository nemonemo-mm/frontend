import {
  CalendarDate,
  CalendarSchedule,
  WeekSchedule,
} from "../types/Calendar";

const getWeekSchedules = (
  weekDates: CalendarDate[],
  schedules: CalendarSchedule[]
): WeekSchedule[] => {
  if (weekDates.length === 0) return [];
  return schedules
    .filter(
      (s) =>
        s.startDate <= weekDates[6].fullDate &&
        s.endDate >= weekDates[0].fullDate
    )
    .map((s) => {
      const start = Math.max(
        0,
        differenceInDays(s.startDate, weekDates[0].fullDate)
      );
      const end = Math.min(
        6,
        differenceInDays(s.endDate, weekDates[0].fullDate)
      );

      return {
        schedule: s,
        startIndex: start,
        span: end - start + 1,
      };
    })
    .sort((a, b) => a.span - b.span);
};
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const differenceInDays = (start: Date, end: Date) => {
  const time = Math.abs(end.getTime() - start.getTime());
  if (time < 0) return 0;
  return Math.round(time / MILLISECONDS_PER_DAY);
};

export default getWeekSchedules;
