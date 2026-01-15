import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { globalGray50 } from "..";
import Segment from "../atoms/Segment";
import { TabsText } from "./Tabs";

interface SegmentsProps extends ViewProps {
  texts: TabsText[];
  level: "l" | "m";
  handler: (v: TabsText[]) => void;
}

const Segments = ({ texts, level, handler, ...props }: SegmentsProps) => {
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
    <View
      style={[{ height: level == "l" ? 48 : 32 }, style.segments]}
      {...props}
    >
      {items.map((text) => (
        <Segment
          level={level}
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
    backgroundColor: globalGray50,
    borderRadius: 8,
    padding: 2,
  },
});

export default Segments;
