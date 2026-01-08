import { CalendarDate, CalendarSchedule } from "@/shared/types/Calendar";
import { StyleSheet, View } from "react-native";
import NemoDate from "../atoms/NemoDate";
import NemoText from "../atoms/NemoText";

interface CalendarDatesProps {
  dates: CalendarDate[];
  schedules: CalendarSchedule[];
}
const CalendarDates = ({ dates, schedules }: CalendarDatesProps) => {
  return (
    <View style={style.container}>
      {dates.map((date) => (
        <View style={style.dates}>
          <NemoDate date={date.date} isCurrentMonth={date.isCurrentMonth} />

          {schedules
            .filter((schedule) => schedule.startAt.startsWith(date.fullDate))
            .map((today) => (
              <NemoText level="body2">{today.title}</NemoText>
            ))}
        </View>
      ))}
    </View>
  );
};
const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: 355,
  },
  dates: {
    flexBasis: `${100 / 7}%`,
    minHeight: 91,
  },
});
export default CalendarDates;
