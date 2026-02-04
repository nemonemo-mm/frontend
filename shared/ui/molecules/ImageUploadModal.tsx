import { globalGray200, globalGreen200 } from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import { Modal, Pressable, StyleSheet, View } from "react-native";

interface ImageUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onPressCamera: () => void;
  onPressLibrary: () => void;
}

export default function ImageUploadModal({
  visible,
  onClose,
  onPressCamera,
  onPressLibrary,
}: ImageUploadModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Pressable style={styles.item} onPress={onPressCamera}>
            <NemoText level="body2">카메라</NemoText>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.item} onPress={onPressLibrary}>
            <NemoText level="body2">사진 보관함</NemoText>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.item} onPress={onClose}>
            <NemoText level="body2" style={styles.closeText}>
              닫기
            </NemoText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  sheet: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    height: 138,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
  },
  item: {
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: globalGreen200,
  },
  divider: {
    height: 1,
    backgroundColor: globalGray200,
  },
});
