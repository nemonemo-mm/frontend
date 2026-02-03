import { apiClient } from "@/shared/utils/http";
import { UserResponse } from "../types/user.model";

export async function getMe(): Promise<UserResponse> {
  const { data } = await apiClient.get<UserResponse>("/users/me");
  return data;
}
