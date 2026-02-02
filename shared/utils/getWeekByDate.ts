import { CalendarDate } from "../types/Calendar";

export const getWeekByDate = (date: Date): CalendarDate[] => {
  const day = date.getDay(); // 0 = 일
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - day);
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);

    return {
      date: d.getDate(),
      fullDate: d,
      isCurrentMonth:
        d.getFullYear() === currentYear && d.getMonth() === currentMonth,
    };
  });
};
