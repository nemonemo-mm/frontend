import {
  CalendarDate,
  CalendarSchedule,
  WeekSchedule,
} from "../types/Calendar";

const getWeekSchedules = (
  weekDates: CalendarDate[],
  schedules: CalendarSchedule[],
  maxVisible?: number
): WeekSchedule[] => {
  if (weekDates.length === 0) return [];
  const weekStart = startOfDay(weekDates[0].fullDate);
  const weekEnd = endOfDay(weekDates[6].fullDate);

  const value = schedules
    .filter((s) => s.startDate <= weekEnd && s.endDate >= weekStart)
    .map((s) => {
      const findDateIndex = (date: Date) =>
        weekDates.findIndex((d) => isSameDay(d.fullDate, date));

      const startIndex =
        findDateIndex(s.startDate) === -1 ? 0 : findDateIndex(s.startDate);
      const endIndex =
        findDateIndex(s.endDate) === -1 ? 6 : findDateIndex(s.endDate);

      const startsThisWeek = s.startDate >= weekDates[0].fullDate;
      const span = endIndex - startIndex + 1;

      return {
        schedule: s,
        startIndex,
        span,
        startsThisWeek,
      };
    })
    .sort((a, b) => {
      if (a.startIndex !== b.startIndex) {
        return a.startIndex - b.startIndex;
      }
      return b.span - a.span; // 같은 시작이면 긴 게 먼저
    });

  if (maxVisible) return value.slice(0, maxVisible);

  return value;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, -1);

const endOfDay = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default getWeekSchedules;
