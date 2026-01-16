import { StyleSheet, View, ViewProps } from "react-native";
import { globalBmRadius, globalGray0 } from "..";

interface BottomModalContainerProps extends ViewProps {}

const BottomModalContainer = ({ children }: BottomModalContainerProps) => {
  return <View style={style.container}>{children}</View>;
};

const style = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: "auto",
    justifyContent: "flex-end",
    backgroundColor: globalGray0,
    borderTopLeftRadius: globalBmRadius,
    borderTopRightRadius: globalBmRadius,
    gap: 16,
  },
});

export default BottomModalContainer;
