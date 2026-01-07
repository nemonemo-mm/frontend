import { StyleSheet, Text, View } from "react-native";

import Button from "../atoms/Button";

import AppleIcon from "../../../assets/icons/apple";
import GoogleIcon from "../../../assets/icons/google";

interface AuthButtonProps {
  label: "Google" | "Apple";
  onPress?: () => void;
}

const AuthButton = ({ label, onPress }: AuthButtonProps) => {
  const isGoogle = label === "Google";

  const backgroundColor = isGoogle ? "#FFFFFF" : "#000000";
  const textColor = isGoogle ? "#0000008A" : "#FFFFFF";

  return (
    <Button
      onPress={onPress}
      containerStyle={[
        styles.container,
        { backgroundColor, borderColor: isGoogle ? "#0000001A" : "#000000" },
      ]}
    >
      <View style={styles.content}>
        {isGoogle ? <GoogleIcon size={24} /> : <AppleIcon size={24} />}
        <Text
          style={{
            color: textColor,
            fontSize: 20,
            fontWeight: "500",
            fontFamily: "Pretendard-Regular",
          }}
        >
          Sign Up with {label}
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

    // iOS shadow
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.168,
    shadowRadius: 3,

    // Android shadow
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 15,
  },
});

export default AuthButton;
