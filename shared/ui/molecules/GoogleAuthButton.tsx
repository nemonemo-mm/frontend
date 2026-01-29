import { StyleSheet, Text, View } from "react-native";

import GoogleIcon from "../../../assets/icons/google";
import Button from "../atoms/Button";

interface GoogleAuthButtonProps {
  onPress?: () => void;
}

const GoogleAuthButton = ({ onPress }: GoogleAuthButtonProps) => {
  const backgroundColor = "#FFFFFF";
  const textColor = "#0000008A";

  return (
    <Button
      onPress={onPress}
      style={[styles.container, { backgroundColor, borderColor: "#0000001A" }]}
    >
      <View style={styles.content}>
        {<GoogleIcon size={16} />}
        <Text
          style={{
            color: textColor,
            fontSize: 20,
            fontWeight: "500",
            fontFamily: "Pretendard-Regular",
          }}
        >
          Google로 로그인
        </Text>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 7,
  },
});

export default GoogleAuthButton;
