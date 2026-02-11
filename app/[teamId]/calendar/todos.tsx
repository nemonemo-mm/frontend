import {
  useScheduleMutations,
  useTeamSchedules,
} from "@/features/calendar/hooks/useSchedules";
import {
  useTeamTodos,
  useTodoMutations,
} from "@/features/calendar/hooks/useTodos";
import {
  ScheduleRequest,
  SchedulesResponse,
} from "@/features/calendar/types/schedule.model";
import {
  TodoRequest,
  TodoResponse,
} from "@/features/calendar/types/todo.model";
import { TeamDetail } from "@/features/team/types/team.model";
import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import { InitialCalendarState } from "@/shared/hooks/useCalendarForm";
import Checkbox from "@/shared/ui/atoms/Checkbox";
import NemoText from "@/shared/ui/atoms/NemoText";
import CalendarDays from "@/shared/ui/molecules/CalendarDays";
import CalendarWeek from "@/shared/ui/molecules/CalendarWeek";
import { WeekDayType } from "@/shared/ui/molecules/NemoDayButton";
import CalendarModal from "@/shared/ui/templates/CalendarModal";
import { RepeatPeriod } from "@/shared/ui/templates/RepeatModal";
import { getWeekByDate } from "@/shared/utils/getWeekByDate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

interface TodosProps {}
type Section =
  | {
      key: "schedule";
      title: string;
      emptyMessage: string;
      data: SchedulesResponse[];
    }
  | {
      key: "todo";
      title: string;
      emptyMessage: string;
      data: TodoResponse[];
    };

const formatDateString = (date: string): string => {
  const oldDate = new Date(date);
  const newDate =
    (oldDate.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    oldDate.getDate().toString().padStart(2, "0");

  return newDate;
};

const Todos = ({}: TodosProps) => {
  const calendarContext = useContext(CalendarContext);
  const today = new Date(Date.now());
  const { teamId, openModal } = useLocalSearchParams();

  const [isOpenAddScheduleModal, setIsOpenAddScheduleModal] =
    useState(!!openModal);
  if (!calendarContext) {
    throw new Error("CalendarContext is undefined. Ensure it is provided.");
  }
  const [info, setInfo] = useState<TeamDetail | null>(null);
  useEffect(() => {
    const init = async () => {
      const data = await AsyncStorage.getItem("currentTeam");
      if (data) setInfo(JSON.parse(data) as TeamDetail);
    };
    init();
  }, [teamId]);

  const {
    selectedDate,
    selectDate,
    schedules,
    callSchedules,
    todos,
    callTodos,
  } = calendarContext;

  const thisWeek = getWeekByDate(new Date(Date.now()));
  const start = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    0,
    0,
    0,
    -1
  ).toISOString();

  const end = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    23,
    59,
    59,
    999
  ).toISOString();

  const todayScheduleQuery = useTeamSchedules(parseInt(teamId as string), {
    start,
    end,
  });
  const todaySchedule = todayScheduleQuery.data;

  const todayTodoQuery = useTeamTodos(parseInt(teamId as string), {
    start,
    end,
  });
  const todayTodos = todayTodoQuery.data;

  const { createTodo, updateTodoStatus } = useTodoMutations();

  const { createSchedule } = useScheduleMutations();

  const handleCheckTodo = (todoId: number) => (v: boolean) => {
    updateTodoStatus.mutate(
      {
        todoId,
        body: { status: v ? "DONE" : "TODO" },
      },
      {
        onSuccess: () => {
          todayTodoQuery.refetch();
        },
      }
    );
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
      if (repeat.period === RepeatPeriod.DAILY) {
        repeatInterval = repeat.interval;
      }
      if (repeat.period === RepeatPeriod.WEEKLY) {
        repeatInterval = repeat.interval;
        repeatWeekDays = repeat.weekdays;
      }
      if (
        repeat.period === RepeatPeriod.MONTHLY ||
        repeat.period === RepeatPeriod.YEARLY
      ) {
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
        teamId: parseInt(teamId as string),
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
        teamId: parseInt(teamId as string),
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
  const sections: Section[] = [
    {
      key: "schedule",
      title: "스케줄",
      emptyMessage: "오늘의 스케줄이 없습니다.",
      data: todaySchedule ?? [],
    },
    {
      key: "todo",
      title: "투두",
      emptyMessage: "오늘의 투두가 없습니다.",
      data: todayTodos ?? [],
    },
  ];
  const renderSection = ({ item }: { item: Section }) => {
    return (
      <View style={styles.container}>
        <NemoText level="h2">
          {info?.teamName} {item.title}
        </NemoText>

        {item.data.length === 0 ? (
          <View style={styles.emptyContainer}>
            <NemoText level="body2">{item.emptyMessage}</NemoText>
          </View>
        ) : item.key === "schedule" ? (
          item.data.map((s) => (
            <View key={s.id} style={styles.rowItem}>
              <View
                style={[
                  styles.colorBar,
                  { backgroundColor: s.representativeColorHex ?? "#BDBDBD" },
                ]}
              />
              <View style={styles.rowItem}>
                <NemoText level="body2">
                  {formatDateString(s.startAt)} ~ {formatDateString(s.endAt)}
                </NemoText>
                <NemoText level="body1">{s.title}</NemoText>
                {!!s.description && (
                  <NemoText level="body2">{s.description}</NemoText>
                )}
              </View>
            </View>
          ))
        ) : (
          item.data.map((t) => (
            <View key={t.id} style={styles.rowItem}>
              <View
                style={[
                  styles.colorBar,
                  { backgroundColor: t.representativeColorHex ?? "#BDBDBD" },
                ]}
              />
              <View style={styles.rowItem}>
                {!!t.assigneeMemberUserName && (
                  <NemoText level="body2">{t.assigneeMemberUserName}</NemoText>
                )}
                <NemoText
                  level="body1"
                  style={{
                    textDecorationLine:
                      t.status == "DONE" ? "line-through" : "none",
                  }}
                >
                  {t.title}
                </NemoText>
                {!!t.description && (
                  <NemoText level="body2">{t.description}</NemoText>
                )}
              </View>

              <View style={{ marginLeft: "auto" }} />
              <Checkbox
                value={t.status == "DONE"}
                handler={handleCheckTodo(t.id)}
              />
            </View>
          ))
        )}
        {isOpenAddScheduleModal && (
          <CalendarModal
            teamId={parseInt(teamId as string)}
            selectedDate={selectedDate}
            confirmModal={handleConfirmModal}
            closeModal={() => {
              setIsOpenAddScheduleModal(false);
            }}
          />
        )}
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      {/* 🔒 고정 헤더 */}
      <View style={{ marginBottom: 8 }}>
        <CalendarDays />
        <CalendarWeek
          dates={thisWeek}
          schedules={[...schedules, ...todos]}
          onSelectDate={selectDate}
          maxLanes={2}
        />
      </View>

      {/* 📜 스크롤 영역 */}
      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={renderSection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    gap: 12,
    minHeight: 200,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  rowItem: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  colorBar: {
    width: 3,
    borderRadius: 2,
    height: 16,
  },
});

export default Todos;
