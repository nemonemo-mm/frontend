import { apiClient } from "@/shared/utils/http";

export interface TeamNotificationSettings {
  id: number;
  teamId: number;
  teamName: string;
  userId: number;
  enableTeamAlarm: boolean;
  enableTeamMemberNotification: boolean;
  enableNoticeNotification: boolean;
  enableScheduleChangeNotification: boolean;
  enableSchedulePreNotification: boolean;
  schedulePreNotificationMinutes: number[];
  enableTodoChangeNotification: boolean;
  enableTodoDeadlineNotification: boolean;
  todoDeadlineNotificationMinutes: number[];
  createdAt: string;
  updatedAt: string;
}

export async function getTeamNotificationSettings(
  teamId: number
): Promise<TeamNotificationSettings> {
  const { data } = await apiClient.get<TeamNotificationSettings>(
    `notifications/teams/${teamId}`
  );
  return data;
}

export interface TeamNotificationUpdateRequest {
  enableTeamAlarm: boolean;
  enableScheduleChangeNotification: boolean;
  enableSchedulePreNotification: boolean;
  schedulePreNotificationMinutes: number[];
  enableTodoChangeNotification: boolean;
  enableTodoDeadlineNotification: boolean;
  todoDeadlineNotificationMinutes: number[];
  enableTeamMemberNotification: boolean;
  enableNoticeNotification: boolean;
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
