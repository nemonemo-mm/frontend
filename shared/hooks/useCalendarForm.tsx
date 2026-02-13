import { SchedulesResponse } from "@/features/calendar/types/schedule.model";
import { TodoResponse } from "@/features/calendar/types/todo.model";
import { PositionChip } from "@/features/position/hooks/usePositions";
import { MemberChip } from "@/features/team/hooks/useTeamMembers";
import { createContext } from "react";
import { WeekDayType } from "../ui/molecules/NemoDayButton";
import { AlarmState } from "../ui/templates/AlarmModal";
import { RepeatPeriod, RepeatState } from "../ui/templates/RepeatModal";

export interface InitialCalendarState {
  teamId: number;
  id?: number;
  isAllDay: boolean;
  start: Date;
  end: Date;
  person: MemberChip[];
  position: PositionChip[];
  repeat: RepeatState | null;
  alarm: AlarmState | null;

  title: string;
  description: string;
  url: string;
}
// CalendarFormContext.ts
export const CalendarFormContext = createContext<{
  teamId: number | null;
  readonly?: boolean;
  state: InitialCalendarState;
  dispatch: React.Dispatch<any>;
} | null>(null);

export const createInitialState = ({
  teamId,
  data,
  type,
  persons,
  positions,
  selectedDate,
}: {
  teamId: number;
  data?: SchedulesResponse | TodoResponse;
  type: "schedule" | "todo";
  persons: MemberChip[];
  positions: PositionChip[];
  selectedDate: Date;
}): InitialCalendarState => {
  // 기본값
  const base: InitialCalendarState = {
    teamId: teamId,
    isAllDay: false,
    start: selectedDate,
    end: selectedDate,
    person: persons,
    position: positions,
    repeat: null,
    alarm: null,
    title: "",
    description: "",
    url: "",
  };
  if (!data) return base;
  // schedule 편집
  if (type === "schedule") {
    const s = data as SchedulesResponse;
    const person = persons
      .filter((per) => (s.attendeeMemberIds ?? []).includes(per.memberId))
      .map((per) => ({ ...per, isActive: true }));

    const position = positions
      .filter((pos) => data.positionIds.includes(pos.positionId))
      .map((pos) => ({ ...pos, isActive: true }));
    const {
      repeatType,
      repeatEndDate,
      repeatInterval,
      repeatUseDate,
      repeatWeekDays,
      notificationMinutes,
    } = s;
    const repeat: RepeatState | null = createRepeatState({
      repeatType,
      repeatEndDate,
      repeatInterval,
      repeatUseDate,
      repeatWeekDays,
    });

    const alarm: AlarmState | null = createAlarmState(notificationMinutes);

    return {
      ...base,
      teamId: data.teamId,
      id: data.id,
      person,
      position,
      isAllDay: s.isAllDay ?? false,
      start: new Date(s.startAt),
      end: new Date(s.endAt),
      title: s.title ?? "",
      description: s.description ?? "",
      url: s.url ?? "",
      repeat,
      alarm,
    };
  }

  // todo 편집
  const t = data as TodoResponse;
  const person = persons.map((per) => ({
    ...per,
    isActive:
      "assignees" in data && data.assignees
        ? data.assignees.some((assignee) => assignee.memberId === per.memberId)
        : false,
  }));

  const position = positions.map((pos) => ({
    ...pos,
    isActive: data.positionIds.includes(pos.positionId),
  }));

  return {
    ...base,
    teamId: data.teamId,
    id: data.id,
    person,
    position,
    end: new Date(t.endAt),
    title: t.title ?? "",
    description: t.description ?? "",
  };
};

function createRepeatState(params: {
  repeatType: string | null;
  repeatEndDate: string | null;
  repeatInterval?: number | null;
  repeatWeekDays?: WeekDayType[] | null;
  repeatUseDate?: boolean | null;
}): RepeatState | null {
  const {
    repeatType,
    repeatEndDate,
    repeatInterval,
    repeatWeekDays,
    repeatUseDate,
  } = params;

  const normalizedType = repeatType?.toUpperCase() ?? "";
  if (!normalizedType || normalizedType === "NONE") return null;
  if (!repeatEndDate) return null;
  const endAt = new Date(repeatEndDate);

  switch (normalizedType) {
    case RepeatPeriod.DAILY:
      return {
        period: RepeatPeriod.DAILY,
        interval: repeatInterval ?? 1,
        endAt,
      };

    case RepeatPeriod.WEEKLY:
      return {
        period: RepeatPeriod.WEEKLY,
        interval: repeatInterval ?? 1,
        weekdays: repeatWeekDays ?? [],
        endAt,
      };

    case RepeatPeriod.MONTHLY:
      return {
        period: RepeatPeriod.MONTHLY,
        useDate: repeatUseDate ?? false,
        endAt,
      };

    case RepeatPeriod.YEARLY:
      return {
        period: RepeatPeriod.YEARLY,
        useDate: repeatUseDate ?? false,
        endAt,
      };

    default:
      return null;
  }
}

function createAlarmState(alarm: number[] | null): AlarmState {
  if (!alarm) {
    return {
      10: false,
      30: false,
      60: false,
    };
  }
  return {
    10: alarm.includes(10),
    30: alarm.includes(30),
    60: alarm.includes(60),
  };
}
