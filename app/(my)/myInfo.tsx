import { useUser, useUserMutations } from "@/features/users/hooks/useUser";
import {
  globalGray0,
  globalGray200,
  globalGray700,
  globalRed600,
  globalSpacingLg,
  globalSpacingMd,
  globalSpacingSm,
  globalSpacingXs,
} from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import ImageUploadModal from "@/shared/ui/molecules/ImageUploadModal";
import ModalEditableField from "@/shared/ui/organisms/ModalEditableField";
import { AntDesign, Feather } from "@expo/vector-icons";
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
    <SafeAreaView>
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
        <NemoText level="body1" style={{ color: globalRed600 }}>
          탈퇴하기
        </NemoText>
      </View>
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
    marginBottom: 20,
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
    margin: "auto",
    marginTop: 488,
    marginBottom: 18,
  },
});
export default MyInfo;
