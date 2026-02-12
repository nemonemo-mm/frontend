import { CalendarDate, CalendarSchedule } from "@/shared/types/Calendar";
import CalendarContainer from "../molecules/CalendarContainer";
import CalendarDays from "../molecules/CalendarDays";
import CalendarHeader from "../molecules/CalendarHeader";
import CalendarWeek from "../molecules/CalendarWeek";

interface CalendarProps {
  year: number;
  month: number;
  days: CalendarDate[][];
  schedules: CalendarSchedule[];
  onCalendarMonth: (dir: -1 | 1) => void;
  onSelectDate: (date: Date) => void;
  onLongSelectDate?: () => void;
}

const Calendar = ({
  year,
  month,
  days,
  schedules,
  onCalendarMonth,
  onSelectDate,
  onLongSelectDate,
}: CalendarProps) => {
  return (
    <CalendarContainer>
      <CalendarHeader year={year} month={month} goMonth={onCalendarMonth} />
      <CalendarDays />
      {days.map((day, i) => (
        <CalendarWeek
          key={"calendar" + i}
          dates={day}
          schedules={schedules}
          onSelectDate={onSelectDate}
          onLongSelectDate={onLongSelectDate}
        />
      ))}
    </CalendarContainer>
  );
};

export default Calendar;
