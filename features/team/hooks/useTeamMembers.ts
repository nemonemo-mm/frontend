import { useQuery } from "@tanstack/react-query";

import { getTeamMembers } from "../api/members";
import type { TeamMembersResponse } from "../types/team.model";

export function useTeamMembers(teamId: number | null) {
  const isEnabled = typeof teamId === "number" && teamId > 0;

  return useQuery<TeamMembersResponse>({
    queryKey: ["teams", teamId, "members"],
    queryFn: () => getTeamMembers(teamId as number),
    enabled: isEnabled,
  });
}
