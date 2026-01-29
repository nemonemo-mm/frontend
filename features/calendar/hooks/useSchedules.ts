import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addSchedule,
  changeSchedule,
  deleteSchedule as deleteScheduleRequest,
  getMySchedule,
  getTeamSchedule,
} from "../api/schedule";
import type {
  ScheduleRequest,
  SchedulesResponse,
} from "../types/schedule.model";

export type ScheduleQueryParams = {
  start: string;
  end: string;
};

const hasValidRange = (params: ScheduleQueryParams) =>
  Boolean(params.start && params.end);

export function useTeamSchedules(
  teamId: number | null,
  params: ScheduleQueryParams
) {
  const queryKey = [
    "teams",
    teamId ?? "unknown",
    "schedules",
    params.start,
    params.end,
  ];
  const enabled =
    typeof teamId === "number" && teamId > 0 && hasValidRange(params);

  return useQuery<SchedulesResponse[]>({
    queryKey,
    queryFn: () => getTeamSchedule(teamId as number, params),
    enabled,
  });
}

export function useMySchedules(params: ScheduleQueryParams) {
  const queryKey = ["me", "schedules", params.start, params.end];
  const enabled = hasValidRange(params);

  return useQuery<SchedulesResponse[]>({
    queryKey,
    queryFn: () => getMySchedule(params),
    enabled,
  });
}

type UpdateSchedulePayload = {
  scheduleId: number;
  body: ScheduleRequest;
};

type DeleteSchedulePayload = {
  scheduleId: number;
  teamId?: number | null;
};

function invalidateScheduleQueries(
  queryClient: QueryClient,
  teamId?: number | null
) {
  if (typeof teamId === "number" && teamId > 0) {
    queryClient.invalidateQueries({
      queryKey: ["teams", teamId, "schedules"],
      exact: false,
    });
  } else {
    queryClient.invalidateQueries({
      queryKey: ["teams"],
      exact: false,
    });
  }

  queryClient.invalidateQueries({
    queryKey: ["me", "schedules"],
    exact: false,
  });
}

export function useScheduleMutations() {
  const queryClient = useQueryClient();

  const createSchedule = useMutation({
    mutationFn: (body: ScheduleRequest) => addSchedule(body),
    onSuccess: (_, variables) => {
      invalidateScheduleQueries(queryClient, variables.teamId);
    },
  });

  const updateSchedule = useMutation({
    mutationFn: (payload: UpdateSchedulePayload) =>
      changeSchedule(payload.scheduleId, payload.body),
    onSuccess: (_, variables) => {
      invalidateScheduleQueries(queryClient, variables.body.teamId);
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (payload: DeleteSchedulePayload) =>
      deleteScheduleRequest(payload.scheduleId),
    onSuccess: (_, variables) => {
      invalidateScheduleQueries(queryClient, variables.teamId);
    },
  });

  return {
    createSchedule,
    updateSchedule,
    deleteSchedule: deleteScheduleMutation,
  };
}
