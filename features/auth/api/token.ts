import type { RefreshTokenResponse } from "@/features/auth/types/auth.model";
import { apiClient } from "@/shared/utils/http";

export async function requestRefreshToken(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  const { data } = await apiClient.post<RefreshTokenResponse>(
    "/auth/refresh",
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );
  return data;
}
