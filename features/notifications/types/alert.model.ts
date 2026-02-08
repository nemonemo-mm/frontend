export interface AlertResponse {
  id: number;
  type: string;
  teamId: number;
  teamName: string;
  content: string;
  isRead: boolean;
  time: string;
  readAt: string;
}
