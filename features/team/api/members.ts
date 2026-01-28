import { apiClient } from "@/shared/utils/http";
import { TeamMember } from "../types/team.model";

export async function getTeamMembers(teamId: number) {
  const { data } = await apiClient.get<TeamMember[]>(
    `/teams/${teamId}/members`
  );
  return data;
}
