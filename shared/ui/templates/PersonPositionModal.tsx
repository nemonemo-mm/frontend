import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { globalGray700, globalGreen700 } from "..";
import Chips, { ChipText } from "../molecules/Chips";
import BottomModal from "../organisms/BottomModal";

interface PersonPositionModalProps {
  initialValue: ChipText[];
  closeModal: () => void;
  confirmModal: (data: ChipText[]) => void;
}

const PersonPositionModal = ({
  initialValue,
  closeModal,
  confirmModal,
}: PersonPositionModalProps) => {
  const [contents, setContents] = useState<ChipText[]>(initialValue);
  const handleChips = (next: ChipText[]) => {
    setContents(next);
  };

  const handleConfirmModal = () => {
    confirmModal(contents);
    closeModal();
  };
  return (
    <Modal
      transparent
      backdropColor={globalGray700 + "20"}
      animationType="slide"
    >
      <View style={style.backdrop}>
        <Pressable style={{ flex: 1 }} onPress={closeModal} />
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
      </View>
    </Modal>
  );
};
const style = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000040",
  },
});
export default PersonPositionModal;
