import { FlatList, StyleSheet, View } from "react-native";
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
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={texts}
        keyExtractor={(text) => `chip-${text.id}`}
        renderItem={({ item }) => (
          <Chip
            key={`chip-${item.id}`}
            active={item.isActive}
            onPress={() => handleSetActive(item.id)}
          >
            {item.content}
          </Chip>
        )}
        contentContainerStyle={{
          gap: 8,
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  chips: {
    width: 300,
  },
});

export default Chips;
