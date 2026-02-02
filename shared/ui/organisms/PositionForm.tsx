import { PositionChip } from "@/features/position/hooks/usePositions";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { globalGray200, globalGray700 } from "..";
import NemoText from "../atoms/NemoText";
import { ChipText } from "../molecules/Chips";
import NemoTextLabel from "../molecules/NemoTextLabel";
import PersonPositionModal from "../templates/PersonPositionModal";

interface PositionFormProps {
  disabled?: boolean;
  positions: PositionChip[];
  onPosition: (v: PositionChip[]) => (pos: ChipText[]) => void;
}

const PositionForm = ({
  disabled,
  positions,
  onPosition,
}: PositionFormProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const activePositions = positions.filter((pos) => pos.isActive);

  const positionLabel =
    activePositions.length > 0
      ? `${activePositions[0].positionName} ${activePositions.length - 1 > 0 ? "+" + (activePositions.length - 1) : ""}`
      : "지정없음";

  const position = positions.map((pos) => {
    return {
      id: pos.positionId,
      content: pos.positionName,
      isActive: pos.isActive,
    };
  });
  return (
    <View style={styles.optionContainer}>
      <NemoTextLabel>포지션</NemoTextLabel>
      <Pressable onPress={() => !disabled && setIsOpenModal(true)}>
        <NemoText level="body3" style={{ color: globalGray700 }}>
          {positionLabel}
        </NemoText>
      </Pressable>
      {isOpenModal && (
        <PersonPositionModal
          initialValue={position}
          closeModal={() => setIsOpenModal(false)}
          confirmModal={onPosition(positions)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    height: 48,
    paddingHorizontal: 8,
    borderBottomColor: globalGray200,
    borderBottomWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default PositionForm;
