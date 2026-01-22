import useCalendar from "@/shared/hooks/useCalendar";
import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import { CalendarSchedule } from "@/shared/types/Calendar";
import { globalGray700 } from "@/shared/ui";
import Button from "@/shared/ui/atoms/Button";
import Input from "@/shared/ui/atoms/Input";
import CalendarDays from "@/shared/ui/molecules/CalendarDays";
import CalendarWeek from "@/shared/ui/molecules/CalendarWeek"; // Ensure this is the correct import path
import Chips from "@/shared/ui/molecules/Chips";
import Tabs, { TabsText } from "@/shared/ui/molecules/Tabs";
import Calendar from "@/shared/ui/organisms/Calendar";
import CalendarModal, {
  InitialState,
} from "@/shared/ui/templates/CalendarModal";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

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
  return (
    <CalendarContext.Provider value={contextValue}>
      <View style={[{ padding: 20 }, styles.layout]}>
        <View>
          <View style={styles.noticeInput}>
            <Input placeholder="아직 작성된 공지가 없어요" />
            <Button style={styles.noticeBtn}>
              <Feather name="edit-2" size={20} color={globalGray700} />
            </Button>
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
  );
};

const styles = StyleSheet.create({
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
