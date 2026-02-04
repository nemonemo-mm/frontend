import { getMimeType } from "@/features/team/utils/getMimeType";
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
  imageUri: string
): Promise<UserProfileResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: `${imageUri}`,
    type: getMimeType(imageUri),
  } as unknown as Blob);

  const { data } = await apiClient.post("/images/users/me/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
