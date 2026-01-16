import { EvilIcons } from "@expo/vector-icons";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

interface CalendarContainerProps extends ViewProps {
  onPress?: (e: GestureResponderEvent) => void;
}

const CalendarContainer = ({ children, onPress }: CalendarContainerProps) => {
  return (
    <View style={style.container}>
      {children}
      {onPress && (
        <Pressable style={style.btn} onPress={onPress}>
          <EvilIcons name="plus" size={20} color="black" />
        </Pressable>
      )}
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
