import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createNotice as createN,
  deleteNotice as deleteN,
  getNotice as getN,
  updateNotice as updateN,
} from "../api/notice";
import type { NoticeRequest, NoticeResponse } from "../types/notice.model";

export function useLatestNotice(teamId: number | null) {
  const queryKey = ["teams", teamId ?? "unknown", "notice", "latest"];
  const enabled = typeof teamId === "number" && teamId > 0;

  return useQuery<NoticeResponse>({
    queryKey,
    queryFn: () => getN(teamId as number),
    enabled,
  });
}

type CreateNoticePayload = {
  teamId: number;
  body: NoticeRequest;
};

type UpdateNoticePayload = {
  teamId: number;
  noticeId: number;
  body: NoticeRequest;
};

type DeleteNoticePayload = {
  teamId?: number | null;
  noticeId: number;
};

function invalidateNoticeQueries(
  queryClient: QueryClient,
  teamId?: number | null
) {
  if (typeof teamId === "number" && teamId > 0) {
    queryClient.invalidateQueries({
      queryKey: ["teams", teamId, "notice"],
      exact: false,
    });
  } else {
    queryClient.invalidateQueries({
      queryKey: ["teams"],
      exact: false,
    });
  }
}

export function useNoticeMutations() {
  const queryClient = useQueryClient();

  const createNotice = useMutation({
    mutationFn: (payload: CreateNoticePayload) =>
      createN(payload.teamId, payload.body),
    onSuccess: (_, variables) => {
      invalidateNoticeQueries(queryClient, variables.teamId);
    },
  });

  const updateNotice = useMutation({
    mutationFn: (payload: UpdateNoticePayload) =>
      updateN(payload.teamId, payload.noticeId, payload.body),
    onSuccess: (_, variables) => {
      invalidateNoticeQueries(queryClient, variables.teamId);
    },
  });

  const deleteNotice = useMutation({
    mutationFn: (payload: DeleteNoticePayload) =>
      deleteN(payload.teamId as number, payload.noticeId),
    onSuccess: (_, variables) => {
      invalidateNoticeQueries(queryClient, variables.teamId);
    },
  });

  return { createNotice, updateNotice, deleteNotice };
}
