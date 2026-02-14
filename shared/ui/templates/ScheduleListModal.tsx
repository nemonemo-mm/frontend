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
import { useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { globalGray900 } from "..";
import Checkbox from "../atoms/Checkbox";
import NemoText from "../atoms/NemoText";
import { WeekDayType } from "../molecules/NemoDayButton";
import Segments from "../molecules/Segments";
import BottomModal from "../organisms/BottomModal";
import CalendarDetailModal from "./CalendarDetailModal";
import { RepeatPeriod } from "./RepeatModal";

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
const segmentTexts = [
  {
    id: "schedule",
    content: "캘린더",
    isActive: true,
  },
  {
    id: "todo",
    content: "투두",
    isActive: false,
  },
];
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
        if (repeat.period === RepeatPeriod.DAILY) {
          repeatInterval = repeat.interval;
        }
        if (repeat.period === RepeatPeriod.WEEKLY) {
          repeatInterval = repeat.interval;
          repeatWeekDays = repeat.weekdays;
        }
        if (
          repeat.period === RepeatPeriod.MONTHLY ||
          repeat.period === RepeatPeriod.YEARLY
        ) {
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
  const [currentSegment, setCurrentSegment] = useState<"schedule" | "todo">(
    "schedule"
  );
  const handleModalSegments = (
    segment: { id: string; content: string; isActive: boolean }[]
  ) => {
    const activeSegment = segment.find((s) => s.isActive);
    if (
      activeSegment &&
      (activeSegment.id === "schedule" || activeSegment.id === "todo")
    ) {
      setCurrentSegment(activeSegment.id);
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

  const { updateTodoStatus } = useTodoMutations();

  const handleCheckTodo = (todoId: number) => (v: boolean) => {
    updateTodoStatus.mutate(
      {
        todoId,
        body: { status: v ? "DONE" : "TODO" },
      },
      {
        onSuccess: () => {
          todayTodoQuery.refetch();
        },
      }
    );
  };
  const filteredFlatData = flatData.filter(
    (item) => item.type === currentSegment
  );
  const [selectedItem, setSelectedItem] = useState<
    SchedulesResponse | TodoResponse | null
  >(null);

  const handlePressSchedule = (d: SchedulesResponse) => () => {
    setSelectedItem(d);
  };
  const handlePressTodo = (d: TodoResponse) => () => {
    setSelectedItem(d);
  };
  const translateY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onPanResponderGrant: () => {
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        const next = Math.max(gestureState.dy, 0);
        if (next <= 250) {
          translateY.setValue(next);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80) {
          Animated.timing(translateY, {
            toValue: 400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            translateY.setValue(0);
            closeModal();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const indicatorHandlers = useMemo(
    () => panResponder.panHandlers,
    [panResponder]
  );
  return (
    <Modal
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={closeModal}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={closeModal} />
        <BottomModal.Container style={{ minHeight: 660 }}>
          <BottomModal.Header {...indicatorHandlers}>
            <BottomModal.Indicator />
          </BottomModal.Header>
          <View>
            <NemoText
              level="h1"
              style={{ color: globalGray900, marginBottom: 16 }}
            >
              {formattedDate}
            </NemoText>
            <Segments
              level="l"
              texts={segmentTexts}
              handler={handleModalSegments}
            />
            <FlatList
              data={filteredFlatData}
              contentContainerStyle={{ marginTop: 20 }}
              keyExtractor={(item) => `${item.type}-${item.id}`}
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
                          {
                            backgroundColor:
                              s.representativeColorHex ?? "#BDBDBD",
                          },
                        ]}
                      />
                      <NemoText level="body1">{s.title}</NemoText>
                      <View style={{ marginLeft: "auto" }} />
                      <NemoText level="body3">
                        {isAllDay
                          ? "종일"
                          : `~ ${formatDate(new Date(s.endAt))}`}
                      </NemoText>
                    </Pressable>
                  );
                }

                // todo
                const t = item.data;

                return (
                  <Pressable style={styles.row} onPress={handlePressTodo(t)}>
                    <View
                      style={[
                        styles.border,
                        {
                          backgroundColor:
                            t.representativeColorHex ?? "#BDBDBD",
                        },
                      ]}
                    />
                    <NemoText level="body1">{t.title}</NemoText>
                    <View style={{ marginLeft: "auto" }} />
                    <Checkbox
                      value={t.status == "DONE"}
                      handler={handleCheckTodo(t.id)}
                    />
                  </Pressable>
                );
              }}
            />
          </View>
        </BottomModal.Container>
      </View>
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
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000040",
  },
  backdrop: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 4,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  border: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
});

export default ScheduleListModal;
