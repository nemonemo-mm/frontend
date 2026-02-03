import { apiClient } from "@/shared/utils/http";
import {
  PositionAddRequest,
  PositionAddResponse,
  PositionResponse,
  PositionUpdateRequest,
  PositionUpdateResponse,
} from "../types/position.model";

export async function GetPosition(teamId: number): Promise<PositionResponse[]> {
  const { data } = await apiClient.get<PositionResponse[]>(
    `/teams/${teamId}/positions`
  );

  return data;
}

export async function AddPosition(
  teamId: number,
  body: PositionAddRequest | PositionAddRequest[]
): Promise<PositionAddResponse[]> {
  const { data } = await apiClient.post<PositionAddResponse[]>(
    `/teams/${teamId}/positions`,
    body
  );

  return data;
}

export async function UpdatePosition(
  teamId: number,
  positionId: number,
  body: PositionUpdateRequest
) {
  const { data } = await apiClient.put<PositionUpdateResponse>(
    `/teams/${teamId}/positions/${positionId}`,
    body
  );
  return data;
}

export async function DeletePosition(
  teamId: number,
  positionId: number
): Promise<void> {
  await apiClient.delete(`/teams/${teamId}/positions/${positionId}`);
}
