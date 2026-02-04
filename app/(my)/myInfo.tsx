import { useUser, useUserMutations } from "@/features/users/hooks/useUser";
import {
  globalBmRadius,
  globalGray0,
  globalGray200,
  globalGray700,
  globalGray900,
  globalRed600,
  globalSpacingLg,
  globalSpacingMd,
  globalSpacingSm,
  globalSpacingXs,
} from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import ModalEditableField from "@/shared/ui/organisms/ModalEditableField";
import { AntDesign, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MyInfoProps {}

const typeList = [
  { id: 1, name: "카메라" },
  { id: 2, name: "사진 보관함" },
];
const CLOSE_MESSAGE = "닫기";

const MyInfo = ({}: MyInfoProps) => {
  const route = useRouter();
  const userQuery = useUser();
  const user = userQuery.data;
  const { updateName, updateProfileImage } = useUserMutations();
  const handleConfirmUserName = (newUserName: string) => {
    updateName.mutate(newUserName, {
      onSuccess: () => userQuery.refetch(),
    });
  };

  const [isPressEditProfile, setIsPressEditProfile] = useState(false);

  const handlePressEditProfile = () => {
    setIsPressEditProfile(true);
  };

  const handlePressItem = (target: string) => async () => {
    if (target === "카메라") {
      await pickImage(true);
    }

    if (target === "사진 보관함") {
      await pickImage(false);
    }

    setIsPressEditProfile(false);
  };

  const pickImage = async (fromCamera: boolean) => {
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });

    if (result.canceled) return;

    const asset = result.assets[0];

    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      return;
    }

    updateProfileImage.mutate(asset, {
      onSuccess: () => userQuery.refetch(),
      onError: (e) => console.log(e),
    });
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
          <ProfileImage uri={user?.userImageUrl} size={64} />
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
      <Modal
        visible={isPressEditProfile}
        backdropColor={globalGray0 + "50"}
        style={{
          padding: 20,
          justifyContent: "flex-start",
          backgroundColor: globalGray0,
          borderRadius: globalBmRadius,
        }}
      >
        <FlatList
          data={typeList}
          keyExtractor={(item) => `item-${item.id}`}
          renderItem={({ item }) => (
            <Pressable onPress={handlePressItem(item.name)}>
              <View style={[styles.link, styles.list]}>
                <NemoText level="body2" style={{ color: globalGray900 }}>
                  {item.name}
                </NemoText>
              </View>
              <View style={styles.border} />
            </Pressable>
          )}
          ListFooterComponent={() => (
            <Pressable
              onPress={() => setIsPressEditProfile(false)}
              style={[styles.link, styles.list]}
            >
              <NemoText level="body2">{CLOSE_MESSAGE}</NemoText>
            </Pressable>
          )}
          style={[
            styles.linkContainer,
            { maxHeight: 150, margin: "auto", width: 355 },
          ]}
        />
      </Modal>
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
