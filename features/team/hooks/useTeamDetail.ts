import { useQuery } from "@tanstack/react-query";
import { teamDetailInfo } from "../api/detail";

export const useTeamDetail = (teamId: number | null) => {
  return useQuery({
    queryKey: ["teamDetail", teamId],
    queryFn: () => teamDetailInfo(teamId!),
    enabled: !!teamId,
  });
};
