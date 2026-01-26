import { apiClient } from "@/shared/utils/http";

export async function getTeamMembers(teamId: number) {
  return apiClient.get(`/teams/${teamId}/members`);
}
