import { useEffect, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { globalGray400, globalGreen300 } from "..";
import NemoText from "../atoms/NemoText";

interface WheelProps {
  data: number[];
  value: number;
  onChange: (d: number) => void;
}
const ITEM_HEIGHT = 24;
const VISIBLE_COUNT = 5;
const CENTER_INDEX = Math.floor(VISIBLE_COUNT / 2); // 2

const Wheel = ({ data, value, onChange }: WheelProps) => {
  if (!data) return <></>;

  const listRef = useRef<FlatList>(null);
  const selectedIndex = data.indexOf(value);

  useEffect(() => {
    if (selectedIndex < 0) return;
    listRef.current?.scrollToIndex({
      index: selectedIndex,
      animated: true,
    });
  }, []);

  useEffect(() => {
    if (selectedIndex < 0) return;

    listRef.current?.scrollToIndex({
      index: selectedIndex,
      animated: true,
    });
  }, [selectedIndex]);

  return (
    <View
      style={{
        height: ITEM_HEIGHT * VISIBLE_COUNT,
        overflow: "hidden",
        marginHorizontal: "auto",
      }}
    >
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          const rawIndex = Math.round(offsetY / ITEM_HEIGHT);
          const index = rawIndex;
          onChange(data[index]);
        }}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * CENTER_INDEX,
        }}
        renderItem={({ item, index }) => (
          <NemoText
            level="h1"
            style={[
              item === value ? style.active : style.inactive,
              { width: 80, height: ITEM_HEIGHT, textAlign: "center" },
            ]}
          >
            {item}
          </NemoText>
        )}
      />
    </View>
  );
};
const style = StyleSheet.create({
  active: {
    color: globalGreen300,
  },
  inactive: {
    color: globalGray400,
  },
});
export default Wheel;
