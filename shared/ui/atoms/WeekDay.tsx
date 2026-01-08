import { StyleSheet, View } from "react-native";
import { globalGreen700 } from "..";
import NemoText from "./NemoText";

interface WeekDayProps {
  weekday: "월" | "화" | "수" | "목" | "금" | "토" | "일";
}

const WeekDay = ({ weekday }: WeekDayProps) => {
  return (
    <View style={style.container}>
      <NemoText level="body2" style={{ color: globalGreen700 }}>
        {weekday}
      </NemoText>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    paddingVertical: 3,
    paddingHorizontal: 17,
  },
});

export default WeekDay;
