import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { globalGray700, globalGreen700 } from "..";
import Chips, { ChipText } from "../molecules/Chips";
import { TabsText } from "../molecules/Tabs";
import BottomModal from "../organisms/BottomModal";

interface PersonPositionModalProps {
  initialValue: ChipText[];
  closeModal: () => void;
  confirmModal: (data: TabsText[]) => void;
}

const PersonPositionModal = ({
  initialValue,
  closeModal,
  confirmModal,
}: PersonPositionModalProps) => {
  const [contents, setContents] = useState<ChipText[]>(initialValue);
  const handleChips = (chips: ChipText[]) => {
    setContents(chips.filter((chip) => chip.isActive));
  };

  const handleConfirmModal = () => {
    confirmModal(contents);
    closeModal();
  };
  return (
    <Modal backdropColor={globalGray700 + "20"} animationType="slide">
      <BottomModal.Container>
        <BottomModal.Header>
          <BottomModal.LeftButton onPress={closeModal}>
            <AntDesign name="close" size={20} color={globalGray700} />
          </BottomModal.LeftButton>
          <BottomModal.RightButton onPress={handleConfirmModal}>
            <AntDesign name="check" size={20} color={globalGreen700} />
          </BottomModal.RightButton>
        </BottomModal.Header>
        <View style={{ minHeight: 260 }}>
          <Chips texts={contents} handler={handleChips} />
        </View>
      </BottomModal.Container>
    </Modal>
  );
};
const style = StyleSheet.create({});
export default PersonPositionModal;
