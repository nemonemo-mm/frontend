import { StyleSheet, View } from "react-native";
import { globalGray0, globalSpacingLg, globalSpacingSm } from "../index";

import ProfileImage from "../atoms/ProfileImage";
import AlertModalActions from "../molecules/AlertModalAction";
import AlertModalInput from "../molecules/AlertModalInput";
import AlertModalText from "../molecules/AlertModalText";
import AlertModalTitle from "../molecules/AlertModalTitle";

interface AlertModalProps {
  children: React.ReactNode;
}

/**
 * AlertModal - Compound Component Pattern
 *
 * 각 하위 컴포넌트를 조합하여 다양한 형태의 모달 구성 가능
 *
 * @example
 * // 기본 확인 모달
 * <AlertModal>
 *   <AlertModal.Title>알림</AlertModal.Title>
 *   <AlertModal.Text>작업이 완료되었습니다.</AlertModal.Text>
 *   <AlertModal.Actions
 *     type="single"
 *     confirmLabel="확인"
 *     onConfirm={() => {}}
 *   />
 * </AlertModal>
 *
 * @example
 * // 이미지 + 타이틀 + 설명
 * <AlertModal>
 *   <AlertModal.ProfileImage size={56} />
 *   <AlertModal.Title>사용자 정보</AlertModal.Title>
 *   <AlertModal.Text>정보를 수정하시겠습니까?</AlertModal.Text>
 *   <AlertModal.Actions
 *     type="double"
 *     cancelLabel="취소"
 *     confirmLabel="수정"
 *     onCancel={() => {}}
 *     onConfirm={() => {}}
 *   />
 * </AlertModal>
 *
 * @example
 * // 타이틀 + 설명 + Input
 * <AlertModal>
 *   <AlertModal.Title>탈퇴하기</AlertModal.Title>
 *   <AlertModal.Text>
 *     계정을 삭제하려면 탈퇴하기를 입력해주세요
 *   </AlertModal.Text>
 *   <AlertModal.Input
 *     placeholder="소개글"
 *     value={value}
 *     onChangeText={setValue}
 *   />
 *   <AlertModal.Actions
 *     type="double"
 *     cancelLabel="취소하기"
 *     confirmLabel="탈퇴하기"
 *     onCancel={() => {}}
 *     onConfirm={() => {}}
 *   />
 * </AlertModal>
 *
 * @example
 * // 타이틀 + Input만
 * <AlertModal>
 *   <AlertModal.Title>이름 변경</AlertModal.Title>
 *   <AlertModal.Input
 *     placeholder="새 이름 입력"
 *     value={value}
 *     onChangeText={setValue}
 *   />
 *   <AlertModal.Actions
 *     type="double"
 *     cancelLabel="취소"
 *     confirmLabel="저장"
 *     onCancel={() => {}}
 *     onConfirm={() => {}}
 *   />
 * </AlertModal>
 */
const AlertModal = ({ children }: AlertModalProps) => {
  return <View style={styles.container}>{children}</View>;
};

// Compound Components
AlertModal.Title = AlertModalTitle;
AlertModal.Text = AlertModalText;
AlertModal.Input = AlertModalInput;
AlertModal.Actions = AlertModalActions;
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
});

export default AlertModal;
