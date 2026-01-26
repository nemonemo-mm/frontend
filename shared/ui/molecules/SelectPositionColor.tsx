import { Pressable, StyleSheet, View } from "react-native";
import {
  globalColorCalendarLabelType1,
  globalColorCalendarLabelType2,
  globalColorCalendarLabelType3,
  globalColorCalendarLabelType4,
  globalColorCalendarLabelType5,
  globalColorCalendarLabelType6,
  globalGray400,
} from "..";
import NemoText from "../atoms/NemoText";

interface SelectPositionColorProps {
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
}

const COLOR_OPTIONS = [
  globalColorCalendarLabelType1,
  globalColorCalendarLabelType2,
  globalColorCalendarLabelType3,
  globalColorCalendarLabelType4,
  globalColorCalendarLabelType5,
  globalColorCalendarLabelType6,
];

const SelectPositionColor = ({
  selectedColor,
  onColorSelect,
}: SelectPositionColorProps) => {
  return (
    <View style={styles.container}>
      <NemoText level="body1">포지션 색상 선택</NemoText>

      <View style={styles.colorContainer}>
        {COLOR_OPTIONS.map((color, index) => (
          <Pressable
            key={index}
            onPress={() => onColorSelect?.(color)}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              selectedColor === color && styles.selected,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12, // 텍스트와 색상 원들 사이 간격
  },
  colorContainer: {
    flexDirection: "row",
    gap: 12, // 원들 사이 간격
    alignItems: "center",
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 20, // 원형 만들기
  },
  selected: {
    borderWidth: 2,
    borderColor: globalGray400,
  },
});

export default SelectPositionColor;
