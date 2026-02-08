import GroupIcon from "@/assets/icons/group";
import TeamSetting from "@/assets/icons/teamSetting";
import {
  useLatestNotice,
  useNoticeMutations,
} from "@/features/calendar/hooks/useNotice";
import { useTeamSchedules } from "@/features/calendar/hooks/useSchedules";
import { useTeamTodos } from "@/features/calendar/hooks/useTodos";
import { SchedulesResponse } from "@/features/calendar/types/schedule.model";
import { TodoResponse } from "@/features/calendar/types/todo.model";
import { useTeamDetail } from "@/features/team/hooks/useTeamDetail";
import { useTeamList } from "@/features/team/hooks/useTeamList";
import useCalendar from "@/shared/hooks/useCalendar";
import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import { CalendarSchedule } from "@/shared/types/Calendar";
import { globalGray700 } from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import Tabs, { TabsText } from "@/shared/ui/molecules/Tabs";
import ModalEditableField from "@/shared/ui/organisms/ModalEditableField";
import SideModal from "@/shared/ui/templates/SideModal";
import { Feather } from "@expo/vector-icons";
import { Slot, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const { teamId } = useLocalSearchParams();
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
  }, [teamId]);

  const handleTab = (id: number) => {
    if (!teamId) return;

    setTabTexts((prev) =>
      prev.map((tab) => ({
        ...tab,
        isActive: tab.id === id,
      }))
    );

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

  const { data: teamDetail } = useTeamDetail(
    teamId ? parseInt(teamId as string) : null
  );

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

  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  // 사이드바 연동
  const { data: teams = [] } = useTeamList();

  const handlePressTeamName = () => {
    setIsOpenSidebar(true);
  };
  const handlePressAlarm = () => {
    route.push("/(team)/alarm");
  };

  const handlePressTeamSettings = () => {
    route.push(`/(team)/members?teamId=${teamId}`);
  };

  const noticeQuery = useLatestNotice(parseInt(teamId as string));

  const callNotice = useCallback(() => noticeQuery.refetch(), [noticeQuery]);

  const [notice, setNotice] = useState(noticeQuery.data?.content ?? "");

  useEffect(() => {
    setNotice(noticeQuery.data?.content ?? "");
  }, [teamId, noticeQuery.data]);
  const { createNotice, updateNotice, deleteNotice } = useNoticeMutations();
  const handleConfirmNotice = (newNotice: string) => {
    setNotice(newNotice);
    if (!noticeQuery.data)
      createNotice.mutate(
        {
          teamId: parseInt(teamId as string),
          body: { content: newNotice },
        },
        {
          onSuccess: () => callNotice(),
          onError: (e) => console.log(e),
        }
      );
    else {
      if (newNotice.trim() == "") {
        deleteNotice.mutate(
          {
            teamId: parseInt(teamId as string),
            noticeId: noticeQuery.data.id,
          },
          {
            onSuccess: () => callNotice(),
            onError: (e) => console.log(e),
          }
        );
      } else
        updateNotice.mutate(
          {
            teamId: parseInt(teamId as string),
            noticeId: noticeQuery.data.id,
            body: { content: newNotice },
          },
          {
            onSuccess: () => callNotice(),
            onError: (e) => console.log(e),
          }
        );
    }
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
            {teamDetail?.teamImageUrl ? (
              <ProfileImage uri={teamDetail.teamImageUrl} size={32} />
            ) : (
              <GroupIcon />
            )}
            <NemoText level="h3" style={{ marginLeft: 4 }}>
              {teamDetail?.teamName}
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
                defaultValue={notice}
                maxLength={26}
                onConfirm={handleConfirmNotice}
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
