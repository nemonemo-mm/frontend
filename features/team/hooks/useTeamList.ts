import { useQuery } from "@tanstack/react-query";
import { teamListUp } from "../api/list";

export const useTeamList = () => {
  return useQuery({
    queryKey: ["teamList"],
    queryFn: teamListUp,
  });
};
