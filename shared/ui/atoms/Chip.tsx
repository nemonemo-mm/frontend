import { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import {
  globalGray0,
  globalGray250,
  globalGreen400,
  globalGreen50,
  globalGreen700,
} from "..";

interface ChipProps {
  children: ReactNode;
  active: boolean;
  onPress: () => void;
}

const Chip = ({ children, active, onPress }: ChipProps) => {
  return (
    <Text
      onPress={onPress}
      style={[active ? style.active : style.inactive, style.chip]}
    >
      {children}
    </Text>
  );
};

const style = StyleSheet.create({
  chip: {
    borderRadius: 9999,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  inactive: {
    borderColor: globalGray250,
    backgroundColor: globalGray0,
    color: globalGreen400,
  },
  active: {
    borderColor: globalGreen50,
    backgroundColor: globalGreen50,
    color: globalGreen700,
  },
});
export default Chip;
