import { StyleSheet, View } from "react-native";
import WeekDay from "../atoms/WeekDay";

interface WeekDaysProps {}

const weekdays: ("월" | "화" | "수" | "목" | "금" | "토" | "일")[] = [
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
  "일",
];

const WeekDays = ({}: WeekDaysProps) => {
  return (
    <View style={style.container}>
      {weekdays.map((weekday) => (
        <WeekDay weekday={weekday} />
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});

export default WeekDays;
