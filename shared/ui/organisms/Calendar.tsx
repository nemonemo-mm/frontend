import useCalendar from "@/shared/hooks/useCalendar";
import CalendarContainer from "../molecules/CalendarContainer";
import CalendarDays from "../molecules/CalendarDays";
import CalendarHeader from "../molecules/CalendarHeader";
import CalendarWeek from "../molecules/CalendarWeek";

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
      <CalendarDays />
      {days.map((day, i) => (
        <CalendarWeek
          key={"calendar" + i}
          dates={day}
          schedules={[
            {
              id: 1,
              startDate: new Date("2026-1-01"),
              endDate: new Date("2026-1-01"),
              title: "0 with team",
            },
            {
              id: 12,
              startDate: new Date("2026-1-01"),
              endDate: new Date("2026-1-01"),
              title: "1 with team",
            },
            {
              id: 13,
              startDate: new Date("2026-1-01"),
              endDate: new Date("2026-1-01"),
              title: "2 with team",
            },
            {
              id: 14,
              startDate: new Date("2026-1-01"),
              endDate: new Date("2026-1-01"),
              title: "3 with team",
            },
            {
              id: 15,
              startDate: new Date("2026-1-01"),
              endDate: new Date("2026-1-01"),
              title: "4 with team",
            },
            {
              id: 2,
              startDate: new Date("2026-1-05"),
              endDate: new Date("2026-1-07"),
              title: "Doctor's appointment",
            },
          ]}
        />
      ))}
    </CalendarContainer>
  );
};

export default Calendar;
