import { useRef, useState } from "react";
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
} from "react-native";
import { globalGray250, globalGray50, globalGreen300 } from "..";

interface ToggleProps {
  value: boolean;
}

const Toggle = ({ value }: ToggleProps) => {
  const [toggle, setToggle] = useState(value);

  const animation = useRef(new Animated.Value(0)).current;
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });
  const handlePressToggle = (e: GestureResponderEvent) => {
    e.preventDefault();
    setToggle((prev) => !prev);
    const nextValue = !toggle;
    Animated.timing(animation, {
      toValue: nextValue ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Pressable
      style={[style.toggle, toggle && style.pressedToggle]}
      onPress={handlePressToggle}
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
