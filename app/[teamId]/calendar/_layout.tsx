import GroupIcon from "@/assets/icons/group";
import SquaredPlusIcon from "@/assets/icons/squaredPlus";
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
import {
  globalGray50,
  globalGray700,
  globalGreen300,
  globalSpacingXs,
} from "@/shared/ui";
import GroupImage from "@/shared/ui/atoms/GroupImage";
import NemoText from "@/shared/ui/atoms/NemoText";
import Tabs, { TabsText } from "@/shared/ui/molecules/Tabs";
import ModalEditableField from "@/shared/ui/organisms/ModalEditableField";
import SideModal from "@/shared/ui/templates/SideModal";
import { Feather } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import {
  Slot,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
  const prefetchedImageUrisRef = useRef<Set<string>>(new Set());

  const { teamId } = useLocalSearchParams();
  const parsedTeamId = teamId ? parseInt(teamId as string, 10) : NaN;
  const [tabTexts, setTabTexts] = useState<TabsText[]>([
    { id: 0, content: "캘린더", isActive: true },
    { id: 1, content: "스케줄/투두", isActive: false },
  ]);

  const prefetchImageUris = useCallback(
    (uris: Array<string | null | undefined>) => {
      const filteredUris = uris
        .filter((uri): uri is string => !!uri)
        .filter((uri) => !prefetchedImageUrisRef.current.has(uri));

      filteredUris.forEach((uri) => {
        prefetchedImageUrisRef.current.add(uri);
        ExpoImage.prefetch(uri, "memory-disk").catch(() => {
          prefetchedImageUrisRef.current.delete(uri);
        });
      });
    },
    []
  );

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
      id === 0 ? `/${teamId}/calendar` : `/${teamId}/calendar/todos`;

    route.replace(
      nextPath as `/${string}/calendar` | `/${string}/calendar/todos`
    );
  };

  const { goNextMonth, goPrevMonth, days, currentYearMonth } = useCalendar(
    year,
    month
  );
  const schedulesQuery = useTeamSchedules(parsedTeamId, {
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

  const todosQuery = useTeamTodos(parsedTeamId, {
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
    Number.isFinite(parsedTeamId) ? parsedTeamId : null
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

  useEffect(() => {
    prefetchImageUris([
      teamDetail?.teamImageUrl,
      ...teams.map((team) => team.teamImageUrl),
    ]);
  }, [prefetchImageUris, teamDetail?.teamImageUrl, teams]);

  const handlePressTeamName = () => {
    setIsOpenSidebar(true);
  };
  const handlePressAlarm = () => {
    route.push("/(team)/alarm");
  };

  const handlePressTeamSettings = () => {
    route.push(`/(team)/members?teamId=${teamId}`);
  };

  const noticeQuery = useLatestNotice(parsedTeamId);

  const callNotice = useCallback(() => noticeQuery.refetch(), [noticeQuery]);

  const [notice, setNotice] = useState(noticeQuery.data?.content ?? "");

  useEffect(() => {
    setNotice(noticeQuery.data?.content ?? "");
  }, [teamId, noticeQuery.data]);
  const { createNotice, updateNotice, deleteNotice } = useNoticeMutations();
  const handleConfirmNotice = (newNotice: string) => {
    if (!Number.isFinite(parsedTeamId) || parsedTeamId <= 0) return;

    setNotice(newNotice);
    if (!noticeQuery.data)
      createNotice.mutate(
        {
          teamId: parsedTeamId,
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
            teamId: parsedTeamId,
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
            teamId: parsedTeamId,
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
  const insets = useSafeAreaInsets();
  const pathName = usePathname();
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: Platform.OS == "ios" ? 0 : insets.top },
      ]}
    >
      <CalendarContext.Provider value={contextValue}>
        <View style={styles.container}>
          <View style={styles.header}>
            {isOpenSidebar && (
              <SideModal
                teams={teams}
                closeModal={() => setIsOpenSidebar(false)}
              />
            )}
            <Pressable style={styles.row} onPress={handlePressTeamName}>
              {teamDetail?.teamImageUrl ? (
                <GroupImage uri={teamDetail.teamImageUrl} size={32} />
              ) : (
                <GroupIcon size={32} />
              )}
              <NemoText level="h3" style={{ marginLeft: 4 }}>
                {teamDetail?.teamName}
              </NemoText>
            </Pressable>
            <View style={styles.spacer} />
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

          <View style={styles.content}>
            <View style={styles.noticeInput}>
              <ModalEditableField
                title="공지 작성"
                description="공유할 내용을 25자 이내로 입력해 주세요"
                placeholder="아직 작성된 공지가 없어요"
                defaultValue={notice}
                maxLength={25}
                onConfirm={handleConfirmNotice}
              />
            </View>
            <Tabs texts={tabTexts} handler={handleTab} />
            <View style={styles.slotContainer}>
              <Slot />
            </View>

            <Pressable
              onPress={() => route.push(`${pathName}?openModal=true` as any)}
            >
              <SquaredPlusIcon
                size={52}
                color={globalGreen300}
                style={{
                  marginBottom: insets.bottom,
                  // marginRight: insets.right,
                  alignSelf: "flex-end",
                  borderRadius: globalSpacingXs,
                  backgroundColor: globalGray50,
                  padding: 0.2,
                }}
              />
            </Pressable>
          </View>
        </View>
      </CalendarContext.Provider>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  spacer: {
    marginLeft: "auto",
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  noticeInput: {
    position: "relative",
    marginBottom: 8,
    marginTop: 8,
  },
  slotContainer: {
    marginTop: 8,
    flex: 1,
    width: "100%",
  },
});
