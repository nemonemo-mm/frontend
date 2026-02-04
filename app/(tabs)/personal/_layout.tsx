import { useMySchedules } from "@/features/calendar/hooks/useSchedules";
import { useMyTodos } from "@/features/calendar/hooks/useTodos";
import { SchedulesResponse } from "@/features/calendar/types/schedule.model";
import { TodoResponse } from "@/features/calendar/types/todo.model";
import { useUser } from "@/features/users/hooks/useUser";
import useCalendar from "@/shared/hooks/useCalendar";
import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import { CalendarSchedule } from "@/shared/types/Calendar";
import { globalGray700 } from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import Tabs, { TabsText } from "@/shared/ui/molecules/Tabs";
import { Feather } from "@expo/vector-icons";
import { Slot, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//!사이드모달에서 팀 리스트 불러오는 걸 여기에서도 해야 합니다.
//todo: 훅으로 분리하기

const today = new Date(Date.now());
const year = today.getFullYear();
const month = today.getMonth();
const convertSchedules = (
  data: SchedulesResponse[] | undefined
): CalendarSchedule[] => {
  if (!data) return [];
  return data.map((item) => {
    return {
      teamId: item.teamId,
      id: item.id,
      title: item.title,
      startDate: new Date(item.startAt),
      endDate: new Date(item.endAt),
      colorHex: item.representativeColorHex,
      status: "SCHEDULE",
      positionIds: item.positionIds,
    };
  });
};

const convertTodos = (data: TodoResponse[] | undefined): CalendarSchedule[] => {
  if (!data) return [];
  return data.map((item) => {
    return {
      teamId: item.teamId,
      id: item.id,
      title: item.title,
      startDate: new Date(item.endAt),
      endDate: new Date(item.endAt),
      colorHex: item.representativeColorHex,
      status: "TODO",
      positionIds: item.positionIds,
    };
  });
};

export default function CalendarTodosScreen() {
  const route = useRouter();
  const user = useUser().data;
  const [tabTexts, setTabTexts] = useState<TabsText[]>([
    { id: 0, content: "캘린더", isActive: true },
    { id: 1, content: "스케줄/투두", isActive: false },
  ]);

  useEffect(() => {
    // teamId 바뀌면 항상 첫 탭으로 초기화
    setTabTexts([
      { id: 0, content: "캘린더", isActive: true },
      { id: 1, content: "스케줄/투두", isActive: false },
    ]);
  }, []);

  const handleTab = (id: number) => {
    setTabTexts((prev) =>
      prev.map((tab) => ({
        ...tab,
        isActive: tab.id === id,
      }))
    );

    const nextPath = id === 0 ? `/(tabs)/personal` : `/(tabs)/personal/todos`;
    route.replace(nextPath);
  };

  const { goNextMonth, goPrevMonth, days, currentYearMonth } = useCalendar(
    year,
    month
  );
  const schedulesQuery = useMySchedules({
    start: new Date(
      currentYearMonth.year,
      currentYearMonth.month - 1,
      1
    ).toISOString(),
    end: new Date(
      currentYearMonth.year,
      currentYearMonth.month + 2,
      0
    ).toISOString(),
  });

  const todosQuery = useMyTodos({
    start: new Date(
      currentYearMonth.year,
      currentYearMonth.month - 1,
      1
    ).toISOString(),
    end: new Date(
      currentYearMonth.year,
      currentYearMonth.month + 2,
      0
    ).toISOString(),
  });

  const calendarSchedules = convertSchedules(schedulesQuery.data);
  const calendarTodos = convertTodos(todosQuery.data);

  const [selectedDate, setSelectedDate] = useState(today);
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const callSchedules = useCallback(() => {
    schedulesQuery.refetch();
  }, [schedulesQuery]);

  const callTodos = useCallback(() => {
    todosQuery.refetch({});
  }, [todosQuery]);
  const contextValue = {
    currentYearMonth,
    days,
    selectedDate,
    goNextMonth,
    goPrevMonth,
    selectDate,
    schedules: calendarSchedules,
    todos: calendarTodos,
    callSchedules,
    callTodos,
  };

  //todo: 알림 페이지 연동
  const handlePressAlarm = () => {};

  return (
    <SafeAreaView>
      <CalendarContext.Provider value={contextValue}>
        <View style={[styles.row, styles.layout, { paddingHorizontal: 20 }]}>
          <ProfileImage size={32} uri={user?.userImageUrl} />
          <NemoText level="h3" style={{ marginLeft: 8 }}>
            {user?.userName}
          </NemoText>
          <View style={{ margin: "auto" }} />
          <Pressable onPress={handlePressAlarm}>
            <Feather
              name="bell"
              size={20}
              color={globalGray700}
              style={{ marginRight: 12 }}
            />
          </Pressable>
        </View>
        <View style={[{ padding: 20 }, styles.layout]}>
          <View>
            <Tabs texts={tabTexts} handler={handleTab} />
            <View style={{ margin: 8 }} />
            <Slot />
          </View>
        </View>
      </CalendarContext.Provider>
    </SafeAreaView>
  );
}
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
