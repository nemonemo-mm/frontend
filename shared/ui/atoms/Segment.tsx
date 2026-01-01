import { ReactNode } from "react";
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import {
  globalPrimaryChip,
  globalSurfaceBackground,
  globalTextDisabled,
} from "..";
import NemoText from "./NemoText";

interface SegmentProps {
  isActive: boolean;
  onPress: (e: GestureResponderEvent) => void;
  children: ReactNode;
}

const Segment = ({ isActive, onPress, children, ...props }: SegmentProps) => {
  return (
    <Pressable
      style={[
        style.segment,
        isActive ? style.activeSegment : style.inactiveSegment,
      ]}
      onPress={onPress}
      {...props}
    >
      <NemoText
        level="h2"
        style={[isActive ? style.activeText : style.inactiveText]}
      >
        {children}
      </NemoText>
    </Pressable>
  );
};

const style = StyleSheet.create({
  segment: {
    paddingVertical: 6,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  activeSegment: {
    backgroundColor: "#fff",
  },
  inactiveSegment: { backgroundColor: globalSurfaceBackground },
  activeText: {
    color: globalPrimaryChip,
  },
  inactiveText: {
    color: globalTextDisabled,
  },
});

export default Segment;
