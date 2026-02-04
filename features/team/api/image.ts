import { apiClient } from "@/shared/utils/http";
import { getMimeType } from "../utils/getMimeType";

export async function uploadTeamImage(teamId: number, imageUri: string) {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: `team-${teamId}.${imageUri.split(".").pop() ?? "jpg"}`,
    type: getMimeType(imageUri),
  } as unknown as Blob);

  const { data } = await apiClient.post(`/images/teams/${teamId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
