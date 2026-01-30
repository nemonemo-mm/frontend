import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { globalGray200, globalGray700 } from "..";
import NemoText from "../atoms/NemoText";
import { ChipText } from "../molecules/Chips";
import NemoTextLabel from "../molecules/NemoTextLabel";
import PersonPositionModal from "../templates/PersonPositionModal";

interface PositionFormProps {
  positions: ChipText[];
  onPosition: (pos: ChipText[]) => void;
}

const PositionForm = ({ positions, onPosition }: PositionFormProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const positionLabel =
    positions.filter((pos) => pos.isActive).length > 0
      ? positions.filter((pos) => pos.isActive).length
      : "지정없음";
  return (
    <View style={styles.optionContainer}>
      <NemoTextLabel>포지션</NemoTextLabel>
      <Pressable onPress={() => setIsOpenModal(true)}>
        <NemoText level="body3" style={{ color: globalGray700 }}>
          {positionLabel}
        </NemoText>
      </Pressable>
      {isOpenModal && (
        <PersonPositionModal
          initialValue={positions}
          closeModal={() => setIsOpenModal(false)}
          confirmModal={onPosition}
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
