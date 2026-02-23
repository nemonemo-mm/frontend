import {
  QueryClient,
  QueryKey,
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
import { WeekDayType } from "@/shared/ui/molecules/NemoDayButton";
import { RepeatPeriod } from "@/shared/ui/templates/RepeatModal";

export type ScheduleQueryParams = {
  start: string;
  end: string;
};

const hasValidRange = (params: ScheduleQueryParams) =>
  Boolean(params.start && params.end);

const WEEKDAY_OFFSET: Record<WeekDayType, number> = {
  월: 0,
  화: 1,
  수: 2,
  목: 3,
  금: 4,
  토: 5,
  일: 6,
};

const OCCURRENCE_OFFSET = 100_000;

const addDays = (date: Date, days: number) => {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + days);
  return clone;
};

const addMonths = (date: Date, months: number) => {
  const clone = new Date(date);
  clone.setMonth(clone.getMonth() + months);
  return clone;
};

const addYears = (date: Date, years: number) => {
  const clone = new Date(date);
  clone.setFullYear(clone.getFullYear() + years);
  return clone;
};

const startOfWeek = (date: Date) => {
  const clone = new Date(date);
  const offset = (clone.getDay() + 6) % 7;
  clone.setDate(clone.getDate() - offset);
  return clone;
};

const createOccurrenceId = (baseId: number, index: number) =>
  baseId * OCCURRENCE_OFFSET + index;

const cloneWithScheduleTimes = (
  schedule: SchedulesResponse,
  start: Date,
  durationMs: number,
  index: number
) => {
  const occurrenceStart = new Date(start);
  const occurrenceEnd = new Date(start.getTime() + durationMs);

  return {
    ...schedule,
    id: createOccurrenceId(schedule.id, index),
    parentScheduleId: schedule.id,
    startAt: occurrenceStart.toISOString(),
    endAt: occurrenceEnd.toISOString(),
  };
};

const shouldIncludeOccurrence = (
  candidate: Date,
  paramsStart: Date,
  paramsEnd: Date,
  repeatEnd: Date,
  baseStart: Date
) =>
  candidate > baseStart &&
  candidate >= paramsStart &&
  candidate <= paramsEnd &&
  candidate <= repeatEnd;

const isScheduleOverlappingRange = (
  schedule: SchedulesResponse,
  paramsStart: Date,
  paramsEnd: Date
) => {
  const scheduleStart = new Date(schedule.startAt);
  const scheduleEnd = new Date(schedule.endAt);
  return scheduleStart <= paramsEnd && scheduleEnd >= paramsStart;
};

const generateRepeatOccurrences = (
  schedule: SchedulesResponse,
  params: ScheduleQueryParams
) => {
  const normalizedType = (schedule.repeatType ?? "NONE").toUpperCase();
  if (!schedule.repeatEndDate || normalizedType === "NONE") return [];
  const repeatType = normalizedType as RepeatPeriod;

  const repeatEndDate = new Date(schedule.repeatEndDate);
  const queryStart = new Date(params.start);
  const queryEnd = new Date(params.end);
  const baseStart = new Date(schedule.startAt);
  const duration = new Date(schedule.endAt).getTime() - baseStart.getTime();

  const occurrences: SchedulesResponse[] = [];
  let occurrenceIndex = 1;

  const addOccurrence = (candidate: Date) => {
    if (
      shouldIncludeOccurrence(
        candidate,
        queryStart,
        queryEnd,
        repeatEndDate,
        baseStart
      )
    ) {
      occurrences.push(
        cloneWithScheduleTimes(schedule, candidate, duration, occurrenceIndex++)
      );
    }
  };

  switch (repeatType) {
    case RepeatPeriod.DAILY: {
      const interval = Math.max(schedule.repeatInterval ?? 1, 1);
      let next = addDays(baseStart, interval);
      while (next <= repeatEndDate && next <= queryEnd) {
        addOccurrence(next);
        next = addDays(next, interval);
      }
      break;
    }
    case RepeatPeriod.WEEKLY: {
      const interval = Math.max(schedule.repeatInterval ?? 1, 1);
      const weekdays =
        schedule.repeatWeekDays
          ?.map((weekday) => WEEKDAY_OFFSET[weekday])
          .sort((a, b) => a - b) ?? [];

      if (!weekdays.length) break;

      let weekStart = startOfWeek(baseStart);
      while (weekStart <= repeatEndDate && weekStart <= queryEnd) {
        for (const offset of weekdays) {
          const candidate = addDays(weekStart, offset);
          candidate.setHours(
            baseStart.getHours(),
            baseStart.getMinutes(),
            baseStart.getSeconds(),
            baseStart.getMilliseconds()
          );
          addOccurrence(candidate);
        }
        weekStart = addDays(weekStart, interval * 7);
      }
      break;
    }
    case RepeatPeriod.MONTHLY: {
      let next = addMonths(baseStart, 1);
      while (next <= repeatEndDate && next <= queryEnd) {
        addOccurrence(next);
        next = addMonths(next, 1);
      }
      break;
    }
    case RepeatPeriod.YEARLY: {
      let next = addYears(baseStart, 1);
      while (next <= repeatEndDate && next <= queryEnd) {
        addOccurrence(next);
        next = addYears(next, 1);
      }
      break;
    }
    default:
      break;
  }

  return occurrences;
};

