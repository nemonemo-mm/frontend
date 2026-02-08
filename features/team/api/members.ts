import { apiClient } from "@/shared/utils/http";
import { TeamMember, TeamMembersResponse } from "../types/team.model";

export async function getTeamMembers(teamId: number) {
  const { data } = await apiClient.get<TeamMembersResponse>(
    `/teams/${teamId}/members`
  );
  return data;
}

export async function exitTeam(teamId: number) {
  await apiClient.delete(`/teams/${teamId}/members/me`);
}

export async function changeMemberPosition(
  teamId: number,
  memberId: number,
  body: { positionId: number }
): Promise<TeamMember> {
  const { data } = await apiClient.patch<TeamMember>(
    `/teams/${teamId}/members/${memberId}`,
    body
  );
  return data;
}

export async function removeMember(teamId: number, memberId: number) {
  await apiClient.delete(`/teams/${teamId}/members/${memberId}`);
}
