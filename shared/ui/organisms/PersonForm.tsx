import { MemberChip } from "@/features/team/hooks/useTeamMembers";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { globalGray200, globalGray700 } from "..";
import NemoText from "../atoms/NemoText";
import { ChipText } from "../molecules/Chips";
import NemoTextLabel from "../molecules/NemoTextLabel";
import PersonPositionModal from "../templates/PersonPositionModal";

interface PersonFormProps {
  disabled?: boolean;
  persons: MemberChip[];
  onPerson: (per: MemberChip[]) => (per: ChipText[]) => void;
}

const PersonForm = ({ disabled, persons, onPerson }: PersonFormProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const activeMembers = persons.filter((pos) => pos.isActive);
  const personLabel =
    activeMembers.length > 0
      ? `${activeMembers[0].displayName} ${activeMembers.length - 1 > 0 ? "+" + (activeMembers.length - 1) : ""}`
      : "지정없음";

  const member = persons.map((pos) => {
    return {
      id: pos.memberId,
      content: pos.displayName,
      isActive: pos.isActive,
    };
  });
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
          initialValue={member}
          closeModal={() => setIsOpenModal(false)}
          confirmModal={onPerson(persons)}
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
