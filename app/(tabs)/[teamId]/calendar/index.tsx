import { useScheduleMutations } from "@/features/calendar/hooks/useSchedules";
import { useTodoMutations } from "@/features/calendar/hooks/useTodos";
import { ScheduleRequest } from "@/features/calendar/types/schedule.model";
import { TodoRequest } from "@/features/calendar/types/todo.model";
import {
  PositionChip,
  usePositions,
} from "@/features/position/hooks/usePositions";
import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import Chips from "@/shared/ui/molecules/Chips";
import { WeekDayType } from "@/shared/ui/molecules/NemoDayButton";
import { TabsText } from "@/shared/ui/molecules/Tabs";
import Calendar from "@/shared/ui/organisms/Calendar";
import CalendarModal, {
  formatAlarm,
  InitialState,
} from "@/shared/ui/templates/CalendarModal";
import ScheduleListModal from "@/shared/ui/templates/ScheduleListModal";
import { convertDateAndTimeToString } from "@/shared/utils/convertDateAndTimeToString";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

interface CalendarScreenProps {}

const convertPositions = (
  positions: PositionChip[] | undefined
): TabsText[] => {
  if (!positions) return [];
  return positions.map((pos, index) => ({
    id: pos.positionId ?? index,
    content: pos.positionName ?? "",
    isActive: false,
  }));
};
const CalendarScreen = ({}: CalendarScreenProps) => {
  const { teamId: id } = useLocalSearchParams();
  const teamId = parseInt(id as string);
  const { createSchedule } = useScheduleMutations();

  const { createTodo } = useTodoMutations();

  const positionsQuery = usePositions(teamId);

  const [currentPosition, setCurrentPositions] = useState<TabsText[]>([]);
  useEffect(() => {
    if (positionsQuery.data) {
      setCurrentPositions(convertPositions(positionsQuery.data));
    }
  }, [positionsQuery.data]);

  const calendarContext = useContext(CalendarContext);

  if (!calendarContext) {
    throw new Error("CalendarContext is undefined. Ensure it is provided.");
  }

  const {
    currentYearMonth,
    selectedDate,
    selectDate,
    days,
    schedules,
    callSchedules,
    todos,
    callTodos,
    goPrevMonth,
    goNextMonth,
  } = calendarContext;
  const [isOpenAddScheduleModal, setIsOpenAddScheduleModal] = useState(false);
  const [isOpenListModal, setIsOpenListModal] = useState(false);

  const handleCalendarMonth = (direction: -1 | 1) => {
    if (direction == -1) goPrevMonth();
    else goNextMonth();
  };
  const handleAddSchedule = () => {
    setIsOpenAddScheduleModal(true);
  };

  const handleConfirmModal = (data: { id: string; state: InitialState }) => {
    const status = data.id == "schedule" ? "SCHEDULE" : "TODO";
    const {
      title,
      description,
      url,
      startAt,
      startAtTime,
      endAt,
      endAtTime,
      person,
      position,
      repeat,
      alarm,
      isAllDay,
    } = data.state;
    const start = convertDateAndTimeToString(startAt, startAtTime);
    const end = convertDateAndTimeToString(endAt, endAtTime);
    const positionIds = position
      .filter((pos) => pos.isActive)
      .map((pos) => pos.id);
    const attendeeMemberIds = person
      .filter((per) => per.isActive)
      .map((per) => per.id);
    const repeatType = repeat?.period ?? "NONE";
    let repeatEndDate = null;
    let repeatInterval: number | null = null;
    let repeatWeekDays: WeekDayType[] | null = null;
    let repeatUseDate: boolean = false;
    if (repeat) {
      repeatEndDate = repeat.endAt.toISOString();
      if (repeat.period == "daily") {
        repeatInterval = repeat.interval;
      }
      if (repeat.period == "weekly") {
        repeatInterval = repeat.interval;
        repeatWeekDays = repeat.weekdays;
      }
      if (repeat.period == "monthly" || repeat.period == "yearly") {
        repeatUseDate = repeat.useDate;
      }
    }

    const alarmLabel: string = formatAlarm(alarm);

    if (status == "SCHEDULE") {
      const req = {
        teamId,
        title,
        description,
        startAt: start,
        endAt: end,
        isAllDay,
        place: "",
        url,
        repeatType,
        repeatInterval,
        repeatWeekDays,
        repeatUseDate,
        repeatEndDate,
        positionIds,
        attendeeMemberIds,
        alarm: alarmLabel,
      } as ScheduleRequest;

      createSchedule.mutate(req, {
        onSuccess: () => {
          callSchedules();
        },
      });
    } else {
      const req = {
        teamId,
        title,
        description,
        endAt: end,
        place: "",
        url,
        assigneeMemberIds: attendeeMemberIds,
        positionIds,
      } as TodoRequest;
      createTodo.mutate(req, {
        onSuccess: () => {
          callTodos();
        },
      });
    }
  };
  const handlePositionChips = (next: TabsText[]) => {
    setCurrentPositions(next);
  };
  const handleSelectDate = (date: Date) => {
    selectDate(date);
    setIsOpenListModal(true);
  };

  return (
    <View>
      <View>
        <Chips texts={currentPosition} handler={handlePositionChips} />
        <Calendar
          year={currentYearMonth.year}
          month={currentYearMonth.month + 1}
          days={days}
          schedules={[...schedules, ...todos]}
          onCalendarMonth={handleCalendarMonth}
          onAddSchedule={handleAddSchedule}
          onSelectDate={handleSelectDate}
        />
        {isOpenListModal && (
          <ScheduleListModal
            positions={currentPosition}
            selectedDate={selectedDate}
            closeModal={() => setIsOpenListModal(false)}
            confirmModal={handleSelectDate}
          />
        )}
        {isOpenAddScheduleModal && (
          <CalendarModal
            selectedDate={selectedDate}
            positions={currentPosition}
            confirmModal={handleConfirmModal}
            closeModal={() => {
              setIsOpenAddScheduleModal(false);
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  layout: {
    alignItems: "center",
    justifyContent: "center",
  },
  noticeInput: {
    position: "relative",
    marginBottom: 24,
  },
});

export default CalendarScreen;
