import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { globalGray200, globalGray600, globalGray700 } from "..";
import NemoText from "../atoms/NemoText";
import ModalButton from "../molecules/ModalButton";
import SelectPositionColor from "../molecules/SelectPositionColor";
import BottomModal from "../organisms/BottomModal";

interface AddPositionModalProps {
  visible: boolean;
  onAddPosition: (positionName: string, colorHex: string) => void;
  closeModal: () => void;
}

const AddPositionModal = ({
  visible,
  onAddPosition,
  closeModal,
}: AddPositionModalProps) => {
  const [positionName, setPositionName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!visible) {
      setPositionName("");
      setSelectedColor(undefined);
    }
  }, [visible]);

  const isFormValid = positionName.trim().length > 0 && !!selectedColor;

  return (
    <Modal
      backdropColor={globalGray700 + "20"}
      transparent
      animationType="slide"
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={style.keyboardAvoidingView}
      >
        <BottomModal.Container>
          <BottomModal.Header>
            <BottomModal.LeftButton onPress={closeModal}>
              <AntDesign name="close" size={20} color={globalGray700} />
            </BottomModal.LeftButton>
          </BottomModal.Header>
          <View>
            <View>
              <NemoText level="body1">포지션 추가</NemoText>
              <TextInput
                placeholder="포지션 이름을 입력해 주세요"
                placeholderTextColor={globalGray600}
                style={style.inputContainer}
                value={positionName}
                onChangeText={setPositionName}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <SelectPositionColor
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <ModalButton
                label="생성하기"
                variant="primary"
                onPress={() => onAddPosition(positionName, selectedColor || "")}
                disabled={!isFormValid}
              />
            </View>
          </View>
        </BottomModal.Container>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const style = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    height: 48,
    borderWidth: 1,
    borderColor: globalGray200,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 12,
    marginBottom: 16,
  },
});

export default AddPositionModal;
