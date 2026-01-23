import { StyleSheet, View, ViewProps } from "react-native";
import { globalBmRadius, globalGray0 } from "..";

interface BottomModalContainerProps extends ViewProps {}

const BottomModalContainer = ({
  children,
  style,
  ...props
}: BottomModalContainerProps) => {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: "auto",
    justifyContent: "flex-start",
    backgroundColor: globalGray0,
    borderTopLeftRadius: globalBmRadius,
    borderTopRightRadius: globalBmRadius,
    gap: 16,
  },
});

export default BottomModalContainer;
