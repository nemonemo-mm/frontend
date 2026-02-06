import { PositionChip } from "@/features/position/hooks/usePositions";
import { useMemo, useRef } from "react";
import {
  Animated,
  FlatList,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
} from "react-native";
import { globalGray700 } from "..";
import NemoTextLabel from "../molecules/NemoTextLabel";
import BottomModal from "../organisms/BottomModal";

interface PositionListModalProps {
  positionList: PositionChip[];
  onPressPosition: (id: number) => () => void;
  onPointerDown: () => void;
}

const AnimatedBottomModalContainer = Animated.createAnimatedComponent(
  BottomModal.Container
);

const PositionListModal = ({
  positionList,
  onPressPosition,
  onPointerDown,
}: PositionListModalProps) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onPanResponderGrant: () => {
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        const next = Math.max(gestureState.dy, 0);
        if (next <= 250) {
          translateY.setValue(next);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80) {
          Animated.timing(translateY, {
            toValue: 400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            translateY.setValue(0);
            onPointerDown();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const indicatorHandlers = useMemo(() => panResponder.panHandlers, [panResponder]);

  return (
    <Modal backdropColor={globalGray700 + "20"} animationType="slide">
      <AnimatedBottomModalContainer
        style={{
          height: 300,
          transform: [{ translateY }],
        }}
      >
        <BottomModal.Header {...indicatorHandlers}>
          <BottomModal.Indicator />
        </BottomModal.Header>
        <FlatList
          data={positionList}
          keyExtractor={(item) => `position-${item.positionId}`}
          renderItem={({ item }) => (
            <Pressable
              onPress={onPressPosition(item.positionId)}
              style={styles.positionName}
            >
              <NemoTextLabel>{item.positionName}</NemoTextLabel>
            </Pressable>
          )}
        />
      </AnimatedBottomModalContainer>
    </Modal>
  );
};
const styles = StyleSheet.create({
  positionName: {
    marginBottom: 8,
  },
});
export default PositionListModal;
