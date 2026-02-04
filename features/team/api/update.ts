import { apiClient } from "@/shared/utils/http";

export async function teamUpdateIntroduction(
  teamId: number,
  body: { description?: string }
) {
  const { data } = await apiClient.patch(`/teams/${teamId}`, body);
  return data;
}
