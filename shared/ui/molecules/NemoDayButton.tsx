import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import { globalGray100, globalGray50, globalGray900 } from "..";
import NemoDay from "../atoms/NemoDay";

export type WeekDayType = "월" | "화" | "수" | "목" | "금" | "토" | "일";

interface NemoDayButtonProps {
  isActive: boolean;
  weekday: WeekDayType;
  onPress: (weekday: WeekDayType) => void;
}

const NemoDayButton = ({ isActive, weekday, onPress }: NemoDayButtonProps) => {
  const handlePressButton = (e: GestureResponderEvent) => {
    onPress(weekday);
  };
  return (
    <Pressable
      onPress={handlePressButton}
      style={[isActive ? style.active : style.inactive, style.btn]}
    >
      <NemoDay weekday={weekday} color={globalGray900} />
    </Pressable>
  );
};
const style = StyleSheet.create({
  btn: {
    paddingVertical: 16,
    justifyContent: "center",
  },
  active: { backgroundColor: globalGray100 },
  inactive: { backgroundColor: globalGray50 },
});
export default NemoDayButton;
