import GroupIcon from "@/assets/icons/group";
import TeamSetting from "@/assets/icons/teamSetting";
import useCalendar from "@/shared/hooks/useCalendar";
import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import { CalendarSchedule } from "@/shared/types/Calendar";
import { globalGray700 } from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import CalendarDays from "@/shared/ui/molecules/CalendarDays";
import CalendarWeek from "@/shared/ui/molecules/CalendarWeek"; // Ensure this is the correct import path
import Chips from "@/shared/ui/molecules/Chips";
import Tabs, { TabsText } from "@/shared/ui/molecules/Tabs";
import Calendar from "@/shared/ui/organisms/Calendar";
import ModalEditableField from "@/shared/ui/organisms/ModalEditableField";
import CalendarModal, {
  InitialState,
} from "@/shared/ui/templates/CalendarModal";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GroupScreenProps {}
const tabTexts = [
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
//todo: api 연결해서 직접 받아오기
const positionTexts = [
  {
    id: "FE",
    content: "FE",
    isActive: true,
  },
  {
    id: "BE",
    content: "BE",
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

const GroupScreen = ({}: GroupScreenProps) => {
  const [currentTab, setCurrentTab] = useState("calendar");
  const [currentPositions, setCurrentPositions] = useState<TabsText[]>([]);
  const [schedules, setSchedules] = useState<
    { id: string; state: InitialState }[]
  >([]);

  const { teamId } = useLocalSearchParams();

  useEffect(() => {
    console.log(teamId);
    // GetPosition(teamId);
  }, []);
  const { goNextMonth, goPrevMonth, days, currentYearMonth } = useCalendar(
    year,
    month
  );
  const [isOpenAddScheduleModal, setIsOpenAddScheduleModal] = useState(false);
  const handleCalendarMonth = (direction: -1 | 1) => {
    if (direction == -1) goPrevMonth();
    else goNextMonth();
  };
  const handleAddSchedule = () => {
    setSelectedDate(today);
    setIsOpenAddScheduleModal(true);
  };
  const handleTab = (tab: TabsText[]) => {
    setCurrentTab(tab.find((t) => t.isActive)!.id);
  };
  const handlePositionChips = (position: TabsText[]) => {
    setCurrentPositions(position);
  };

  const thisWeek = days
    .filter((day) => day.some((d) => d.date == today.getDate()))
    .flat();
  const [selectedDate, setSelectedDate] = useState(today);
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsOpenAddScheduleModal(true);
  }, []);
  const contextValue = useMemo(
    () => ({
      currentYearMonth,
      days,
      selectedDate,
      goNextMonth,
      goPrevMonth,
      selectDate,
    }),
    [currentYearMonth, days, selectedDate, goNextMonth, goPrevMonth, selectDate]
  );

  //todo: 사이드바 연동
  const handlePressTeamName = () => {};
  //todo: 알림 페이지 연동
  const handlePressAlarm = () => {};
  //todo: 팀 설정 페이지 연동
  const handlePressTeamSettings = () => {};
  return (
    <SafeAreaView>
      <CalendarContext.Provider value={contextValue}>
        <View style={[styles.row, styles.layout, { paddingHorizontal: 20 }]}>
          <Pressable
            style={[styles.row, styles.layout]}
            onPress={handlePressTeamName}
          >
            <GroupIcon />
            <NemoText level="h3" style={{ marginLeft: 4 }}>
              teamName
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
            {currentTab == "calendar" && (
              <View>
                <Chips texts={positionTexts} handler={handlePositionChips} />
                <Calendar
                  year={currentYearMonth.year}
                  month={currentYearMonth.month + 1}
                  days={days}
                  schedules={convertSchedules(schedules)}
                  onCalendarMonth={handleCalendarMonth}
                  onAddSchedule={handleAddSchedule}
                />
                {isOpenAddScheduleModal && (
                  <CalendarModal
                    selectedDate={selectedDate}
                    confirmModal={(data: { id: string; state: InitialState }) =>
                      setSchedules((prev) => [...prev, data])
                    }
                    closeModal={() => {
                      setIsOpenAddScheduleModal(false);
                    }}
                  />
                )}
              </View>
            )}
            {currentTab == "todo" && (
              <View>
                <CalendarDays />
                <CalendarWeek
                  dates={thisWeek}
                  schedules={convertSchedules(schedules)}
                />
              </View>
            )}
          </View>
        </View>
      </CalendarContext.Provider>
    </SafeAreaView>
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
  noticeBtn: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    marginVertical: "auto",
  },
});

export default GroupScreen;
