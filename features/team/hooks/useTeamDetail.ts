import { useQuery } from "@tanstack/react-query";
import { teamDetailInfo } from "../api/detail";

const TEAM_DETAIL_QUERY_STALE_TIME = 1000 * 60 * 5;

export const useTeamDetail = (teamId: number | null) => {
  return useQuery({
    queryKey: ["teamDetail", teamId],
    queryFn: () => teamDetailInfo(teamId!),
    enabled: !!teamId,
    staleTime: TEAM_DETAIL_QUERY_STALE_TIME,
  });
};
