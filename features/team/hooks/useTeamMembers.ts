import { useQuery } from "@tanstack/react-query";

import { getTeamMembers } from "../api/members";
import type { TeamMember, TeamMembersResponse } from "../types/team.model";
export interface MemberChip extends TeamMember {
  isActive: boolean;
}

export function toMemberChip(member: TeamMember): MemberChip {
  return {
    ...member,
    isActive: false,
  };
}

export function useTeamMembers(teamId: number | null) {
  const isEnabled = typeof teamId === "number" && teamId > 0;

  return useQuery<TeamMembersResponse>({
    queryKey: ["teams", teamId, "members"],
    queryFn: () => getTeamMembers(teamId as number),
    enabled: isEnabled,
  });
}
