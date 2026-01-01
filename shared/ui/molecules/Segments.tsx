import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { globalSurfaceBackground } from "..";
import Segment from "../atoms/Segment";

type SegmentsText = {
  id: string;
  content: string;
  isActive: boolean;
};

interface SegmentsProps {
  texts: SegmentsText[];
  handler: (v: SegmentsText[]) => {};
}

const Segments = ({ texts, handler }: SegmentsProps) => {
  const [items, setItems] = useState(texts);

  useEffect(() => {
    handler(items);
  }, [items]);

  const handlePressTab = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isActive: true }
          : { ...item, isActive: false }
      )
    );
  };

  return (
    <View style={style.segments}>
      {items.map((text) => (
        <Segment
          key={text.id}
          isActive={text.isActive}
          onPress={() => handlePressTab(text.id)}
        >
          {text.content}
        </Segment>
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  segments: {
    flexDirection: "row",
    backgroundColor: globalSurfaceBackground,
    borderRadius: 8,
    padding: 2,
  },
});

export default Segments;
