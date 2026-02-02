import { StyleSheet, View } from "react-native";
import Tab from "../atoms/Tab";

export type TabsText = {
  id: number;
  content: string;
  isActive: boolean;
};

interface TabsProps {
  texts: TabsText[];
  handler: (v: number) => void;
}

const Tabs = ({ texts, handler }: TabsProps) => {
  const handlePressTab = (id: number) => {
    handler(id);
  };

  return (
    <View style={style.tabs}>
      {texts.map((text) => (
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
