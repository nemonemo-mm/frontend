import { StyleSheet } from "react-native";
import {
  globalGray0,
  globalGray150,
  globalGray400,
  globalGreen300,
} from "../index";

import Button from "../atoms/Button";
import NemoText from "../atoms/NemoText";

interface CtaButtonProps {
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

const CtaButton = ({ label, onPress, isActive }: CtaButtonProps) => {
  return (
    <Button
      containerStyle={[
        styles.container,
        isActive
          ? { backgroundColor: globalGreen300 }
          : { backgroundColor: globalGray150 },
      ]}
      onPress={onPress}
      disabled={!isActive}
    >
      <NemoText
        level="h2"
        style={isActive ? { color: globalGray0 } : { color: globalGray400 }}
      >
        {label}
      </NemoText>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    minHeight: 46,
  },
});

export default CtaButton;
