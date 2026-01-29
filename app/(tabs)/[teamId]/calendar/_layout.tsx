import GroupIcon from "@/assets/icons/group";
import TeamSetting from "@/assets/icons/teamSetting";
import { useTeamSchedules } from "@/features/calendar/hooks/useSchedules";
import { useTeamTodos } from "@/features/calendar/hooks/useTodos";
import { SchedulesResponse } from "@/features/calendar/types/schedule.model";
import { TodoResponse } from "@/features/calendar/types/todo.model";
import { teamListUp } from "@/features/team/api/list";
import { TeamDetail } from "@/features/team/types/team.model";
import useCalendar from "@/shared/hooks/useCalendar";
import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import { CalendarSchedule } from "@/shared/types/Calendar";
import { globalGray700 } from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import Tabs, { TabsText } from "@/shared/ui/molecules/Tabs";
import ModalEditableField from "@/shared/ui/organisms/ModalEditableField";
import SideModal, { Teams } from "@/shared/ui/templates/SideModal";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const tabTexts: TabsText[] = [
  {
    id: 0,
    content: "캘린더",
    isActive: true,
  },
  {
    id: 1,
    content: "스케줄/투두",
    isActive: false,
  },
];
const today = new Date(Date.now());
const year = today.getFullYear();
const month = today.getMonth();
const convertSchedules = (
  data: SchedulesResponse[] | undefined
): CalendarSchedule[] => {
  if (!data) return [];
  return data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      startDate: new Date(item.startAt),
      endDate: new Date(item.endAt),
      colorHex: item.representativeColorHex,
      status: "SCHEDULES",
    };
  });
};

const convertTodos = (data: TodoResponse[] | undefined): CalendarSchedule[] => {
  if (!data) return [];
  return data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      startDate: new Date(item.endAt),
      endDate: new Date(item.endAt),
      colorHex: item.representativeColorHex,
      status: "TODOS",
    };
  });
};
export default function CalendarTodosScreen() {
  const route = useRouter();

  const { teamId } = useLocalSearchParams();

  const handleTab = (id: number) => {
    if (!teamId) return;

    const nextPath =
      id === 0
        ? `/(tabs)/${teamId}/calendar`
        : `/(tabs)/${teamId}/calendar/todos`;

    route.replace(
      nextPath as
        | `/(${string})/${string}/calendar`
        | `/(${string})/${string}/calendar/todos`
    );
  };

  const { goNextMonth, goPrevMonth, days, currentYearMonth } = useCalendar(
    year,
    month
  );
  const schedulesQuery = useTeamSchedules(parseInt(teamId as string), {
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

  const todosQuery = useTeamTodos(parseInt(teamId as string), {
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

  const [info, setInfo] = useState<TeamDetail | null>(null);

  useEffect(() => {
    const fetchTeamInfo = async () => {
      const teamInfo = await AsyncStorage.getItem("currentTeam");
      setInfo(teamInfo ? JSON.parse(teamInfo) : null);
    };
    fetchTeamInfo();
  }, [teamId]);

  const [selectedDate, setSelectedDate] = useState(today);
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const callSchedules = useCallback(() => {
    schedulesQuery.refetch();
  }, [schedulesQuery]);

  const callTodos = useCallback(() => {
    todosQuery.refetch();
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

  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  // 사이드바 연동

  const [teams, setTeams] = useState<Teams>([]);

  useEffect(() => {
    teamListUp().then((res) => setTeams(res));
  }, []);

  const handlePressTeamName = () => {
    setIsOpenSidebar(true);
  };
  //todo: 알림 페이지 연동
  const handlePressAlarm = () => {};
  const handlePressTeamSettings = () => {
    route.push(`/(team)/members`);
  };
  return (
    <SafeAreaView>
      <CalendarContext.Provider value={contextValue}>
        <View style={[styles.row, styles.layout, { paddingHorizontal: 20 }]}>
          {isOpenSidebar && (
            <SideModal
              teams={teams}
              closeModal={() => setIsOpenSidebar(false)}
            />
          )}
          <Pressable
            style={[styles.row, styles.layout]}
            onPress={handlePressTeamName}
          >
            <GroupIcon />
            <NemoText level="h3" style={{ marginLeft: 4 }}>
              {info?.teamName}
            </NemoText>
          </Pressable>
          <View style={{ margin: "auto" }} />
          <Pressable onPress={handlePressAlarm}>
            <Feather
              name="bell"
              size={20}
              color={globalGray700}
              style={{ marginRight: 12 }}
            />
          </Pressable>
          <Pressable onPress={handlePressTeamSettings}>
            <TeamSetting size={24} color={globalGray700} />
          </Pressable>
        </View>
        <View style={[{ padding: 20 }, styles.layout]}>
          <View>
            <View style={styles.noticeInput}>
              <ModalEditableField
                title="공지 작성"
                description="팀에 공유할 공지 내용을 입력해주세요"
                placeholder="아직 작성된 공지가 없어요"
                // defaultValue={info.notice}
              />
            </View>
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
