import { StyleSheet, View } from "react-native";
import NemoText from "../atoms/NemoText";

interface AlertModalTitleProps {
  children: string;
}

/**
 * 모달 타이틀
 */
const AlertModalTitle = ({ children }: AlertModalTitleProps) => {
  return (
    <View style={styles.container}>
      <NemoText level="h3">{children}</NemoText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});

export default AlertModalTitle;
