import { socialLogin } from "@/features/auth/api/auth";
import { requestCameraPermission } from "@/features/auth/utils/camera-permission";
import { requestNotificationPermissionAndFcmToken } from "@/features/auth/utils/notification-permission";
import {
  clearPendingSocialLogin,
  getPendingSocialLogin,
  patchPendingSocialLogin,
} from "@/features/auth/utils/pendingSocialLogin";
import {
  saveAccessToken,
  saveRefreshToken,
} from "@/features/auth/utils/tokenStorage";
import { globalGray150, globalGray700, globalSpacingMd } from "@/shared/ui";

import GalleryIcon from "@/assets/icons/gallery";
import NotificationIcon from "@/assets/icons/notification";
import CtaButton from "@/shared/ui/molecules/CtaButton";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PermissionsScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => !isSubmitting, [isSubmitting]);

  const handleComplete = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const pending = await getPendingSocialLogin();
      if (!pending) {
        Alert.alert(
          "오류",
          "로그인 정보가 만료되었습니다. 다시 로그인해 주세요."
        );
        router.replace("/auth");
        return;
      }

      const userName = pending.userName?.trim() ?? "";
      if (!userName) {
        Alert.alert("오류", "이름이 비어있습니다. 이전 단계로 돌아가 주세요.");
        router.replace("/auth/signup");
        return;
      }

      // 1. 알림 권한 요청
      try {
        const { hasPermission, fcmToken } =
          await requestNotificationPermissionAndFcmToken();
        if (hasPermission && fcmToken) {
          await patchPendingSocialLogin({ deviceToken: fcmToken });
        }
      } catch (e) {
        console.error("알림 권한 요청 실패:", e);
        // 선택 권한이므로 실패해도 계속 진행
      }

      // 2. 카메라 권한 요청
      try {
        await requestCameraPermission();
      } catch (e) {
        console.error("카메라 권한 요청 실패:", e);
        // 선택 권한이므로 실패해도 계속 진행
      }

      // 3. 최종 socialLogin 호출
      const res = await socialLogin({
        ...pending,
        userName,
      });

      await saveAccessToken(res.accessToken);
      await saveRefreshToken(res.refreshToken);

      await clearPendingSocialLogin();

      // 서버가 여기서 newUser=false로 내려오는 게 정상 플로우
      router.replace("/0");
    } catch (e) {
      console.error(e);
      Alert.alert("가입 실패", "잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, router]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.text_h1, { marginBottom: 24 }]}>
            ‘Nemonemo’ 서비스 이용을 위한{`\n`}앱 권한 안내
          </Text>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <NotificationIcon />
              <View style={styles.rowText}>
                <Text style={styles.text_h3}>알림(선택)</Text>
                <Text style={styles.text_body1}>메시지 및 알림 수신</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <GalleryIcon />
              <View style={styles.rowText}>
                <Text style={styles.text_h3}>
                  사진/미디어 저장소 권한(선택)
                </Text>
                <Text style={styles.text_body1}>프로필 변경 및/사진 첨부</Text>
              </View>
            </View>
          </View>

          <Text style={styles.text_body3}>
            접근 권한에 동의하지 않아도 서비스 이용은 가능하나, 일부 기능 사용에
            제한이 있을 수 있습니다.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.text_body2}>선택적 접근권한 철회 방법</Text>
          <Text style={styles.text_body3}>
            설정 {`>`} 개인정보보호 {`>`} 해당 접근권한 {`>`} 접근권한 철회
          </Text>
        </View>
      </View>

      <CtaButton
        label={isSubmitting ? "처리 중..." : "홈으로"}
        onPress={handleComplete}
        isActive={canSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 134,
    marginHorizontal: 20,
    gap: globalSpacingMd,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  text_h1: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 27,
    fontFamily: "Pretendard-Regular",
    color: "#2B2B2B",
  },
  text_h3: {
    fontSize: 19,
    fontWeight: "500",
    lineHeight: 27,
    fontFamily: "Pretendard-Regular",
    color: "#2B2B2B",
  },
  text_body1: {
    fontSize: 16,
    fontWeight: "200",
    lineHeight: 27,
    fontFamily: "Pretendard-Regular",
    color: globalGray700,
  },
  text_body2: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 17,
    fontFamily: "Pretendard-Regular",
    color: "#2B2B2B",
  },
  text_body3: {
    fontSize: 12,
    fontWeight: "200",
    lineHeight: 17,
    fontFamily: "Pretendard-Regular",
    color: globalGray700,
  },
  rowIcon: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowText: { flex: 1, gap: 4 },
  divider: { height: 1, backgroundColor: globalGray150 },
});
