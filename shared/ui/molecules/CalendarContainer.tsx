import { StyleSheet, View } from "react-native";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

interface CalendarContainerProps extends ViewProps {}

const CalendarContainer = ({ children }: CalendarContainerProps) => {
  return <View style={style.container}>{children}</View>;
};
const style = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    maxWidth: 355,
  },
  btn: {
    position: "absolute",
    top: 4,
    right: 8,
  },
});
export default CalendarContainer;
