import { apiClient } from "@/shared/utils/http";
import { AlertResponse } from "../types/alert.model";

export async function getAlertAll(): Promise<AlertResponse[]> {
  const { data } = await apiClient.get<AlertResponse[]>("/alerts");
  return data;
}

export async function readAlert(alertId: number): Promise<AlertResponse> {
  const { data } = await apiClient.patch(`/alerts/${alertId}/read`);
  return data;
}
