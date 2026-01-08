import { StyleSheet, View } from "react-native";
import NemoDay from "../atoms/NemoDay";

interface CalendarDaysProps {}

const weekdays: ("월" | "화" | "수" | "목" | "금" | "토" | "일")[] = [
  "일",
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
];

const CalendarDays = ({}: CalendarDaysProps) => {
  return (
    <View style={style.container}>
      {weekdays.map((weekday) => (
        <NemoDay weekday={weekday} />
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});

export default CalendarDays;
