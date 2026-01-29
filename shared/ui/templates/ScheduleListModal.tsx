import { useTeamSchedules } from "@/features/calendar/hooks/useSchedules";
import { useTeamTodos } from "@/features/calendar/hooks/useTodos";
import { SchedulesResponse } from "@/features/calendar/types/schedule.model";
import { TodoResponse } from "@/features/calendar/types/todo.model";
import { CalendarSchedule } from "@/shared/types/Calendar";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
import { globalGray700, globalGray900 } from "..";
import NemoText from "../atoms/NemoText";
import { TabsText } from "../molecules/Tabs";
import BottomModal from "../organisms/BottomModal";
import CalendarModal from "./CalendarModal";

interface ScheduleListModalProps {
  list: CalendarSchedule[];
  positions: TabsText[];
  selectedDate: Date;
  closeModal: () => void;
  confirmModal: (date: Date) => void;
}

const formatDate = (dates: Date): string => {
  const year = dates.getFullYear().toString().padStart(2, "0");
  const month = dates.getMonth() + 1;
  const date = dates.getDate();

  return `${year}.${month}.${date}`;
};
type FlatItem =
  | {
      type: "header";
      id: string;
      title: string;
    }
  | {
      type: "schedule";
      id: number;
      data: SchedulesResponse;
    }
  | {
      type: "todo";
      id: number;
      data: TodoResponse;
    };
const ScheduleListModal = ({
  list,
  selectedDate,
  positions,
  closeModal,
  confirmModal,
}: ScheduleListModalProps) => {
  const formattedDate = formatDate(selectedDate);

  const handleAddSchedule = () => {
    confirmModal(selectedDate);
    setIsOpenCalendarModal(true);
  };
  const [isOpenCalendarModal, setIsOpenCalendarModal] = useState(false);
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
  const { teamId } = useLocalSearchParams();
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

  const flatData: FlatItem[] = [
    { type: "header", id: "schedule-header", title: "스케줄" },

    ...(todaySchedule ?? []).map(
      (s) =>
        ({
          type: "schedule",
          id: s.id,
          data: s,
        }) as const
    ),

    { type: "header", id: "todo-header", title: "할 일" },

    ...(todayTodos ?? []).map(
      (t) =>
        ({
          type: "todo",
          id: t.id,
          data: t,
        }) as const
    ),
  ];

  return (
    <Modal backdropColor={globalGray700 + "40"} animationType="slide">
      <BottomModal.Container style={{ minHeight: 660 }}>
        <BottomModal.Header>
          <BottomModal.LeftButton onPress={closeModal}>
            <AntDesign name="close" size={20} color={globalGray700} />
          </BottomModal.LeftButton>
          <BottomModal.RightButton onPress={handleAddSchedule}>
            <EvilIcons name="plus" size={20} olor={globalGray700} />
          </BottomModal.RightButton>
        </BottomModal.Header>
        <View>
          <FlatList
            data={flatData}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            ListHeaderComponent={
              <NemoText level="h1" style={{ color: globalGray900 }}>
                {formattedDate}
              </NemoText>
            }
            renderItem={({ item }) => {
              if (item.type === "header") {
                return (
                  <NemoText level="h3" style={{ marginVertical: 8 }}>
                    {item.title}
                  </NemoText>
                );
              }

              if (item.type === "schedule") {
                const s = item.data;
                const isAllDay = s.isAllDay;

                return (
                  <Pressable style={styles.row}>
                    <View
                      style={[
                        styles.border,
                        { backgroundColor: s.representativeColorHex },
                      ]}
                    />
                    <NemoText level="body1">{s.title}</NemoText>
                    <View style={{ marginLeft: "auto" }} />
                    <NemoText level="body3">
                      {isAllDay ? "종일" : `~ ${formatDate(new Date(s.endAt))}`}
                    </NemoText>
                  </Pressable>
                );
              }

              // todo
              const t = item.data;
              const endDate = new Date(t.endAt);

              return (
                <Pressable style={styles.row}>
                  <View
                    style={[
                      styles.border,
                      { backgroundColor: t.representativeColorHex },
                    ]}
                  />
                  <NemoText level="body1">{t.title}</NemoText>
                  <View style={{ marginLeft: "auto" }} />
                  <NemoText level="body3">
                    ~
                    {endDate.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </NemoText>
                </Pressable>
              );
            }}
          />
        </View>
      </BottomModal.Container>
      {isOpenCalendarModal && (
        <CalendarModal
          positions={positions}
          selectedDate={selectedDate}
          closeModal={() => setIsOpenCalendarModal(false)}
          confirmModal={handleAddSchedule}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
  },
  border: {
    width: 1,
  },
});

export default ScheduleListModal;
