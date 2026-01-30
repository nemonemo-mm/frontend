import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { globalGray200, globalGray700 } from "..";
import NemoText from "../atoms/NemoText";
import { ChipText } from "../molecules/Chips";
import NemoTextLabel from "../molecules/NemoTextLabel";
import PersonPositionModal from "../templates/PersonPositionModal";

interface PersonFormProps {
  disabled?: boolean;
  persons: ChipText[];
  onPerson: (per: ChipText[]) => void;
}

const PersonForm = ({ disabled, persons, onPerson }: PersonFormProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const personLabel =
    persons.filter((per) => per.isActive).length > 0
      ? persons.filter((per) => per.isActive).length
      : "지정없음";
  return (
    <View style={styles.optionContainer}>
      <NemoTextLabel>참석자</NemoTextLabel>
      <Pressable onPress={() => !disabled && setIsOpenModal(true)}>
        <NemoText level="body3" style={{ color: globalGray700 }}>
          {personLabel}
        </NemoText>
      </Pressable>
      {isOpenModal && (
        <PersonPositionModal
          initialValue={persons}
          closeModal={() => setIsOpenModal(false)}
          confirmModal={onPerson}
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
export default PersonForm;
