import { EvilIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

interface CalendarContainerProps extends ViewProps {}

const CalendarContainer = ({ children }: CalendarContainerProps) => {
  return (
    <View style={style.container}>
      {children}
      <Pressable style={style.btn}>
        <EvilIcons name="plus" size={24} color="black" />
      </Pressable>
    </View>
  );
};
const style = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 355,
  },
  btn: {
    position: "absolute",
    top: 4,
    right: 8,
  },
});
export default CalendarContainer;
