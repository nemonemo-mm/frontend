import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import {
  globalGray0,
  globalGray150,
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
}

const ModalButton = ({
  label,
  variant,
  onPress,
  containerStyle,
}: ModalButtonProps) => {
  return (
    <Button
      containerStyle={[
        styles.container,
        containerStyle,
        {
          backgroundColor:
            variant === "primary" ? globalGreen300 : globalGray150,
        },
      ]}
      onPress={onPress}
    >
      <NemoText
        level="body1"
        style={
          variant === "primary"
            ? { color: globalGray0 }
            : { color: globalGray700 }
        }
      >
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
