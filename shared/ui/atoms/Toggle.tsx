import { useRef } from "react";
import { Animated, Pressable, PressableProps, StyleSheet } from "react-native";
import { globalGray250, globalGray50, globalGreen300 } from "..";

interface ToggleProps extends PressableProps {
  value: boolean;
  handler: (v: boolean) => void;
}

const Toggle = ({ value, handler, ...props }: ToggleProps) => {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const handlePressToggle = () => {
    const next = !value;

    handler(next);

    Animated.timing(animation, {
      toValue: next ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      style={[style.toggle, value && style.pressedToggle]}
      onPress={handlePressToggle}
      {...props}
    >
      <Animated.View style={[style.circle, { transform: [{ translateX }] }]} />
    </Pressable>
  );
};

const style = StyleSheet.create({
  toggle: {
    width: 36,
    height: 20,
    backgroundColor: globalGray250,
    borderRadius: 9999,
    padding: 2,
  },
  pressedToggle: {
    backgroundColor: globalGreen300,
  },
  circle: {
    width: 16,
    height: 16,
    backgroundColor: globalGray50,
    borderRadius: 9999,
  },
});

export default Toggle;
