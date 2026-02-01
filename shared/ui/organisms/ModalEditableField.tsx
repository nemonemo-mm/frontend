import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import {
  globalGray0,
  globalGray700,
  globalGray900,
  globalSpacingMd,
  globalSpacingSm,
  globalSpacingXs,
} from "..";
import NemoText from "../atoms/NemoText";
import AlertModal from "./AlertModal";

interface ModalEditableFieldProps {
  title: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  onConfirm: (v: string) => void;
}

const ModalEditableField = ({
  title,
  description,
  placeholder = "",
  defaultValue,
  onConfirm,
}: ModalEditableFieldProps) => {
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const [currentInput, setCurrentInput] = useState(defaultValue ?? "");

  const handleCurrentInput = (text: string) => {
    setCurrentInput(text);
  };

  const handleClickEdit = () => {
    setIsOpenEditModal(true);
  };
  const handleClickCancel = () => {
    setIsOpenEditModal(false);
  };
  const handleClickConfirm = () => {
    setIsOpenEditModal(false);
    onConfirm(currentInput);
  };

  return (
    <>
      <Pressable
        style={[styles.linkContainer, styles.link]}
        onPress={handleClickEdit}
      >
        <NemoText
          level="h2"
          style={{ color: globalGray900, textAlign: "left", maxWidth: "90%" }}
          ellipsizeMode="tail"
          lineBreakMode="tail"
          numberOfLines={1}
        >
          {defaultValue && defaultValue !== "" ? defaultValue : placeholder}
        </NemoText>
        <Feather name="edit-2" size={16} color={globalGray700} />
      </Pressable>
      {isOpenEditModal && (
        <AlertModal
          visible={isOpenEditModal}
          onClose={() => setIsOpenEditModal(false)}
        >
          <AlertModal.Title>{title}</AlertModal.Title>
          {description && <AlertModal.Text>{description}</AlertModal.Text>}
          <AlertModal.Input
            placeholder={placeholder}
            value={currentInput}
            onChangeText={handleCurrentInput}
          />
          <AlertModal.Actions
            type="double"
            cancelLabel="취소하기"
            onCancel={handleClickCancel}
            confirmLabel="변경하기"
            onConfirm={handleClickConfirm}
          />
        </AlertModal>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  linkContainer: {
    borderRadius: globalSpacingSm,
    backgroundColor: globalGray0,
    marginBottom: globalSpacingMd,
    overflow: "hidden",
  },
  link: {
    padding: globalSpacingXs,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: globalGray0,
    height: 48,
  },
});
export default ModalEditableField;
