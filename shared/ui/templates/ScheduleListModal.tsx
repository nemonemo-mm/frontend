import {
  useScheduleMutations,
  useTeamSchedules,
} from "@/features/calendar/hooks/useSchedules";
import {
  useTeamTodos,
  useTodoMutations,
} from "@/features/calendar/hooks/useTodos";
import {
  ScheduleRequest,
  SchedulesResponse,
} from "@/features/calendar/types/schedule.model";
import {
  TodoRequest,
  TodoResponse,
} from "@/features/calendar/types/todo.model";
import { InitialCalendarState } from "@/shared/hooks/useCalendarForm";
import { convertAlarmToNumberArray } from "@/shared/utils/convertAlarmToNumberArray";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
import { globalGray700, globalGray900 } from "..";
import NemoText from "../atoms/NemoText";
import { WeekDayType } from "../molecules/NemoDayButton";
import BottomModal from "../organisms/BottomModal";
import CalendarDetailModal from "./CalendarDetailModal";

interface ScheduleListModalProps {
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
  selectedDate,
  closeModal,
  confirmModal,
}: ScheduleListModalProps) => {
  const formattedDate = formatDate(selectedDate);

  const handleAddSchedule = (): void => {
    confirmModal(selectedDate);
    // setSelectedItem(null);
  };
  const { updateSchedule } = useScheduleMutations();
  const { updateTodo } = useTodoMutations();
  const { teamId: id } = useLocalSearchParams();
  const teamId = parseInt(id as string);

  const handlePatchSchedule = (data: {
    id: "schedule" | "todo";
    state: InitialCalendarState;
  }) => {
    const { id, state } = data;
    try {
      const {
        title,
        description,
        url,
        start,
        end,
        person,
        position,
        repeat,
        alarm,
        isAllDay,
      } = state;

      const positionIds = position
        .filter((pos) => pos.isActive)
        .map((pos) => pos.positionId);
      const attendeeMemberIds = person
        .filter((per) => per.isActive)
        .map((per) => per.memberId);
      const repeatType = repeat?.period ?? "NONE";
      let repeatEndDate = "";
      let repeatInterval: number = 0;
      let repeatWeekDays: WeekDayType[] = [];
      let repeatUseDate: boolean = false;
      if (repeat) {
        repeatEndDate = repeat.endAt.toISOString();
        if (repeat.period == "daily") {
          repeatInterval = repeat.interval;
        }
        if (repeat.period == "weekly") {
          repeatInterval = repeat.interval;
          repeatWeekDays = repeat.weekdays;
        }
        if (repeat.period == "monthly" || repeat.period == "yearly") {
          repeatUseDate = repeat.useDate;
        }
      }

      const notificationMinutes: number[] = convertAlarmToNumberArray(alarm);

      if (id == "schedule") {
        const req = {
          teamId,
          title,
          description,
          startAt: start.toISOString(),
          endAt: end.toISOString(),
          isAllDay,
          place: "",
          url,
          repeatType,
          repeatInterval,
          repeatWeekDays,
          repeatUseDate,
          repeatEndDate,
          positionIds,
          attendeeMemberIds,
          notificationMinutes,
        } as ScheduleRequest;

        updateSchedule.mutate(
          { scheduleId: state.id!, body: req },
          {
            onError: (e) => {
              console.log(e);
            },
          }
        );
      } else {
        const req = {
          title,
          description,
          endAt: end.toISOString(),
          status: "TODO",
          place: "",
          url,
          assigneeMemberIds: attendeeMemberIds,
          positionIds,
        } as TodoRequest;
        updateTodo.mutate(
          { todoId: state.id!, body: req },
          {
            onError: (e) => {
              console.log(e);
            },
          }
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

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

  const todayScheduleQuery = useTeamSchedules(teamId, {
    start,
    end,
  });
  const todaySchedule = todayScheduleQuery.data;

  const todayTodoQuery = useTeamTodos(teamId, {
    start,
    end,
  });
  const todayTodos = todayTodoQuery.data;

  const flatData: FlatItem[] = [
    ...(todaySchedule ?? []).map(
      (s) =>
        ({
          type: "schedule",
          id: s.id,
          data: s,
        }) as const
    ),

    ...(todayTodos ?? []).map(
      (t) =>
        ({
          type: "todo",
          id: t.id,
          data: t,
        }) as const
    ),
  ];
  const [selectedItem, setSelectedItem] = useState<
    SchedulesResponse | TodoResponse | null
  >(null);

  const handlePressSchedule = (d: SchedulesResponse) => () => {
    setSelectedItem(d);
  };
  const handlePressTodo = (d: TodoResponse) => () => {
    setSelectedItem(d);
  };
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
              if (item.type === "schedule") {
                const s = item.data;
                const isAllDay = s.isAllDay;

                return (
                  <Pressable
                    style={styles.row}
                    onPress={handlePressSchedule(s)}
                  >
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
                <Pressable style={styles.row} onPress={handlePressTodo(t)}>
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
      {selectedItem && (
        <CalendarDetailModal
          data={selectedItem}
          type={"isAllDay" in selectedItem ? "schedule" : "todo"}
          selectedDate={selectedDate}
          closeModal={() => setSelectedItem(null)}
          onPatch={handlePatchSchedule}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
    marginVertical: 8,
  },
  border: {
    width: 2,
    borderRadius: 2,
  },
});

export default ScheduleListModal;
