import { useMemo, useState } from "react";
import { CalendarState } from "../types/Calendar";
import { getCalendarDates } from "../utils/getCalendarDates";

const useCalendar = (year: number, month: number) => {
  const [currentYearMonth, setCurrent] = useState<CalendarState>({
    year,
    month,
  });
  const goNextMonth = () => {
    if (currentYearMonth.month == 11) {
      setCurrent((prev) => ({ year: prev.year + 1, month: 0 }));
    } else {
      setCurrent((prev) => ({ ...prev, month: prev.month + 1 }));
    }
  };
  const goPrevMonth = () => {
    if (currentYearMonth.month == 0) {
      setCurrent((prev) => ({ year: prev.year - 1, month: 11 }));
    } else {
      setCurrent((prev) => ({ ...prev, month: prev.month - 1 }));
    }
  };
  const days = useMemo(
    () =>
      Array(5)
        .fill(0)
        .map((_, i) =>
          getCalendarDates(currentYearMonth.year, currentYearMonth.month, i)
        ),
    [currentYearMonth]
  );

  return {
    goNextMonth,
    goPrevMonth,
    currentYearMonth,
    days,
  };
};

export default useCalendar;
