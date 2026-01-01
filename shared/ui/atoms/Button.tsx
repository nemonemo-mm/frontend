import { Pressable, PressableProps, StyleSheet, Text } from "react-native";
import {
  globalCtaDisabledBackground,
  globalPrimaryMain,
  globalSurfaceDefault,
  globalTextTertiary,
} from "../../ui/index";

interface ButtonProps extends PressableProps {
  label: string;
  isActive?: boolean;
}

const Button = ({ label, isActive = true, ...props }: ButtonProps) => {
  return (
    <Pressable
      {...props}
      disabled={!isActive}
      style={[
        styles.container,
        !isActive
          ? { backgroundColor: globalCtaDisabledBackground }
          : { backgroundColor: globalPrimaryMain },
      ]}
    >
      <Text
        style={[
          styles.label,
          !isActive
            ? { color: globalTextTertiary }
            : { color: globalSurfaceDefault },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: "500",
    fontFamily: "Pretendard-Regular",
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0,
  },
});

export default Button;
