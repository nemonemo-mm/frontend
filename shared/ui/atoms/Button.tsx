import { ReactNode } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface ButtonProps extends PressableProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.container, props.style]}
      {...props}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
});

export default Button;
