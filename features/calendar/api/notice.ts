import { apiClient } from "@/shared/utils/http";

import { NoticeRequest, NoticeResponse } from "../types/notice.model";

export async function getNotice(teamId: number): Promise<NoticeResponse> {
  const { data } = await apiClient.get<NoticeResponse>(
    `/teams/${teamId}/notices/latest`
  );

  return data;
}

export async function createNotice(
  teamId: number,
  body: NoticeRequest
): Promise<NoticeResponse> {
  const { data } = await apiClient.post<NoticeResponse>(
    `/teams/${teamId}/notices`,
    body
  );

  return data;
}

export async function updateNotice(
  teamId: number,
  noticeId: number,
  body: NoticeRequest
): Promise<NoticeResponse> {
  const { data } = await apiClient.patch<NoticeResponse>(
    `/teams/${teamId}/notices/${noticeId}`,
    body
  );
  return data;
}

export async function deleteNotice(
  teamId: number,
  noticeId: number
): Promise<{}> {
  const { data } = await apiClient.delete<{}>(
    `/teams/${teamId}/notices/${noticeId}`
  );
  return data;
}
