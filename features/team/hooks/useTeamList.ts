import { useQuery } from "@tanstack/react-query";
import { teamListUp } from "../api/list";

const TEAM_LIST_QUERY_STALE_TIME = 1000 * 60 * 5;

export const useTeamList = (teamId: string) => {
  return useQuery({
    queryKey: ["teamList", teamId],
    queryFn: teamListUp,
    staleTime: TEAM_LIST_QUERY_STALE_TIME,
  });
};
