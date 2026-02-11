import WasteBasketIcon from "@/assets/icons/waste-basket";
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
import { globalGray200, globalGray600, globalGray700, globalRed400 } from "..";
import NemoText from "../atoms/NemoText";
import ModalButton from "../molecules/ModalButton";
import SelectPositionColor from "../molecules/SelectPositionColor";
import BottomModal from "../organisms/BottomModal";

interface AddPositionModalProps {
  visible: boolean;
  closeModal: () => void;
  mode?: "create" | "edit";
  initialPositionName?: string;
  initialColorHex?: string | null;
  onSubmit?: (positionName: string, colorHex: string) => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
}

const AddPositionModal = ({
  visible,
  closeModal,
  mode = "create",
  initialPositionName,
  initialColorHex,
  onSubmit,
  onDelete,
}: AddPositionModalProps) => {
  const [positionName, setPositionName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );
  const [hasNameBeenFocused, setHasNameBeenFocused] = useState(false);

  useEffect(() => {
    if (!visible) {
      setHasNameBeenFocused(false);
      return;
    }
    setPositionName(mode === "edit" ? "" : (initialPositionName ?? ""));
    setSelectedColor(
      initialColorHex ? initialColorHex.toLowerCase() : undefined
    );
  }, [visible, mode, initialPositionName, initialColorHex]);

  const isFormValid =
    positionName.trim().length > 0 && !!selectedColor && !!onSubmit;
  const primaryLabel =
    mode === "create" ? "생성하기" : onSubmit ? "수정하기" : "닫기";
  const title =
    mode === "edit" && initialPositionName
      ? initialPositionName
      : "포지션 추가";
  const placeholderText =
    mode === "edit"
      ? "수정할 포지션 이름을 입력해 주세요"
      : "포지션 이름을 입력해 주세요";
  const validationMessage =
    positionName.trim().length > 0
      ? positionName.length > 10
        ? "포지션 이름을 10자 이내로 입력해주세요"
        : !selectedColor
          ? "포지션 색상을 선택해주세요"
          : ""
      : "포지션 이름을 입력해주세요";
  const errorMessage = hasNameBeenFocused ? validationMessage : "";
  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={style.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={style.keyboardAvoidingView}
        >
          <BottomModal.Container>
            <BottomModal.Header>
              <BottomModal.LeftButton onPress={closeModal}>
                <AntDesign name="close" size={20} color={globalGray700} />
              </BottomModal.LeftButton>
              {mode === "edit" && onDelete && (
                <View style={{ marginLeft: "auto" }}>
                  <BottomModal.RightButton onPress={onDelete}>
                    <WasteBasketIcon size={20} color={globalGray700} />
                  </BottomModal.RightButton>
                </View>
              )}
            </BottomModal.Header>
            <View>
              <View>
                <NemoText level="body1">{title}</NemoText>
                <TextInput
                  placeholder={placeholderText}
                  placeholderTextColor={globalGray600}
                  style={style.inputContainer}
                  value={positionName}
                  onChangeText={setPositionName}
                  onFocus={() => setHasNameBeenFocused(true)}
                />
                {errorMessage && (
                  <NemoText level="body2" style={{ color: globalRed400 }}>
                    {errorMessage}
                  </NemoText>
                )}
              </View>

              <View style={{ marginBottom: 20 }}>
                <SelectPositionColor
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                />
              </View>

              <View style={{ marginBottom: 24 }}>
                <ModalButton
                  label={primaryLabel}
                  variant="primary"
                  onPress={() =>
                    onSubmit
                      ? onSubmit(positionName, selectedColor || "")
                      : closeModal()
                  }
                  disabled={primaryLabel !== "닫기" && !isFormValid}
                />
              </View>
            </View>
          </BottomModal.Container>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
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
