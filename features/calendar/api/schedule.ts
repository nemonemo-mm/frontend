import { apiClient } from "@/shared/utils/http";
import { ScheduleRequest, SchedulesResponse } from "../types/schedule.model";

export async function getTeamSchedule(
  teamId: number,
  params: {
    start: string;
    end: string;
  }
): Promise<SchedulesResponse[]> {
  const { data } = await apiClient.get<SchedulesResponse[]>(
    `/teams/${teamId}/schedules`,
    { params }
  );

  return data;
}

export async function getMySchedule(params: {
  start: string;
  end: string;
}): Promise<SchedulesResponse[]> {
  const { data } = await apiClient.get<SchedulesResponse[]>(`/me/schedules`, {
    params,
  });

  return data;
}

export async function addSchedule(
  body: ScheduleRequest
): Promise<SchedulesResponse> {
  const { data } = await apiClient.post<SchedulesResponse>(`/schedules`, body);
  return data;
}

export async function changeSchedule(
  scheduleId: number,
  body: ScheduleRequest
): Promise<SchedulesResponse> {
  const { data } = await apiClient.patch<SchedulesResponse>(
    `/schedules/${scheduleId}`,
    body
  );
  return data;
}

export async function deleteSchedule(scheduleId: number): Promise<{}> {
  const { data } = await apiClient.delete<{}>(`/schedules/${scheduleId}`);
  return data;
}
