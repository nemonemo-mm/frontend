import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  changeMemberPosition,
  getTeamMembers,
} from "../api/members";
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

type ChangeMemberPositionPayload = {
  teamId: number;
  memberId: number;
  positionId: number;
};

export function useTeamMembersMutations() {
  const queryClient = useQueryClient();

  const changePosition = useMutation({
    mutationFn: (payload: ChangeMemberPositionPayload) =>
      changeMemberPosition(payload.teamId, payload.memberId, {
        positionId: payload.positionId,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teams", variables.teamId, "members"],
        exact: true,
      });
    },
  });

  return {
    changePosition,
  };
}
