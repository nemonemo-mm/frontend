import { apiClient } from "@/shared/utils/http";
import {
  TeamNotificationSettings,
  TeamNotificationUpdateRequest,
} from "../types/notification.model";

export async function registerDeviceToken(deviceToken: string) {
  await apiClient.post("/notifications/device-token", {
    deviceToken,
  });
}

export async function getTeamNotificationSettings(
  teamId: number
): Promise<TeamNotificationSettings> {
  const { data } = await apiClient.get<TeamNotificationSettings>(
    `notifications/teams/${teamId}`
  );
  return data;
}

export async function updateTeamNotificationSettings(
  teamId: number,
  settings: TeamNotificationUpdateRequest
) {
  const { data } = await apiClient.put<TeamNotificationSettings>(
    `notifications/teams/${teamId}`,
    settings
  );
  return data;
}
