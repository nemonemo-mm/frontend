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
