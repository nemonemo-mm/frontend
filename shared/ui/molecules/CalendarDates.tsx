import { CalendarDate, CalendarSchedule } from "@/shared/types/Calendar";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import NemoDate from "../atoms/NemoDate";

interface CalendarDatesProps {
  dates: CalendarDate[];
  schedules: CalendarSchedule[];
}
//issue #51

const CalendarDates = ({ dates, schedules }: CalendarDatesProps) => {
  const { width } = useWindowDimensions();
  const WEEK_WIDTH = width - 40;
  const DAY_WIDTH = WEEK_WIDTH / 7;
  return (
    <View style={[style.container, { maxWidth: WEEK_WIDTH }]}>
      {dates.map((date) => (
        <View style={[style.dates, { width: DAY_WIDTH }]}>
          <NemoDate date={date.date} isCurrentMonth={date.isCurrentMonth} />

          {/* {schedules
            .filter((schedule) => schedule.startAt.startsWith(date.fullDate))
            .map((today) => (
              <NemoText level="body2">{today.title}</NemoText>
            ))} */}
        </View>
      ))}
    </View>
  );
};
const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dates: {
    minHeight: 91,
  },
});
export default CalendarDates;
