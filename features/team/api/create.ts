import { apiClient } from "@/shared/utils/http";
import { TeamCreateRequest } from "../types/team.model";

export async function teamCreate(body: TeamCreateRequest) {
  const { data } = await apiClient.post("/teams", body);
  return data;
}
