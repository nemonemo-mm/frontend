import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import {
  globalGray0,
  globalGray150,
  globalGray400,
  globalGray700,
  globalGreen300,
} from "../index";

import Button from "../atoms/Button";
import NemoText from "../atoms/NemoText";

interface ModalButtonProps {
  label: string;
  variant: "primary" | "secondary";
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>; // 추가
  disabled?: boolean;
}

const ModalButton = ({
  label,
  variant,
  onPress,
  containerStyle,
  disabled,
}: ModalButtonProps) => {
  const isPrimary = variant === "primary";
  const backgroundColor = disabled
    ? globalGray150
    : isPrimary
      ? globalGreen300
      : globalGray150;
  const textColor = disabled
    ? globalGray400
    : isPrimary
      ? globalGray0
      : globalGray700;

  return (
    <Button
      style={[styles.container, containerStyle, { backgroundColor }]}
      onPress={onPress}
      disabled={disabled}
    >
      <NemoText level="body1" style={{ color: textColor }}>
        {label}
      </NemoText>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
  },
});

export default ModalButton;
