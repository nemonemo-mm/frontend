import { useQuery } from "@tanstack/react-query";

import { getTeamMembers } from "../api/members";
import type { TeamMember } from "../types/team.model";

export function useTeamMembers(teamId: number | null) {
  const isEnabled = typeof teamId === "number" && teamId > 0;

  return useQuery<TeamMember[]>({
    queryKey: ["teams", teamId, "members"],
    queryFn: () => getTeamMembers(teamId as number),
    enabled: isEnabled,
  });
}
