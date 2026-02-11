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
  currentPositionId?: number;
  existingPositions?: {
    positionId?: number;
    positionName: string;
    colorHex: string | null;
  }[];
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
  currentPositionId,
  existingPositions = [],
  onSubmit,
  onDelete,
}: AddPositionModalProps) => {
  const [positionName, setPositionName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );
  const [submitError, setSubmitError] = useState<{
    name: string;
    color: string;
  }>({
    name: "",
    color: "",
  });

  useEffect(() => {
    if (!visible) return;
    setSubmitError({ name: "", color: "" });
    setPositionName(mode === "edit" ? "" : (initialPositionName ?? ""));
    setSelectedColor(
      initialColorHex ? initialColorHex.toLowerCase() : undefined
    );
  }, [visible, mode, initialPositionName, initialColorHex]);

  const isFormValid =
    positionName.trim().length > 0 && !!selectedColor && !!onSubmit;
  const primaryLabel =
    mode === "create" ? "생성하기" : onSubmit ? "수정하기" : "닫기";
  const isSubmitDisabled = primaryLabel !== "닫기" && !isFormValid;
  const title =
    mode === "edit" && initialPositionName
      ? initialPositionName
      : "포지션 추가";
  const placeholderText =
    mode === "edit"
      ? "수정할 포지션 이름을 입력해 주세요"
      : "포지션 이름을 입력해 주세요";

  const handleChangePositionName = (value: string) => {
    setSubmitError((prev) => ({ ...prev, name: "" }));
    setPositionName(value);
  };

  const handleSelectColor = (color: string) => {
    setSubmitError((prev) => ({ ...prev, color: "" }));
    setSelectedColor(color);
  };

  const handlePrimaryPress = () => {
    if (!onSubmit) {
      closeModal();
      return;
    }

    const trimmedName = positionName.trim();
    const normalizedColor = selectedColor?.toLowerCase();

    const comparablePositions =
      mode === "edit"
        ? existingPositions.filter(
            (position) => position.positionId !== currentPositionId,
          )
        : existingPositions;

    const hasDuplicateName = comparablePositions.some(
      (position) =>
        position.positionName.trim().toLowerCase() === trimmedName.toLowerCase(),
    );
    const hasDuplicateColor = comparablePositions.some(
      (position) =>
        !!position.colorHex && position.colorHex.toLowerCase() === normalizedColor,
    );

    setSubmitError({
      name: hasDuplicateName ? "이미 사용 중인 포지션 이름이에요" : "",
      color: hasDuplicateColor ? "이미 사용 중인 포지션 색상이에요" : "",
    });

    if (hasDuplicateName || hasDuplicateColor) {
      return;
    }

    onSubmit(positionName, selectedColor || "");
  };

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
                  onChangeText={handleChangePositionName}
                />
                {submitError.name ? (
                  <NemoText level="caption" style={style.errorText}>
                    {submitError.name}
                  </NemoText>
                ) : null}
              </View>

              <View>
                <SelectPositionColor
                  selectedColor={selectedColor}
                  onColorSelect={handleSelectColor}
                />
                {submitError.color ? (
                  <NemoText level="caption" style={style.colorErrorText}>
                    {submitError.color}
                  </NemoText>
                ) : null}
              </View>

              <View style={{ marginBottom: 24, marginTop: 24 }}>
                <ModalButton
                  label={primaryLabel}
                  variant="primary"
                  onPress={handlePrimaryPress}
                  disabled={isSubmitDisabled}
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
    marginBottom: 12,
  },
  errorText: {
    color: globalRed400,
    marginBottom: 16,
  },
  colorErrorText: {
    color: globalRed400,
    marginTop: 16,
  },
});

export default AddPositionModal;
