import type { SocialLoginRequest } from "@/features/auth/types/auth.model";
import * as SecureStore from "expo-secure-store";

const PENDING_SOCIAL_LOGIN_KEY = "pending_social_login";

/**
 * 소셜 로그인 과정에서 수집된 임시 데이터를 저장합니다.
 * 여러 화면을 거치며 단계별로 데이터를 수집하고,
 * 최종적으로 socialLogin API 호출 시 사용됩니다.
 */

/**
 * 저장된 pending 소셜 로그인 데이터를 가져옵니다.
 * @returns 저장된 데이터 또는 null
 */
export async function getPendingSocialLogin(): Promise<SocialLoginRequest | null> {
  try {
    const data = await SecureStore.getItemAsync(PENDING_SOCIAL_LOGIN_KEY);
    if (!data) return null;

    return JSON.parse(data) as SocialLoginRequest;
  } catch (error) {
    console.error("pendingSocialLogin 조회 실패:", error);
    return null;
  }
}

/**
 * pending 소셜 로그인 데이터를 부분적으로 업데이트합니다.
 * 기존 데이터와 병합하여 저장합니다.
 * @param partialData 업데이트할 부분 데이터
 */
export async function patchPendingSocialLogin(
  partialData: Partial<SocialLoginRequest>
): Promise<void> {
  try {
    const existing = await getPendingSocialLogin();
    const updated: SocialLoginRequest = {
      ...existing,
      ...partialData,
    } as SocialLoginRequest;

    await SecureStore.setItemAsync(
      PENDING_SOCIAL_LOGIN_KEY,
      JSON.stringify(updated)
    );
  } catch (error) {
    console.error("pendingSocialLogin 업데이트 실패:", error);
    throw error;
  }
}

/**
 * 저장된 pending 소셜 로그인 데이터를 삭제합니다.
 * 로그인 완료 후 호출됩니다.
 */
export async function clearPendingSocialLogin(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(PENDING_SOCIAL_LOGIN_KEY);
  } catch (error) {
    console.error("pendingSocialLogin 삭제 실패:", error);
    // 삭제 실패는 치명적이지 않으므로 에러를 던지지 않음
  }
}

/**
 * pending 소셜 로그인 데이터를 처음부터 설정합니다.
 * @param data 설정할 전체 데이터
 */
export async function setPendingSocialLogin(
  data: SocialLoginRequest
): Promise<void> {
  try {
    await SecureStore.setItemAsync(
      PENDING_SOCIAL_LOGIN_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("pendingSocialLogin 설정 실패:", error);
    throw error;
  }
}
