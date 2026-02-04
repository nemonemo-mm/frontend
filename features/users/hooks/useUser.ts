import { useQuery } from "@tanstack/react-query";

import { getMe } from "../api/user";
import type { UserResponse } from "../types/user.model";

export function useUser() {
  return useQuery<UserResponse>({
    queryKey: ["me", "user"],
    queryFn: getMe,
  });
}
