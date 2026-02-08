import { StyleSheet, View } from "react-native";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import NemoText from "./NemoText";

interface NemoDayProps extends ViewProps {
  weekday: "월" | "화" | "수" | "목" | "금" | "토" | "일";
  color: string;
}

const NemoDay = ({ weekday, color }: NemoDayProps) => {
  return (
    <View style={style.container}>
      <NemoText level="body2" style={{ color: color, textAlign: "center" }}>
        {weekday}
      </NemoText>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    paddingVertical: 3,
    paddingHorizontal: 19,
    width: 355 / 7,
  },
});

export default NemoDay;
