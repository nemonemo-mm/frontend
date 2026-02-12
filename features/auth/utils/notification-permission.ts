import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * 알림 권한을 확인하고 필요 시 요청합니다.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (!Device.isDevice) {
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return false;
    }

    if (Platform.OS === "android" && Platform.Version >= 33) {
      const { status: androidStatus } =
        await Notifications.getPermissionsAsync();
      if (androidStatus !== "granted") {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("알림 권한 요청 실패:", error);
    return false;
  }
}
