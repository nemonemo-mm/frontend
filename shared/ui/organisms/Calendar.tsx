import useCalendar from "@/shared/hooks/useCalendar";
import { CalendarSchedule } from "@/shared/types/Calendar";
import CalendarContainer from "../molecules/CalendarContainer";
import CalendarDays from "../molecules/CalendarDays";
import CalendarHeader from "../molecules/CalendarHeader";
import CalendarWeek from "../molecules/CalendarWeek";

interface CalendarProps {
  year: number;
  month: number;
  schedules: CalendarSchedule[];
}

const Calendar = ({ year, month, schedules }: CalendarProps) => {
  const { goNextMonth, goPrevMonth, days, currentYearMonth } = useCalendar(
    year,
    month
  );

  const handleCalendarMonth = (direction: -1 | 1) => {
    if (direction == -1) goPrevMonth();
    else goNextMonth();
  };
  return (
    <CalendarContainer>
      <CalendarHeader
        year={currentYearMonth.year}
        month={currentYearMonth.month + 1}
        goMonth={handleCalendarMonth}
      />
      <CalendarDays />
      {days.map((day, i) => (
        <CalendarWeek key={"calendar" + i} dates={day} schedules={schedules} />
      ))}
    </CalendarContainer>
  );
};

export default Calendar;
