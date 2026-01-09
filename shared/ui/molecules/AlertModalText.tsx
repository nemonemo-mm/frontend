import { StyleSheet, View } from "react-native";
import NemoText from "../atoms/NemoText";
import { globalGray700 } from "../index";

interface AlertModalTextProps {
  children: React.ReactNode;
}

/**
 * 모달 설명 텍스트
 */
const AlertModalText = ({ children }: AlertModalTextProps) => {
  return (
    <View style={styles.container}>
      <NemoText level="body2" style={styles.text}>
        {children}
      </NemoText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  text: {
    color: globalGray700,
    textAlign: "center",
  },
});

export default AlertModalText;
