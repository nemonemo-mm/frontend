import { apiClient } from "@/shared/utils/http";
import {
  PositionAddRequest,
  PositionAddResponse,
  PositionResponse,
} from "../types/position.model";

export async function GetPosition(teamId: number): Promise<PositionResponse> {
  const { data } = await apiClient.get<PositionResponse>(
    `/teams/${teamId}/positions`
  );

  return data;
}

export async function AddPosition(
  teamId: number,
  body: PositionAddRequest[]
): Promise<PositionAddResponse[]> {
  const { data } = await apiClient.post<PositionAddResponse[]>(
    `/teams/${teamId}/positions`,
    body
  );

  return data;
}
