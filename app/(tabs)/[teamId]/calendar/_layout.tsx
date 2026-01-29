import GroupIcon from "@/assets/icons/group";
import TeamSetting from "@/assets/icons/teamSetting";
import { teamListUp } from "@/features/team/api/list";
import { TeamDetail } from "@/features/team/types/team.model";
import useCalendar from "@/shared/hooks/useCalendar";
import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import { CalendarSchedule } from "@/shared/types/Calendar";
import { globalGray700 } from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import Tabs, { TabsText } from "@/shared/ui/molecules/Tabs";
import ModalEditableField from "@/shared/ui/organisms/ModalEditableField";
import { InitialState } from "@/shared/ui/templates/CalendarModal";
import SideModal, { Teams } from "@/shared/ui/templates/SideModal";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const tabTexts: TabsText[] = [
  {
    id: "calendar",
    content: "캘린더",
    isActive: true,
  },
  {
    id: "todo",
    content: "스케줄/투두",
    isActive: false,
  },
];
const today = new Date(Date.now());
const year = today.getFullYear();
const month = today.getMonth();
const convertSchedules = (
  data: {
    id: string;
    state: InitialState;
  }[]
): CalendarSchedule[] => {
  return data.map((item) => {
    if (item.id === "calendar") {
      return {
        id: Math.random(),
        title: item.state.title,
        startDate: item.state.startAt,
        endDate: item.state.endAt,
      };
    } else {
      return {
        id: Math.random(),
        title: item.state.title,
        startDate: item.state.endAt,
        endDate: item.state.endAt,
      };
    }
  });
};
export default function CalendarTodosScreen() {
  const route = useRouter();
  const handleTab = (id: string) => {
    if (!teamId) return;

    const nextPath =
      id === "calendar"
        ? `/(tabs)/${teamId}/calendar`
        : `/(tabs)/${teamId}/calendar/todos`;

    route.replace(
      nextPath as
        | `/(${string})/${string}/calendar`
        | `/(${string})/${string}/calendar/todos`
    );
  };

  const [schedules, setSchedules] = useState<
    { id: string; state: InitialState }[]
  >([]);

  const { goNextMonth, goPrevMonth, days, currentYearMonth } = useCalendar(
    year,
    month
  );
  const [info, setInfo] = useState<TeamDetail | null>(null);
  const { teamId } = useLocalSearchParams();
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

  const contextValue = useMemo(
    () => ({
      currentYearMonth,
      days,
      selectedDate,
      goNextMonth,
      goPrevMonth,
      selectDate,
      schedules: convertSchedules(schedules),
      setSchedules,
    }),
    [currentYearMonth, days, selectedDate, goNextMonth, goPrevMonth, selectDate]
  );

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
  //todo: 팀 설정 페이지 연동
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
              />
            </View>
            <Tabs texts={tabTexts} handler={handleTab} />

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
