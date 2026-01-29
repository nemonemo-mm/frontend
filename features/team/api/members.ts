import { apiClient } from "@/shared/utils/http";
import { TeamMembersResponse } from "../types/team.model";

export async function getTeamMembers(teamId: number) {
  const { data } = await apiClient.get<TeamMembersResponse>(
    `/teams/${teamId}/members`,
  );
  return data;
}

export async function exitTeam(teamId: number) {
  await apiClient.delete(`/teams/${teamId}/members/me`);
}
