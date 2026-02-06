import { useScheduleMutations } from "@/features/calendar/hooks/useSchedules";
import { useTodoMutations } from "@/features/calendar/hooks/useTodos";
import { ScheduleRequest } from "@/features/calendar/types/schedule.model";
import { TodoRequest } from "@/features/calendar/types/todo.model";
import {
  PositionChip,
  usePositions,
} from "@/features/position/hooks/usePositions";
import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import { InitialCalendarState } from "@/shared/hooks/useCalendarForm";
import Chip from "@/shared/ui/atoms/Chip";
import { ChipText } from "@/shared/ui/molecules/Chips";
import { WeekDayType } from "@/shared/ui/molecules/NemoDayButton";
import { TabsText } from "@/shared/ui/molecules/Tabs";
import Calendar from "@/shared/ui/organisms/Calendar";
import CalendarModal from "@/shared/ui/templates/CalendarModal";
import ScheduleListModal from "@/shared/ui/templates/ScheduleListModal";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";

interface CalendarScreenProps {}

const convertPositions = (
  positions: PositionChip[] | undefined
): TabsText[] => {
  if (!positions) return [];
  return positions.map((pos, index) => ({
    id: pos.positionId ?? index,
    content: pos.positionName ?? "",
    isActive: true,
  }));
};
const CalendarScreen = ({}: CalendarScreenProps) => {
  const { teamId: id, openModal } = useLocalSearchParams();

  const teamId = parseInt(id as string);
  const { createSchedule } = useScheduleMutations();

  const { createTodo } = useTodoMutations();

  const positionsQuery = usePositions(teamId);

  const [currentPosition, setCurrentPositions] = useState<ChipText[]>([]);
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
  const [isOpenAddScheduleModal, setIsOpenAddScheduleModal] =
    useState(!!openModal);
  const [isOpenListModal, setIsOpenListModal] = useState(false);
  // console.log(openModal);

  const handleCalendarMonth = (direction: -1 | 1) => {
    if (direction == -1) goPrevMonth();
    else goNextMonth();
  };

  const handleConfirmModal = (data: {
    id: string;
    state: InitialCalendarState;
  }) => {
    const {
      title,
      description,
      url,
      start,
      end,
      person,
      position,
      repeat,
      alarm,
      isAllDay,
    } = data.state;
    const positionIds = position
      .filter((pos) => pos.isActive)
      .map((pos) => pos.positionId);
    const attendeeMemberIds = person
      .filter((per) => per.isActive)
      .map((per) => per.memberId);
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
    const notificationMinutes: number[] = alarm
      ? Object.entries(alarm)
          .map(([key, value]) => {
            if (value) return parseInt(key);
            else return null;
          })
          .filter((val): val is number => val !== null)
      : [];
    if (data.id == "schedule") {
      const req = {
        teamId,
        title,
        description,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
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
        notificationMinutes,
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
        endAt: end.toISOString(),
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

  const handlePositionChip = (id: number) => () => {
    setIsAll(false);
    setCurrentPositions((prev) =>
      prev.map((chip) =>
        chip.id === id ? { ...chip, isActive: !chip.isActive } : chip
      )
    );
    callSchedules();
    callTodos();
  };

  useEffect(() => {
    setIsAll(currentPosition.every((v) => v.isActive));
  }, [currentPosition]);
  const handleConfirmListModal = (date: Date) => {
    selectDate(date);
    setIsOpenAddScheduleModal(true);
  };
  const handleSelectDate = (date: Date) => {
    selectDate(date);
    setIsOpenListModal(true);
  };
  const [isAll, setIsAll] = useState(true);
  const handlePressIsAll = () => {
    setIsAll(true);
    setCurrentPositions((prev) => prev.map((p) => ({ ...p, isActive: true })));
    callSchedules();
    callTodos();
  };

  const activePositionIds = currentPosition
    .filter((p) => p.isActive)
    .map((p) => p.id);
  const filteredSchedules = schedules.filter((s) =>
    s.positionIds?.some((id) => activePositionIds.includes(id))
  );

  const filteredTodos = todos.filter((t) =>
    t.positionIds?.some((id) => activePositionIds.includes(id))
  );

  return (
    <View>
      <View>
        <View
          style={{ flexDirection: "row", gap: 8, marginBottom: 16, width: 350 }}
        >
          <Chip active={isAll} onPress={handlePressIsAll}>
            전체
          </Chip>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={currentPosition}
            keyExtractor={(text) => `chip-${text.id}`}
            renderItem={({ item }) => (
              <Chip
                key={`chip-${item.id}`}
                active={item.isActive}
                onPress={handlePositionChip(item.id)}
              >
                {item.content}
              </Chip>
            )}
            contentContainerStyle={{
              gap: 8,
            }}
          />
        </View>
        <Calendar
          year={currentYearMonth.year}
          month={currentYearMonth.month + 1}
          days={days}
          schedules={
            isAll
              ? [...schedules, ...todos]
              : [...filteredSchedules, ...filteredTodos]
          }
          onCalendarMonth={handleCalendarMonth}
          onSelectDate={handleSelectDate}
        />
        {isOpenListModal && (
          <ScheduleListModal
            selectedDate={selectedDate}
            closeModal={() => setIsOpenListModal(false)}
            confirmModal={handleConfirmListModal}
          />
        )}
        {isOpenAddScheduleModal && (
          <CalendarModal
            teamId={teamId}
            selectedDate={selectedDate}
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

export default CalendarScreen;
