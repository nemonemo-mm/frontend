import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

interface ButtonProps extends PressableProps {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const Button = ({
  label,
  containerStyle,
  labelStyle,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      style={[styles.container, containerStyle]}
    >
      <Text style={[styles.label, labelStyle]}>{label}</Text>
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
  label: {
    fontFamily: "Pretendard-Regular",
    letterSpacing: 0,
  },
});

export default Button;
