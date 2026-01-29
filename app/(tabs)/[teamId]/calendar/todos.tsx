import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import CalendarDays from "@/shared/ui/molecules/CalendarDays";
import CalendarWeek from "@/shared/ui/molecules/CalendarWeek";
import { useContext } from "react";
import { View } from "react-native";

interface TodosProps {}

const Todos = ({}: TodosProps) => {
  const calendarContext = useContext(CalendarContext);
  const today = new Date(Date.now());

  if (!calendarContext) {
    throw new Error("CalendarContext is undefined. Ensure it is provided.");
  }

  const { days, schedules, todos } = calendarContext;
  const thisWeek = days
    .filter((day) =>
      day.some(
        (d) =>
          d.fullDate.getDate() == today.getDate() &&
          d.fullDate.getMonth() == today.getMonth()
      )
    )
    .flat();
  return (
    <View>
      <CalendarDays />
      <CalendarWeek dates={thisWeek} schedules={[...schedules, ...todos]} />
    </View>
  );
};

export default Todos;
