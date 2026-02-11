import { apiClient } from "@/shared/utils/http";
import { TeamCreateRequest, TeamCreateResponse } from "../types/team.model";

export async function teamCreate(body: TeamCreateRequest) {
  const { data } = await apiClient.post<TeamCreateResponse>("/teams", body);
  return data;
}
