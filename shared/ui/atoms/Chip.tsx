import { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import {
  globalPrimaryChip,
  globalPrimarySoft,
  globalSurfaceDisabledstroke,
  globalSurfaceSubtle,
  globalTextDisabled,
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
    borderColor: globalSurfaceDisabledstroke,
    backgroundColor: globalSurfaceSubtle,
    color: globalTextDisabled,
  },
  active: {
    borderColor: globalPrimarySoft,
    backgroundColor: globalPrimarySoft,
    color: globalPrimaryChip,
  },
});
export default Chip;
