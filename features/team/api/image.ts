import { apiClient } from "@/shared/utils/http";

export async function uploadTeamImage(teamId: number, image: string) {
  const { data } = await apiClient.post(`/images/teams/${teamId}`, { image });
  return data;
}
