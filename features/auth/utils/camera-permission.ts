import { Camera } from "expo-camera";

export type CameraPermissionResult = {
  hasPermission: boolean;
};

export async function requestCameraPermission(): Promise<CameraPermissionResult> {
  const perm = await Camera.requestCameraPermissionsAsync();
  return { hasPermission: perm.granted };
}
