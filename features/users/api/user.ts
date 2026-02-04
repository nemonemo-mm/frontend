import { apiClient } from "@/shared/utils/http";
import { UserProfileResponse, UserResponse } from "../types/user.model";

export async function getMe(): Promise<UserResponse> {
  const { data } = await apiClient.get<UserResponse>("/users/me");
  return data;
}

export async function changeMyName(userName: string): Promise<UserResponse> {
  const { data } = await apiClient.put("/users/me", { userName });
  return data;
}

export async function changeMyProfileImage(
  body: File
): Promise<UserProfileResponse> {
  const { data } = await apiClient.post("/images/users/me/profile", body);
  return data;
}
