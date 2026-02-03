import { useTeamSchedules } from "@/features/calendar/hooks/useSchedules";
import {
  useTeamTodos,
  useTodoMutations,
} from "@/features/calendar/hooks/useTodos";
import { SchedulesResponse } from "@/features/calendar/types/schedule.model";
import { TodoResponse } from "@/features/calendar/types/todo.model";
import { TeamDetail } from "@/features/team/types/team.model";
import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import Checkbox from "@/shared/ui/atoms/Checkbox";
import NemoText from "@/shared/ui/atoms/NemoText";
import CalendarDays from "@/shared/ui/molecules/CalendarDays";
import CalendarWeek from "@/shared/ui/molecules/CalendarWeek";
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
      data: SchedulesResponse[];
    }
  | {
      key: "todo";
      title: string;
      data: TodoResponse[];
    };

const formatDateString = (date: string): string => {
  const oldDate = new Date(date);
  const newDate =
    (oldDate.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    oldDate.getDate();

  return newDate;
};

const Todos = ({}: TodosProps) => {
  const calendarContext = useContext(CalendarContext);
  const today = new Date(Date.now());
  const { teamId } = useLocalSearchParams();
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

  const { schedules, todos, selectedDate, selectDate } = calendarContext;

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

  const { updateTodoStatus } = useTodoMutations();

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

  const sections: Section[] = [
    {
      key: "schedule",
      title: "스케줄",
      data: todaySchedule ?? [],
    },
    {
      key: "todo",
      title: "할 일",
      data: todayTodos ?? [],
    },
  ];
  const renderSection = ({ item }: { item: Section }) => {
    return (
      <View style={styles.container}>
        <NemoText level="h2">
          {info?.teamName}의 {item.title}
        </NemoText>

        {item.data.length === 0 ? (
          <View style={styles.emptyContainer}>
            <NemoText level="body2">오늘 {item.title}이 없습니다.</NemoText>
          </View>
        ) : item.key === "schedule" ? (
          item.data.map((s) => (
            <View key={s.id} style={styles.rowItem}>
              <View
                style={[
                  styles.colorBar,
                  { backgroundColor: s.representativeColorHex },
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
                  { backgroundColor: t.representativeColorHex },
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
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      {/* 🔒 고정 헤더 */}
      <View style={{ marginBottom: 36 }}>
        <CalendarDays />
        <CalendarWeek
          dates={thisWeek}
          schedules={[...schedules, ...todos]}
          onSelectDate={selectDate}
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
    gap: 10,
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  colorBar: {
    width: 2,
    borderRadius: 2,
    alignSelf: "stretch",
  },
});

export default Todos;
