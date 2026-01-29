import { apiClient } from "@/shared/utils/http";
import { TemaList } from "../types/team.model";

export async function teamListUp(): Promise<TemaList[]> {
  const { data } = await apiClient.get("/teams");
  return data;
}
