import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet } from "react-native";
import { globalGray700, globalGreen700 } from "..";
import BottomModal from "../organisms/BottomModal";
import CalendarModal from "./CalendarModal";

interface ScheduleModalProps {
  selectedDate: Date;
  closeModal: () => void;
}

const ScheduleModal = ({ selectedDate, closeModal }: ScheduleModalProps) => {
  const [isOpenCalendarModal, setIsOpenCalendarModal] = useState(false);
  const handleConfirmModal = () => {
    setIsOpenCalendarModal(true);
  };

  const handleAddSchedule = () => {};
  return (
    <Modal backdropColor={globalGray700 + "40"} animationType="slide">
      <BottomModal.Container>
        <BottomModal.Header>
          <BottomModal.LeftButton onPress={closeModal}>
            <AntDesign name="close" size={20} color={globalGray700} />
          </BottomModal.LeftButton>
          <BottomModal.RightButton onPress={handleConfirmModal}>
            <EvilIcons name="plus" size={30} color={globalGreen700} />
          </BottomModal.RightButton>
        </BottomModal.Header>
      </BottomModal.Container>
      {isOpenCalendarModal && (
        <CalendarModal
          selectedDate={selectedDate}
          closeModal={() => setIsOpenCalendarModal(false)}
          confirmModal={handleAddSchedule}
        />
      )}
    </Modal>
  );
};
const style = StyleSheet.create({});
export default ScheduleModal;
