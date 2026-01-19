import { AntDesign } from "@expo/vector-icons";
import { Modal, StyleSheet, View } from "react-native";
import { globalGray700, globalGreen700 } from "..";
import Chips from "../molecules/Chips";
import { TabsText } from "../molecules/Tabs";
import BottomModal from "../organisms/BottomModal";

interface PersonPositionModalProps {
  texts: TabsText[];
  closeModal: () => void;
  confirmModal: (data: string[]) => void;
}

const PersonPositionModal = ({
  texts,
  closeModal,
  confirmModal,
}: PersonPositionModalProps) => {
  let contents: string[] = [];
  const handleChips = (chips: TabsText[]) => {
    contents = chips
      .filter((chip) => chip.isActive)
      .map((chip) => chip.content);
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
          <Chips texts={texts} handler={handleChips} />
        </View>
      </BottomModal.Container>
    </Modal>
  );
};
const style = StyleSheet.create({});
export default PersonPositionModal;
