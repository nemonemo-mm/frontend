// interface SelectorProps {
//   direction: "vertical" | "horizontal";
// }

// const Selector = ({ direction }: SelectorProps) => {
//   return <View></View>;
// };

// export default Selector;

import { TextLevel } from "@/shared/types/TextLevel";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Pressable, StyleSheet, View } from "react-native";
import { globalGray700 } from "..";
import NemoText from "../atoms/NemoText";
interface SelectorProps {
  level: TextLevel;
  title: string;
  direction?: "row" | "column";
  handler: (direction: -1 | 1) => void;
}

const vertical: ("up" | "down")[] = ["up", "down"];
const horizontal: ("left" | "right")[] = ["left", "right"];
let buttonDirection: ("up" | "down" | "left" | "right")[];

const BaseSelector = ({ level, title, direction, handler }: SelectorProps) => {
  const handlePress = (dir: -1 | 1) => {
    handler(dir);
  };

  if (direction == "row") buttonDirection = horizontal;
  if (direction == "column") buttonDirection = vertical;
  return (
    <View
      style={[
        direction == "row" ? style.horizontal : style.vertical,
        { margin: 2 },
      ]}
    >
      <Pressable style={style.selector} onPress={() => handlePress(-1)}>
        <AntDesign name={buttonDirection[0]} size={16} color={globalGray700} />
      </Pressable>
      <NemoText level={level} style={style.text}>
        {title}
      </NemoText>
      <Pressable style={style.selector} onPress={() => handlePress(1)}>
        <AntDesign name={buttonDirection[1]} size={16} color={globalGray700} />
      </Pressable>
    </View>
  );
};
const VerticalSelector = ({ level, title, handler }: SelectorProps) => (
  <BaseSelector
    level={level}
    title={title}
    direction={"column"}
    handler={handler}
  />
);
const HorizontalSelector = ({ level, title, handler }: SelectorProps) => (
  <BaseSelector
    level={level}
    title={title}
    direction={"row"}
    handler={handler}
  />
);

const Selector = {
  Vertical: VerticalSelector,
  Horizontal: HorizontalSelector,
};

const style = StyleSheet.create({
  selector: {
    gap: 2,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  vertical: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    paddingVertical: 2,
  },
});

export default Selector;
