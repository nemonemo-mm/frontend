import { ReactNode } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { globalGray400, globalGreen300 } from "..";
import NemoText from "./NemoText";

interface TabProps {
  isActive: boolean;
  onPress: (e: GestureResponderEvent) => void;
  children: ReactNode;
}

const Tab = ({ isActive, onPress, children, ...props }: TabProps) => {
  return (
    <Pressable style={style.tab} onPress={onPress}>
      <NemoText
        level={isActive ? "h2" : "tabInActive"}
        style={[isActive ? style.active : style.inactive]}
        {...props}
      >
        {children}
      </NemoText>
      <View
        style={[isActive ? style.activeBar : style.inactiveBar, style.bar]}
      />
    </Pressable>
  );
};

const style = StyleSheet.create({
  tab: {
    gap: 8,
    alignItems: "center",
  },
  active: {
    color: globalGreen300,
  },
  inactive: {
    color: globalGray400,
  },
  bar: {
    height: 2,
    // flex: 1,
    alignSelf: "stretch",
  },
  activeBar: {
    backgroundColor: globalGreen300,
  },
  inactiveBar: {
    backgroundColor: "none",
  },
});

export default Tab;
