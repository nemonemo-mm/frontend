import { useEffect, useRef } from "react";
import { Animated, Pressable, PressableProps, StyleSheet } from "react-native";
import { globalGray250, globalGray50, globalGreen300 } from "..";

interface ToggleProps extends PressableProps {
  value: boolean;
  handler: (v: boolean) => void;
}

const Toggle = ({ value, handler, ...props }: ToggleProps) => {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  // value props 변경 감지하여 애니메이션 실행
  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const handlePressToggle = () => {
    // handler만 호출하면, 부모 상태가 바뀌고 -> value prop이 바뀌고 -> useEffect가 실행됨
    const next = !value;
    handler(next);
  };

  return (
    <Pressable
      style={[
        style.toggle,
        value && style.pressedToggle,
        props.disabled && style.disabledToggle,
      ]}
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
  disabledToggle: {
    opacity: 0.5,
  },
  circle: {
    width: 16,
    height: 16,
    backgroundColor: globalGray50,
    borderRadius: 9999,
  },
});

export default Toggle;
