import { apiClient } from "@/shared/utils/http";
import type { TeamList } from "../types/team.model";

export async function teamListUp(): Promise<TeamList[]> {
  const { data } = await apiClient.get("/teams");
  return data;
}
