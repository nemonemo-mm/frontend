export interface NoticeResponse {
  id: number;
  teamId: number;
  teamName: string;
  content: string;
  authorId: 1;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeRequest {
  content: string;
}
