import { apiClient } from "@/shared/utils/http";

export interface NotificationSettings {
  enableAllPersonalNotifications: boolean;
  enableScheduleChangeNotification: boolean;
  enableSchedulePreNotification: boolean;
  schedulePreNotificationMinutes: number[];
  enableTodoChangeNotification: boolean;
  enableTodoDeadlineNotification: boolean;
  todoDeadlineNotificationMinutes: number[];
  enableNoticeNotification: boolean;
}

export async function getNotificationSettings() {
  const { data } = await apiClient.get<NotificationSettings>(
    "notifications/personal",
  );
  return data;
}

export async function updateNotificationSettings(
  settings: NotificationSettings,
) {
  const { data } = await apiClient.put<NotificationSettings>(
    "notifications/personal",
    settings,
  );

  return data;
}
