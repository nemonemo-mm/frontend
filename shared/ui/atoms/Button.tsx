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
  containerStyle?: StyleProp<ViewStyle>;
}

const Button = ({ children, containerStyle, ...props }: ButtonProps) => {
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      style={[styles.container, containerStyle]}
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
