import { deleteAccount } from "@/features/auth/api/auth";
import { useUser, useUserMutations } from "@/features/users/hooks/useUser";
import {
  globalGray0,
  globalGray200,
  globalGray700,
  globalRed600,
  globalSpacingLg,
  globalSpacingMd,
  globalSpacingSm,
  globalSpacingXl,
  globalSpacingXs,
} from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import ImageUploadModal from "@/shared/ui/molecules/ImageUploadModal";
import AlertModal from "@/shared/ui/organisms/AlertModal";
import ModalEditableField from "@/shared/ui/organisms/ModalEditableField";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MyInfo = () => {
  const route = useRouter();
  const userQuery = useUser();
  const user = userQuery.data;
  const { updateName, updateProfileImage } = useUserMutations();

  const [isImageSheetOpen, setIsImageSheetOpen] = useState(false);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<
    "deleteConfirm" | "deleteForbidden" | null
  >(null);

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      route.replace("/auth");
    },
    onError: (error) => {
      // 403: 명세상 권한 없음
      // 500: 실제 서버에서 팀장이 탈퇴 시 발생 중인 에러
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 403 || error.response?.status === 500)
      ) {
        setActiveModal("deleteForbidden");
      } else {
        console.error(error);
      }
    },
  });

  const handleConfirmUserName = (newUserName: string) => {
    updateName.mutate(newUserName, {
      onSuccess: () => userQuery.refetch(),
    });
  };

  const handlePressEditProfile = () => {
    setIsImageSheetOpen(true);
  };

  const handlePickCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setLocalImageUri(asset.uri);
      updateProfileImage.mutate(asset.uri);
    }
    setIsImageSheetOpen(false);
  };

  const handlePickLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setLocalImageUri(asset.uri);
      updateProfileImage.mutate(asset.uri);
    }
    setIsImageSheetOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Pressable onPress={() => route.back()}>
          <AntDesign name="left" size={16} color={globalGray700} />
        </Pressable>
        <NemoText level="h3">내 정보관리</NemoText>
      </View>
      <View style={styles.main}>
        <Pressable
          style={styles.profileSection}
          onPress={handlePressEditProfile}
        >
          <ProfileImage uri={localImageUri ?? user?.userImageUrl} size={64} />
          <View style={styles.editBtn}>
            <Feather name="edit-2" size={16} color={globalGray700} />
          </View>
        </Pressable>
        <ModalEditableField
          title="프로필명 변경"
          placeholder=""
          defaultValue={user?.userName}
          onConfirm={handleConfirmUserName}
        />
      </View>

      <ImageUploadModal
        visible={isImageSheetOpen}
        onClose={() => setIsImageSheetOpen(false)}
        onPressCamera={handlePickCamera}
        onPressLibrary={handlePickLibrary}
      />

      <View style={styles.footer}>
        <Pressable onPress={() => setActiveModal("deleteConfirm")}>
          <NemoText level="body1" style={{ color: globalRed600 }}>
            탈퇴하기
          </NemoText>
        </Pressable>
      </View>

      <AlertModal visible={!!activeModal} onClose={() => setActiveModal(null)}>
        {activeModal === "deleteConfirm" && (
          <>
            <AlertModal.Title>탈퇴할까요?</AlertModal.Title>
            <AlertModal.Actions
              type="double"
              confirmLabel="탈퇴하기"
              onConfirm={() => deleteAccountMutation.mutate()}
              cancelLabel="취소"
              onCancel={() => setActiveModal(null)}
            />
          </>
        )}
        {activeModal === "deleteForbidden" && (
          <>
            <AlertModal.Title>탈퇴 실패</AlertModal.Title>
            <AlertModal.Text>팀장은 탈퇴할 수 없습니다.</AlertModal.Text>
            <AlertModal.Actions
              type="single"
              confirmLabel="확인"
              onConfirm={() => setActiveModal(null)}
            />
          </>
        )}
      </AlertModal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 16,
    gap: 12,
  },
  main: {
    padding: 20,
  },
  border: {
    height: 1,
    backgroundColor: globalGray200,
  },
  profileSection: {
    justifyContent: "center",
    alignContent: "center",
    margin: "auto",
    gap: globalSpacingSm,
    marginBottom: globalSpacingXl,
    position: "relative",
  },
  editBtn: {
    position: "absolute",
    backgroundColor: globalGray0,
    borderRadius: globalSpacingLg,
    padding: 6,
    bottom: -6,
    right: 0,
  },
  linkContainer: {
    borderRadius: globalSpacingSm,
    backgroundColor: globalGray0,
    marginBottom: globalSpacingMd,
    overflow: "hidden",
  },
  link: {
    paddingHorizontal: globalSpacingXs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: globalGray0,
    height: 48,
  },
  list: {
    justifyContent: "center",
    width: "100%",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 1,
    marginBottom: 52,
    alignItems: "center",
  },
});
export default MyInfo;
