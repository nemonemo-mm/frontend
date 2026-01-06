import { StyleSheet, View } from "react-native";
import NemoText from "../atoms/NemoText";
import ProfileImage from "../atoms/ProfileImage";
import {
  globalGray0,
  globalGray700,
  globalSpacingLg,
  globalSpacingSm,
  globalSpacingXs,
} from "../index";
import ModalButton from "../molecules/ModalButton";

interface AlertModalProps {
  children?: React.ReactNode;
  title: string;
  content?: string;
  cancelLabel?: string;
  confirmLabel: string;
  onCancel?: () => void;
  onConfirm: () => void;
}

/**
 * AlertModal 컴포넌트
 *
 * @example
 * // 버튼 하나만
 * <AlertModal
 *   title="알림"
 *   content="작업이 완료되었습니다."
 *   confirmLabel="확인"
 *   onConfirm={() => {}}
 * />
 *
 * @example
 * // 버튼 두 개
 * <AlertModal
 *   title="알림"
 *   content="이 작업을 진행하시겠습니까?"
 *   cancelLabel="취소"
 *   confirmLabel="확인"
 *   onCancel={() => {}}
 *   onConfirm={() => {}}
 * />
 *
 * @example
 * // 프로필 이미지 포함 (기본 이미지)
 * <AlertModal
 *   title="모달 타이틀"
 *   content="모달 본문내용"
 *   confirmLabel="맞아요"
 *   onConfirm={() => {}}
 * >
 *   <AlertModal.ProfileImage />
 * </AlertModal>
 *
 * @example
 * // 프로필 이미지 포함 (커스텀 이미지)
 * <AlertModal
 *   title="모달 타이틀"
 *   content="모달 본문내용"
 *   cancelLabel="취소하기"
 *   confirmLabel="맞아요"
 *   onCancel={() => {}}
 *   onConfirm={() => {}}
 * >
 *   <AlertModal.ProfileImage uri={userData?.profileImage} size={56} />
 * </AlertModal>
 */

const AlertModal = ({
  title,
  content,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  children,
}: AlertModalProps) => {
  return (
    <View style={styles.container}>
      {children && <View style={styles.image}>{children}</View>}

      <View style={styles.title}>
        <NemoText level="h3">{title}</NemoText>
      </View>

      {content && (
        <View style={styles.content}>
          <NemoText level="body2" style={{ color: globalGray700 }}>
            {content}
          </NemoText>
        </View>
      )}

      <View style={styles.footer}>
        {cancelLabel && onCancel && (
          <View style={styles.buttonWrapper}>
            <ModalButton
              label={cancelLabel}
              variant="secondary"
              onPress={onCancel}
            />
          </View>
        )}
        <View style={styles.buttonWrapper}>
          <ModalButton
            label={confirmLabel}
            variant="primary"
            onPress={onConfirm}
          />
        </View>
      </View>
    </View>
  );
};

// Composition을 위해 ProfileImage를 붙임
AlertModal.ProfileImage = ProfileImage;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginHorizontal: 53,
    backgroundColor: globalGray0,
    borderRadius: 14,
    gap: globalSpacingSm,
    padding: globalSpacingLg,
    alignSelf: "center",
  },
  image: {
    alignItems: "center",
  },
  title: {
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    gap: globalSpacingXs,
  },
  buttonWrapper: {
    flex: 1,
  },
});

export default AlertModal;
