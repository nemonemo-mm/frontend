import { StyleSheet } from "react-native";
import {
  globalCtaDisabledBackground,
  globalCtaDisabledText,
  globalPrimaryMain,
  globalSurfaceDefault,
} from "../index";
import Button from "./Button";

interface CtaButtonProps {
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

const CtaButton = ({ label, onPress, isActive }: CtaButtonProps) => {
  return (
    <Button
      label={label}
      containerStyle={[
        styles.container,
        !isActive && { backgroundColor: globalCtaDisabledBackground },
      ]}
      labelStyle={[styles.label, !isActive && { color: globalCtaDisabledText }]}
      onPress={onPress}
      disabled={!isActive}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalPrimaryMain,
    marginHorizontal: 20,
    minHeight: 46,
  },
  label: {
    color: globalSurfaceDefault,
    fontWeight: "500",
    lineHeight: 18,
    fontSize: 16,
  },
});

export default CtaButton;
