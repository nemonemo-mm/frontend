import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { globalGray200, globalGray700, globalGreen700 } from "..";
import BottomModal from "../organisms/BottomModal";
import Wheel from "../organisms/Wheel";

interface TimeModalProps {
  closeModal: () => void;
}

const TimeModal = ({ closeModal }: TimeModalProps) => {
  const currentHour = new Date().getHours();
  const currentMin = new Date().getMinutes();

  const hours = Array.from({ length: 24 }, (_, i) => i + 1);
  const mins = Array.from({ length: 60 }, (_, i) => i);

  const [hour, setHour] = useState(currentHour);
  const [min, setMin] = useState(currentMin);

  return (
    <Modal backdropColor={globalGray700 + "20"} animationType="slide">
      <BottomModal.Container>
        <BottomModal.Header>
          <BottomModal.LeftButton onPress={closeModal}>
            <AntDesign name="close" size={20} color={globalGray700} />
          </BottomModal.LeftButton>
          <BottomModal.Title>시간</BottomModal.Title>
          <BottomModal.RightButton>
            <AntDesign name="check" size={20} color={globalGreen700} />
          </BottomModal.RightButton>
        </BottomModal.Header>
        <View style={{ flexDirection: "row" }}>
          <Wheel data={hours} value={hour} onChange={setHour} />
          <View style={style.divider} />
          <Wheel data={mins} value={min} onChange={setMin} />
        </View>
      </BottomModal.Container>
    </Modal>
  );
};
const style = StyleSheet.create({
  divider: {
    width: 1,
    height: 110,
    backgroundColor: globalGray200,
    marginHorizontal: 8,
  },
});
export default TimeModal;
