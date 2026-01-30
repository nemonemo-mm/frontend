import { apiClient } from "@/shared/utils/http";

export async function teamDisband(teamId: number) {
  await apiClient.delete("/teams/" + teamId);
}
