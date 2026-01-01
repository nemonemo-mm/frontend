import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Tab from "../atoms/Tab";

type TabsText = {
  id: string;
  content: string;
  isActive: boolean;
};

interface TabsProps {
  texts: TabsText[];
  handler: (v: TabsText[]) => {};
}

const Tabs = ({ texts, handler }: TabsProps) => {
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
    <View style={style.tabs}>
      {items.map((text) => (
        <Tab
          key={text.id}
          isActive={text.isActive}
          onPress={() => handlePressTab(text.id)}
        >
          {text.content}
        </Tab>
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    gap: 16,
  },
});

export default Tabs;
