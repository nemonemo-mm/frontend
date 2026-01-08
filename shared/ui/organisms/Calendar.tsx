import useCalendar from "@/shared/hooks/useCalendar";
import CalendarContainer from "../molecules/CalendarContainer";
import CalendarDates from "../molecules/CalendarDates";
import WeekDays from "../molecules/CalendarDays";
import CalendarHeader from "../molecules/CalendarHeader";

interface CalendarProps {
  year: number;
  month: number;
}

const Calendar = ({ year, month }: CalendarProps) => {
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
      <WeekDays />
      <CalendarDates
        dates={days}
        schedules={[
          { id: 1, startAt: "2026-1-01T10:30:00Z", title: "Meeting with team" },
          {
            id: 2,
            startAt: "2026-1-05T10:30:00Z",
            title: "Doctor's appointment",
          },
          { id: 3, startAt: "2026-1-10T10:30:00Z", title: "Project deadline" },
        ]}
      />
    </CalendarContainer>
  );
};

export default Calendar;
