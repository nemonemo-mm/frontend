import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type NotificationPermissionResult = {
  hasPermission: boolean;
  fcmToken: string | null;
};

/**
 * 알림 권한을 요청하고 Expo Push Token을 가져옵니다.
 */
export async function requestNotificationPermissionAndFcmToken(): Promise<NotificationPermissionResult> {
  try {
    // 알림 권한 요청
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // 권한이 거부된 경우
    if (finalStatus !== "granted") {
      return { hasPermission: false, fcmToken: null };
    }

    // Android 13+ (API 33+) POST_NOTIFICATIONS 권한 확인
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const { status: androidStatus } =
        await Notifications.getPermissionsAsync();
      if (androidStatus !== "granted") {
        return { hasPermission: false, fcmToken: null };
      }
    }

    // Expo Push Token 가져오기
    // 이 토큰은 FCM/APNS와 호환되며 서버에서 사용할 수 있습니다
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "72d511b4-3dcd-49eb-877d-a1225aa316d9", // app.json의 EAS projectId
    });

    return {
      hasPermission: true,
      fcmToken: tokenData.data ?? null,
    };
  } catch (error) {
    console.error("알림 권한 요청 실패:", error);
    return { hasPermission: false, fcmToken: null };
  }
}
