import ChevronLeftIcon from "@/assets/icons/chevron-left";
import { logout } from "@/features/auth/api/auth";
import { clearTokens } from "@/features/auth/utils/tokenStorage";
import { useUser } from "@/features/users/hooks/useUser";
import {
  globalGray0,
  globalGray200,
  globalGray700,
  globalGray900,
  globalSpacing2xl,
  globalSpacingMd,
  globalSpacingSm,
  globalSpacingXs,
} from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import AlertModal from "@/shared/ui/organisms/AlertModal";
import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Linking, Platform, Pressable, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface MyScreenProps {}

const MyScreen = ({}: MyScreenProps) => {
  const route = useRouter();
  const user = useUser().data;

  const [isOpenModal, setIsOpenModal] = useState(false);

  const queryClient = useQueryClient();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await clearTokens();
      queryClient.clear();
      route.replace("/auth");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsOpenModal(false);
  };
  const handleOpenDeviceSettings = () => {
    Linking.openSettings();
  };

  const insets = useSafeAreaInsets();
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <SafeAreaView
      style={[{ paddingTop: Platform.OS == "ios" ? 0 : insets.top }]}
    >
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => route.back()}>
          <ChevronLeftIcon />
        </Pressable>
        <NemoText
          level="h3"
          style={{ color: globalGray900, textAlign: "center" }}
        >
          설정
        </NemoText>
      </View>
      <View style={styles.main}>
        <View style={styles.profileSection}>
          <ProfileImage uri={user?.userImageUrl} size={64} />
          <NemoText
            level="h2"
            style={{ color: globalGray900, textAlign: "center" }}
          >
            {user?.userName}
          </NemoText>
        </View>
        <View style={styles.linkSection}>
          <Pressable
            style={[styles.linkContainer, styles.link]}
            onPress={() => route.push("/myInfo")}
          >
            <NemoText
              level="h2"
              style={{ color: globalGray900, textAlign: "center" }}
            >
              내 정보 관리
            </NemoText>
            <AntDesign name="right" size={16} color={globalGray700} />
          </Pressable>
          <View style={[styles.linkContainer]}>
            <Pressable
              style={styles.link}
              onPress={() => route.push("/teamAlarm")}
            >
              <NemoText
                level="h2"
                style={{ color: globalGray900, textAlign: "center" }}
              >
                알림 설정
              </NemoText>
              <AntDesign name="right" size={16} color={globalGray700} />
            </Pressable>
            <View style={styles.border} />
            <Pressable style={styles.link} onPress={handleOpenDeviceSettings}>
              <NemoText
                level="h2"
                style={{ color: globalGray900, textAlign: "center" }}
              >
                알림 권한 설정
              </NemoText>
              <AntDesign name="right" size={16} color={globalGray700} />
            </Pressable>
          </View>
          <View style={[styles.linkContainer]}>
            <Pressable
              style={[styles.link]}
              onPress={() => route.push("/info")}
            >
              <NemoText
                level="h2"
                style={{ color: globalGray900, textAlign: "center" }}
              >
                개인정보 처리방침
              </NemoText>
              <AntDesign name="right" size={16} color={globalGray700} />
            </Pressable>
            <View style={styles.border} />
            <View style={[styles.link]}>
              <NemoText
                level="h2"
                style={{ color: globalGray900, textAlign: "center" }}
              >
                버전정보
              </NemoText>

              <View style={{ margin: "auto" }} />
              <NemoText
                level="body3"
                style={{ color: globalGray700, textAlign: "center" }}
              >
                {appVersion}
              </NemoText>
            </View>
          </View>
          <Pressable
            style={[styles.linkContainer, styles.link]}
            onPress={() => setIsOpenModal(true)}
          >
            <NemoText
              level="h2"
              style={{ color: globalGray900, textAlign: "center" }}
            >
              로그아웃
            </NemoText>
          </Pressable>
        </View>
      </View>

      <AlertModal visible={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <AlertModal.Title>로그아웃 할까요?</AlertModal.Title>
        <AlertModal.Actions
          type="double"
          confirmLabel="로그아웃"
          onConfirm={() => handleLogout()}
          cancelLabel="취소하기"
          onCancel={() => setIsOpenModal(false)}
        />
      </AlertModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  main: {
    paddingHorizontal: 20,
  },
  profileSection: {
    justifyContent: "center",
    alignItems: "center",
    gap: globalSpacingSm,
    marginBottom: globalSpacing2xl,
  },
  linkSection: {},
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
  border: {
    height: 1,
    backgroundColor: globalGray200,
  },
});

export default MyScreen;
