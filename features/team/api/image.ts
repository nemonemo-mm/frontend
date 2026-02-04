import { apiClient } from "@/shared/utils/http";
import { ImagePickerAsset } from "expo-image-picker";

export async function uploadTeamImage(teamId: number, body: ImagePickerAsset) {
  const formData = new FormData();

  formData.append("image", {
    uri: body.uri,
    name: body.fileName ?? "profile.jpg",
    type: "image/jpeg", // 여기 중요
  } as any);

  const { data } = await apiClient.post(`/images/teams/${teamId}`, {
    formData,
  });
  return data;
}
