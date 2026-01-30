import { StyleSheet, View } from "react-native";
import Chip from "../atoms/Chip";

export type ChipText = {
  id: number;
  content: string;
  isActive: boolean;
};

export interface ChipsProps {
  texts: ChipText[];
  handler: (v: ChipText[]) => void;
}

const Chips = ({ texts, handler }: ChipsProps) => {
  const handleSetActive = (id: number) => {
    const next = texts.map((item) =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    handler(next);
  };

  return (
    <View style={style.chips}>
      {texts.map((text) => (
        <Chip
          key={text.id}
          active={text.isActive}
          onPress={() => handleSetActive(text.id)}
        >
          {text.content == "MEMBER" ? "전체" : text.content}
        </Chip>
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  chips: {
    flexDirection: "row",
    gap: 8,
  },
});

export default Chips;
