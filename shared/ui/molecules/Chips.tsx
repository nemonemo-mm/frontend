import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Chip from "../atoms/Chip";

type Text = {
  id: string;
  content: string;
  isActive: boolean;
};

export interface ChipsProps {
  texts: Text[];
  handler: (v: Text[]) => void;
}

const Chips = ({ texts, handler }: ChipsProps) => {
  const [items, setItems] = useState(texts);

  const handleSetActive = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  useEffect(() => {
    handler(items);
  }, [items]);

  return (
    <View style={style.chips}>
      {items.map((text) => (
        <Chip
          key={text.id}
          active={text.isActive}
          onPress={() => handleSetActive(text.id)}
        >
          {text.content}
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
