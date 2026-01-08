import { StyleSheet, Text } from "react-native";
import Selector from "./Selector";

interface CalendarHeaderProps {
  year: number;
  month: number;
  goMonth: (dir: -1 | 1) => void;
}

const CalendarHeader = ({ year, month, goMonth }: CalendarHeaderProps) => {
  return (
    <Text style={style.container}>
      <Selector.Horizontal
        level="h2"
        title={`${year}년 ${month}월`}
        handler={(dir) => goMonth(dir)}
      />
    </Text>
  );
};
const style = StyleSheet.create({
  container: {
    textAlign: "center",
    marginBottom: 14,
  },
});
export default CalendarHeader;
