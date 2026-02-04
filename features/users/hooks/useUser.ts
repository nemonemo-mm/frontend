import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { changeMyName, changeMyProfileImage, getMe } from "../api/user";
import type { UserResponse } from "../types/user.model";

export function useUser() {
  return useQuery<UserResponse>({
    queryKey: ["me", "user"],
    queryFn: getMe,
  });
}

type ChangeNamePayload = string;

type ChangeProfileImagePayload = string;

function invalidateUserCache(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: ["me", "user"],
    exact: true,
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();

  const updateName = useMutation({
    mutationFn: (payload: ChangeNamePayload) => changeMyName(payload),
    onSuccess: () => {
      invalidateUserCache(queryClient);
    },
  });

  const updateProfileImage = useMutation({
    mutationFn: (payload: ChangeProfileImagePayload) =>
      changeMyProfileImage(payload),
    onSuccess: () => {
      invalidateUserCache(queryClient);
    },
  });

  return {
    updateName,
    updateProfileImage,
  };
}
