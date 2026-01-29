import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import CalendarDays from "@/shared/ui/molecules/CalendarDays";
import CalendarWeek from "@/shared/ui/molecules/CalendarWeek";
import { useContext } from "react";
import { View } from "react-native";

interface TodosProps {}

const Todos = ({}: TodosProps) => {
  const calendarContext = useContext(CalendarContext);

  if (!calendarContext) {
    throw new Error("CalendarContext is undefined. Ensure it is provided.");
  }

  const { selectedDate, days, schedules } = calendarContext;
  const thisWeek = days
    .filter((day) => day.some((d) => d.date == selectedDate.getDate()))
    .flat();

  return (
    <View>
      <CalendarDays />
      <CalendarWeek dates={thisWeek} schedules={schedules} />
    </View>
  );
};

export default Todos;
