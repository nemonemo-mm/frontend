import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import {
  globalBorderSubtle,
  globalPrimaryMain,
  globalSurfaceDefault,
  globalTextSecondary,
} from "../index";
import Button from "./Button";

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
      label={label}
      containerStyle={[
        styles.container,
        containerStyle,
        {
          backgroundColor:
            variant === "primary" ? globalPrimaryMain : globalBorderSubtle,
        },
      ]}
      labelStyle={[
        styles.label,
        {
          color:
            variant === "primary" ? globalSurfaceDefault : globalTextSecondary,
        },
      ]}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
  },
  label: {
    fontWeight: "500",
    lineHeight: 18,
    fontSize: 16,
  },
});

export default ModalButton;
