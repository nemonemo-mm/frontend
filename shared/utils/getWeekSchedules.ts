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

  const value = schedules
    .filter(
      (s) =>
        s.startDate <= weekDates[6].fullDate &&
        s.endDate >= weekDates[0].fullDate
    )
    .map((s) => {
      const findDateIndex = (date: Date) =>
        weekDates.findIndex((d) => {
          return normalize(d.fullDate).getDate() === normalize(date).getDate();
        });
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

  if (maxVisible) return value.splice(0, maxVisible);
  return value;
};

const normalize = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export default getWeekSchedules;
