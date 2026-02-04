import { apiClient } from "@/shared/utils/http";
import { ImagePickerAsset } from "expo-image-picker";
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
  body: ImagePickerAsset
): Promise<UserProfileResponse> {
  const formData = new FormData();

  formData.append("image", {
    uri: body.uri,
    name: body.fileName ?? "profile.jpg",
    type: "image/jpeg", // 여기 중요
  } as any);

  const { data } = await apiClient.post("/images/users/me/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
