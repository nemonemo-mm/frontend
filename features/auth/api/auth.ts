import type {
  SocialLoginRequest,
  SocialLoginResponse,
} from "@/features/auth/types/auth.model";
import { apiClient } from "@/shared/utils/http";

export async function socialLogin(
  body: SocialLoginRequest
): Promise<SocialLoginResponse> {
  const { data } = await apiClient.post<SocialLoginResponse>(
    "/auth/social/login",
    body
  );

  return data;
}
