import { ReactNode } from "react";
import { GestureResponderEvent, StyleSheet, Text, View } from "react-native";
import { globalPrimaryMain, globalTextDisabled } from "..";

interface TabProps {
  isActive: boolean;
  onPress: (e: GestureResponderEvent) => void;
  children: ReactNode;
}

const Tab = ({ isActive, onPress, children, ...props }: TabProps) => {
  return (
    <View style={style.tab}>
      <Text
        style={[isActive ? style.active : style.inactive]}
        onPress={onPress}
        {...props}
      >
        {children}
      </Text>
      <View
        style={[isActive ? style.activeBar : style.inactiveBar, style.bar]}
      />
    </View>
  );
};

const style = StyleSheet.create({
  tab: {
    gap: 8,
    alignItems: "center",
  },
  active: {
    color: globalPrimaryMain,
  },
  inactive: {
    color: globalTextDisabled,
  },
  bar: {
    height: 2,
    // flex: 1,
    alignSelf: "stretch",
  },
  activeBar: {
    backgroundColor: globalPrimaryMain,
  },
  inactiveBar: {
    backgroundColor: "none",
  },
});

export default Tab;
