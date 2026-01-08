import { StyleSheet, View } from "react-native";
import { globalGray600, globalGray900 } from "..";
import NemoText from "./NemoText";

interface DateProps {
  date: number;
  isCurrentMonth: boolean;
}
//Date 내장 함수와 구분하기 위해 도메인 이름을 붙였습니다.
const NemoDate = ({ date, isCurrentMonth }: DateProps) => {
  return (
    <View style={style.container}>
      <NemoText
        level="body2"
        style={[isCurrentMonth ? style.active : style.inactive, style.text]}
      >
        {date}
      </NemoText>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  text: { margin: "auto" },
  active: {
    color: globalGray900,
  },
  inactive: {
    color: globalGray600,
  },
});

export default NemoDate;
