import { StyleSheet, View, ViewProps } from "react-native";
import { globalBmRadius, globalGray50 } from "..";

interface BottomModalContainerProps extends ViewProps {}

const BottomModalContainer = ({ children }: BottomModalContainerProps) => {
  return <View style={style.container}>{children}</View>;
};

const style = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: "auto",
    justifyContent: "flex-end",
    backgroundColor: globalGray50,
    borderTopLeftRadius: globalBmRadius,
    borderTopRightRadius: globalBmRadius,
  },
});

export default BottomModalContainer;
