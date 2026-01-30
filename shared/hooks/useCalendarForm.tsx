import { SchedulesResponse } from "@/features/calendar/types/schedule.model";
import { TodoResponse } from "@/features/calendar/types/todo.model";
import { PositionChip } from "@/features/position/hooks/usePositions";
import { createContext } from "react";
import { ChipText } from "../ui/molecules/Chips";
import { AlarmState } from "../ui/templates/AlarmModal";
import { RepeatState } from "../ui/templates/RepeatModal";

export interface InitialCalendarState {
  id?: number;
  isAllDay: boolean;
  start: Date;
  end: Date;
  person: ChipText[];
  position: PositionChip[];
  repeat: RepeatState | null;
  alarm: AlarmState | null;

  title: string;
  description: string;
  url: string;
}
// CalendarFormContext.ts
export const CalendarFormContext = createContext<{
  readonly?: boolean;
  state: InitialCalendarState;
  dispatch: React.Dispatch<any>;
} | null>(null);

export const createInitialState = ({
  data,
  type,
  positions,
  selectedDate,
}: {
  data: SchedulesResponse | TodoResponse | undefined;
  type: "schedule" | "todo";
  positions: PositionChip[];
  selectedDate: Date;
}): InitialCalendarState => {
  // 기본값
  const base: InitialCalendarState = {
    isAllDay: false,
    start: selectedDate,
    end: selectedDate,
    person: [],
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

    return {
      ...base,
      isAllDay: s.isAllDay ?? false,
      start: new Date(s.startAt),
      end: new Date(s.endAt),
      title: s.title ?? "",
      description: s.description ?? "",
      url: s.url ?? "",
    };
  }

  // todo 편집
  const t = data as TodoResponse;

  return {
    ...base,
    end: new Date(t.endAt),
    title: t.title ?? "",
    description: t.description ?? "",
  };
};
