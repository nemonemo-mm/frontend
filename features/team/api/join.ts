import { apiClient } from "@/shared/utils/http";

interface TeamJoinRequest {
  inviteCode: string;
  positionId: number;
}

export async function teamJoin(body: TeamJoinRequest) {
  const { data } = await apiClient.post("/teams/join", body);
  return data;
}
