import { AntDesign } from "@expo/vector-icons";
import { Modal, StyleSheet, View } from "react-native";
import { globalGray700, globalGreen700 } from "..";
import Checkbox from "../atoms/Checkbox";
import NemoText from "../atoms/NemoText";
import BottomModal from "../organisms/BottomModal";

interface AlarmModalProps {
  closeModal: () => void;
}

const AlarmModal = ({ closeModal }: AlarmModalProps) => {
  return (
    <Modal backdropColor={globalGray700 + "05"} animationType="slide">
      <BottomModal.Container>
        <BottomModal.Header>
          <BottomModal.LeftButton onPress={closeModal}>
            <AntDesign name="close" size={20} color={globalGray700} />
          </BottomModal.LeftButton>
          <BottomModal.Title>알림</BottomModal.Title>
          <BottomModal.RightButton>
            <AntDesign name="check" size={20} color={globalGreen700} />
          </BottomModal.RightButton>
        </BottomModal.Header>
        <View>
          <View style={style.checkboxContainer}>
            <NemoText level="body2">10분</NemoText>
            <Checkbox value={false} />
          </View>
          <View style={style.checkboxContainer}>
            <NemoText level="body2">30분</NemoText>
            <Checkbox value={false} />
          </View>
          <View style={style.checkboxContainer}>
            <NemoText level="body2">1시간</NemoText>
            <Checkbox value={false} />
          </View>
          <View style={style.checkboxContainer}>
            <NemoText level="body2">끔</NemoText>
            <Checkbox value={false} />
          </View>
        </View>
      </BottomModal.Container>
    </Modal>
  );
};
const style = StyleSheet.create({
  checkboxContainer: {
    height: 48,
    flexDirection: "row",

    paddingHorizontal: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
export default AlarmModal;
