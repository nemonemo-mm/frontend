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
import { convertDateAndTimeToString } from "@/shared/utils/convertDateAndTimeToString";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
import { globalGray700, globalGray900 } from "..";
import NemoText from "../atoms/NemoText";
import { WeekDayType } from "../molecules/NemoDayButton";
import { TabsText } from "../molecules/Tabs";
import BottomModal from "../organisms/BottomModal";
import CalendarModal, { formatAlarm, InitialState } from "./CalendarModal";

interface ScheduleListModalProps {
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
  selectedDate,
  positions,
  closeModal,
  confirmModal,
}: ScheduleListModalProps) => {
  const formattedDate = formatDate(selectedDate);

  const handleAddSchedule = (): void => {
    confirmModal(selectedDate);
    setIsOpenCalendarModal(true);
  };
  const { updateSchedule } = useScheduleMutations();
  const { updateTodo } = useTodoMutations();
  const { teamId: id } = useLocalSearchParams();
  const teamId = parseInt(id as string);
  const handlePatchSchedule = (
    data: {
      id: string;
      state: InitialState;
    },
    patch: boolean
  ) => {
    if (patch) {
      try {
        const status = data.id == "schedule" ? "SCHEDULE" : "TODO";
        const {
          title,
          description,
          url,
          startAt,
          startAtTime,
          endAt,
          endAtTime,
          person,
          position,
          repeat,
          alarm,
          isAllDay,
        } = data.state;
        const start = convertDateAndTimeToString(startAt, startAtTime);
        const end = convertDateAndTimeToString(endAt, endAtTime);
        const positionIds = position
          .filter((pos) => pos.isActive)
          .map((pos) => pos.id);
        const attendeeMemberIds = person
          .filter((per) => per.isActive)
          .map((per) => per.id);
        const repeatType = repeat?.period ?? "NONE";
        let repeatEndDate = null;
        let repeatInterval: number | null = null;
        let repeatWeekDays: WeekDayType[] | null = null;
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

        const alarmLabel: string = formatAlarm(alarm);

        if (status == "SCHEDULE") {
          const req = {
            teamId,
            title,
            description,
            startAt: start,
            endAt: end,
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
            alarm: alarmLabel,
          } as ScheduleRequest;

          updateSchedule.mutate({ scheduleId: data.state.id!, body: req });
        } else {
          const req = {
            teamId,
            title,
            description,
            endAt: end,
            place: "",
            url,
            assigneeMemberIds: attendeeMemberIds,
            positionIds,
          } as TodoRequest;
          updateTodo.mutate({ todoId: data.state.id!, body: req });
        }
      } catch (e) {}
    }
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
  const [type, setType] = useState<"schedule" | "todo">("schedule");

  const [data, setData] = useState<SchedulesResponse | TodoResponse>();
  const handlePressSchedule = (d: SchedulesResponse) => () => {
    setIsOpenCalendarModal(true);
    setType("schedule");
    setData(d);
  };
  const handlePressTodo = (d: TodoResponse) => () => {
    setIsOpenCalendarModal(true);
    setType("todo");
    setData(d);
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
      {isOpenCalendarModal && (
        <CalendarModal
          data={data}
          type={type}
          positions={positions}
          selectedDate={selectedDate}
          closeModal={() => setIsOpenCalendarModal(false)}
          confirmModal={handlePatchSchedule}
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
