import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export async function getExpoPushDeviceToken(): Promise<string | null> {
  try {
    if (!Device.isDevice) return null;

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      return null;
    }

    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    return expoPushToken.data ?? null;
  } catch (error) {
    console.error("Expo Push Token 조회 실패:", error);
    return null;
  }
}
