import { Dispatch, SetStateAction } from "react";
import { StyleSheet, View } from "react-native";
import { globalGray700 } from "..";
import Input from "../atoms/Input";
import NemoText from "../atoms/NemoText";
import NemoTextLabel from "../molecules/NemoTextLabel";

interface RepeatCountProps {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
  unit: "일" | "주";
}

const RepeatCount = ({ unit, count, setCount }: RepeatCountProps) => {
  const handleInputWeekOrDate = (num: string) => {
    if (num == null || num == "") num = "0";
    setCount(parseInt(num));
  };
  return (
    <View style={style.repeatContainer}>
      <NemoTextLabel>지정 간격으로 반복</NemoTextLabel>
      <View style={style.row}>
        <Input
          placeholder="0"
          maxLength={3}
          inputMode="numeric"
          textAlign="right"
          value={count.toString()}
          onChangeText={handleInputWeekOrDate}
        />
        <NemoText level="body3" style={{ color: globalGray700 }}>
          {unit}
        </NemoText>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  repeatContainer: {
    height: 48,
    flexDirection: "row",

    paddingHorizontal: 8,
    paddingVertical: 9,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default RepeatCount;
