import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import Chips from "@/shared/ui/molecules/Chips";
import { TabsText } from "@/shared/ui/molecules/Tabs";
import Calendar from "@/shared/ui/organisms/Calendar";
import CalendarModal, {
  InitialState,
} from "@/shared/ui/templates/CalendarModal";
import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";

interface CalendarScreenProps {}

const CalendarScreen = ({}: CalendarScreenProps) => {
  const [currentPositions, setCurrentPositions] = useState<TabsText[]>([]);

  const calendarContext = useContext(CalendarContext);

  if (!calendarContext) {
    throw new Error("CalendarContext is undefined. Ensure it is provided.");
  }

  const {
    currentYearMonth,
    selectedDate,
    days,
    schedules,
    setSchedules,
    goPrevMonth,
    goNextMonth,
  } = calendarContext;

  const [isOpenAddScheduleModal, setIsOpenAddScheduleModal] = useState(false);

  const handleCalendarMonth = (direction: -1 | 1) => {
    if (direction == -1) goPrevMonth();
    else goNextMonth();
  };
  const handleAddSchedule = () => {
    setIsOpenAddScheduleModal(true);
  };

  const handlePositionChips = (position: TabsText[]) => {
    setCurrentPositions(position);
  };

  return (
    <View>
      <View>
        <Chips texts={currentPositions} handler={handlePositionChips} />
        <Calendar
          year={currentYearMonth.year}
          month={currentYearMonth.month + 1}
          days={days}
          schedules={schedules}
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
    </View>
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
});

export default CalendarScreen;
