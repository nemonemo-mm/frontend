import { CalendarDate } from "../types/Calendar";

export const getCalendarDates = (
  year: number,
  month: number
): CalendarDate[] => {
  const firstDay = new Date(year, month, 1).getDay(); //1일의 요일
  const lastDate = new Date(year, month + 1, 0).getDate(); //해당 월의 마지막 날짜
  const prevLastDate = new Date(year, month, 0).getDate(); //이전 월의 마지막 날짜
  const totalCells = Math.ceil((firstDay + lastDate) / 7) * 7;
  const nextMonthDays = totalCells - (firstDay + lastDate); //다음달의 첫번째 주의 마지막 날짜

  const dates: CalendarDate[] = [];

  // 이전 달
  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push({
      date: prevLastDate - i,
      isCurrentMonth: false,
      fullDate: `${year}-${month + 1}-${i}`,
    });
  }

  // 이번 달
  for (let i = 1; i <= lastDate; i++) {
    dates.push({
      date: i,
      isCurrentMonth: true,
      fullDate: `${year}-${month + 1}-${i}`,
    });
  }

  // 다음 달
  for (let i = 1; i <= nextMonthDays; i++) {
    dates.push({
      date: i,
      isCurrentMonth: false,
      fullDate: `${year}-${month + 1}-${i}`,
    });
  }

  return dates;
};