const expandSchedulesWithRepeats = (
  schedules: SchedulesResponse[],
  params: ScheduleQueryParams
) => {
  const queryStart = new Date(params.start);
  const queryEnd = new Date(params.end);

  return schedules
    .flatMap((schedule) => {
      const normalizedType = (schedule.repeatType ?? "NONE").toUpperCase();
      if (normalizedType === "NONE" || !schedule.repeatEndDate) {
        return [schedule];
      }

      return generateRepeatOccurrences(schedule, params);
    })
    .filter((schedule) =>
      isScheduleOverlappingRange(schedule, queryStart, queryEnd)
    )
    .sort(
      (a, b) =>
        new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );
};

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
    select: (data) => expandSchedulesWithRepeats(data, params),
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

type ScheduleCacheSnapshot = Array<[QueryKey, SchedulesResponse[] | undefined]>;

const snapshotScheduleCaches = (queryClient: QueryClient) => ({
  team: queryClient.getQueriesData<SchedulesResponse[]>({
    queryKey: ["teams"],
    exact: false,
    predicate: (query) => query.queryKey.includes("schedules"),
  }),
  me: queryClient.getQueriesData<SchedulesResponse[]>({
    queryKey: ["me", "schedules"],
    exact: false,
  }),
});

const restoreScheduleCaches = (
  queryClient: QueryClient,
  snapshot?: { team: ScheduleCacheSnapshot; me: ScheduleCacheSnapshot }
) => {
  if (!snapshot) return;

  [...snapshot.team, ...snapshot.me].forEach(([key, data]) => {
    queryClient.setQueryData(key, data);
  });
};

const patchScheduleInCache = (
  data: SchedulesResponse[] | undefined,
  scheduleId: number,
  body: ScheduleRequest
) => {
  if (!data) return data;

  return data.map((schedule) =>
    schedule.id === scheduleId || schedule.parentScheduleId === scheduleId
      ? {
          ...schedule,
          title: body.title,
          description: body.description,
          startAt: body.startAt,
          endAt: body.endAt,
          isAllDay: body.isAllDay,
          place: body.place,
          url: body.url,
          repeatType: body.repeatType,
          repeatInterval: body.repeatInterval,
          repeatWeekDays: body.repeatWeekDays,
          repeatUseDate: body.repeatUseDate,
          repeatEndDate: body.repeatEndDate,
          positionIds: body.positionIds,
          attendeeMemberIds: body.attendeeMemberIds,
          notificationMinutes: body.notificationMinutes,
        }
      : schedule
  );
};

const removeScheduleFromCache = (
  data: SchedulesResponse[] | undefined,
  scheduleId: number
) => {
  if (!data) return data;
  return data.filter(
    (schedule) =>
      schedule.id !== scheduleId && schedule.parentScheduleId !== scheduleId
  );
};

const optimisticallyUpdateScheduleCaches = (
  queryClient: QueryClient,
  scheduleId: number,
  body: ScheduleRequest
) => {
  queryClient.setQueriesData<SchedulesResponse[]>(
    {
      queryKey: ["teams"],
      exact: false,
      predicate: (query) => query.queryKey.includes("schedules"),
    },
    (old) => patchScheduleInCache(old, scheduleId, body)
  );

  queryClient.setQueriesData<SchedulesResponse[]>(
    { queryKey: ["me", "schedules"], exact: false },
    (old) => patchScheduleInCache(old, scheduleId, body)
  );
};

const optimisticallyDeleteScheduleCaches = (
  queryClient: QueryClient,
  scheduleId: number
) => {
  queryClient.setQueriesData<SchedulesResponse[]>(
    {
      queryKey: ["teams"],
      exact: false,
      predicate: (query) => query.queryKey.includes("schedules"),
    },
    (old) => removeScheduleFromCache(old, scheduleId)
  );

  queryClient.setQueriesData<SchedulesResponse[]>(
    { queryKey: ["me", "schedules"], exact: false },
    (old) => removeScheduleFromCache(old, scheduleId)
  );
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
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["teams"],
        exact: false,
        predicate: (query) => query.queryKey.includes("schedules"),
      });
      await queryClient.cancelQueries({
        queryKey: ["me", "schedules"],
        exact: false,
      });

      const snapshot = snapshotScheduleCaches(queryClient);
      optimisticallyUpdateScheduleCaches(
        queryClient,
        variables.scheduleId,
        variables.body
      );
      return { snapshot };
    },
    onError: (_, __, context) => {
      restoreScheduleCaches(queryClient, context?.snapshot);
    },
    onSettled: (_, __, variables) => {
      invalidateScheduleQueries(queryClient, variables.body.teamId);
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (payload: DeleteSchedulePayload) =>
      deleteScheduleRequest(payload.scheduleId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["teams"],
        exact: false,
        predicate: (query) => query.queryKey.includes("schedules"),
      });
      await queryClient.cancelQueries({
        queryKey: ["me", "schedules"],
        exact: false,
      });

      const snapshot = snapshotScheduleCaches(queryClient);
      optimisticallyDeleteScheduleCaches(queryClient, variables.scheduleId);
      return { snapshot };
    },
    onError: (_, __, context) => {
      restoreScheduleCaches(queryClient, context?.snapshot);
    },
    onSettled: (_, __, variables) => {
      invalidateScheduleQueries(queryClient, variables.teamId);
    },
  });

  return {
    createSchedule,
    updateSchedule,
    deleteSchedule: deleteScheduleMutation,
  };
}
