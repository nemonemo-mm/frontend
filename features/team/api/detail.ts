import { apiClient } from "@/shared/utils/http";
import { TeamDetail } from "../types/team.model";

export async function teamDetailInfo(id: number): Promise<TeamDetail> {
  const { data } = await apiClient.get("/teams/" + id);
  return data;
}
