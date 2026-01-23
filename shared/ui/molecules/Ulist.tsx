import * as React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

type UlistProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Ulist = ({ children, style }: UlistProps) => {
  return <View style={style}>{children}</View>;
};
export default Ulist;
