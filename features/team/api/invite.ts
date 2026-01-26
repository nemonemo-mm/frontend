import { apiClient } from "@/shared/utils/http";

export async function getTeamByInviteCode(inviteCode: string) {
  return apiClient.get(`teams/invite/${inviteCode}`);
}
