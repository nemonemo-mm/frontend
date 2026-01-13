import { CalendarDate, CalendarSchedule } from "@/shared/types/Calendar";
import { GestureResponderEvent } from "react-native";
import CalendarContainer from "../molecules/CalendarContainer";
import CalendarDays from "../molecules/CalendarDays";
import CalendarHeader from "../molecules/CalendarHeader";
import CalendarWeek from "../molecules/CalendarWeek";

interface CalendarProps {
  year: number;
  month: number;
  days: CalendarDate[][];
  schedules: CalendarSchedule[];
  handleCalendarMonth: (dir: -1 | 1) => void;
  onPress?: (e: GestureResponderEvent) => void;
}

const Calendar = ({
  year,
  month,
  days,
  schedules,
  handleCalendarMonth,
  onPress,
}: CalendarProps) => {
  return (
    <CalendarContainer onPress={onPress}>
      <CalendarHeader year={year} month={month} goMonth={handleCalendarMonth} />
      <CalendarDays />
      {days.map((day, i) => (
        <CalendarWeek key={"calendar" + i} dates={day} schedules={schedules} />
      ))}
    </CalendarContainer>
  );
};

export default Calendar;
