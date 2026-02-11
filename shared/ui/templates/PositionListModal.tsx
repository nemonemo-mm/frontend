import { PositionChip } from "@/features/position/hooks/usePositions";
import { useMemo, useRef } from "react";
import {
  Animated,
  FlatList,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { globalGray700 } from "..";
import NemoText from "../atoms/NemoText";
import BottomModal from "../organisms/BottomModal";

interface PositionListModalProps {
  positionList: PositionChip[];
  onPressPosition: (id: number) => () => void;
  onPointerDown: () => void;
}

const AnimatedBottomModalContainer = Animated.createAnimatedComponent(
  BottomModal.Container,
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
    }),
  ).current;

  const indicatorHandlers = useMemo(
    () => panResponder.panHandlers,
    [panResponder],
  );

  // 각 아이템 높이 48px + marginBottom 8px = 56px
  // 헤더 높이 약 40px + 상하 패딩 20px
  const ITEM_HEIGHT = 56;
  const HEADER_HEIGHT = 60;
  const modalHeight = Math.min(
    Math.max(HEADER_HEIGHT + positionList.length * ITEM_HEIGHT, 150),
    400,
  );

  return (
    <Modal transparent animationType="slide" onRequestClose={onPointerDown}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onPointerDown} />
        <AnimatedBottomModalContainer
          style={{
            height: modalHeight + 24,
            paddingBottom: 24,
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
                <NemoText level="body2">{item.positionName}</NemoText>
              </Pressable>
            )}
          />
        </AnimatedBottomModalContainer>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${globalGray700}20`,
  },
  positionName: {
    height: 48,
    justifyContent: "center",
    marginBottom: 8,
  },
});
export default PositionListModal;
