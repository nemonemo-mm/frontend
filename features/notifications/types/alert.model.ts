import type { AlertType } from "@/shared/utils/alertNavigation";

export interface AlertResponse {
  id: number;
  type: AlertType;
  teamId: number;
  teamName: string;
  content: string;
  isRead: boolean;
  time: string;
  readAt: string;
}
