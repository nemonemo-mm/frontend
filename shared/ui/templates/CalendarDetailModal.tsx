import { useScheduleMutations } from "@/features/calendar/hooks/useSchedules";
import { useTodoMutations } from "@/features/calendar/hooks/useTodos";
import { SchedulesResponse } from "@/features/calendar/types/schedule.model";
import { TodoResponse } from "@/features/calendar/types/todo.model";
import { usePositions } from "@/features/position/hooks/usePositions";
import {
  toMemberChip,
  useTeamMembers,
} from "@/features/team/hooks/useTeamMembers";
import {
  CalendarFormContext,
  createInitialState,
  InitialCalendarState,
} from "@/shared/hooks/useCalendarForm";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useReducer, useRef, useState } from "react";
import { Animated, Modal, PanResponder, StyleSheet, View } from "react-native";
import { globalGray700 } from "..";
import NemoText from "../atoms/NemoText";
import AlertModal from "../organisms/AlertModal";
import BottomModal from "../organisms/BottomModal";
import CalendarScheduleForm from "../organisms/CalendarScheduleForm";
import CalendarTodoForm from "../organisms/CalendarTodoForm";
import CalendarModal, { reducer } from "./CalendarModal";

interface CalendarDetailModalProps {
  data: SchedulesResponse | TodoResponse;
  type: "schedule" | "todo";
  selectedDate: Date;
  closeModal: () => void;
  onPatch: (data: {
    id: "schedule" | "todo";
    state: InitialCalendarState;
  }) => void;
}

const CalendarDetailModal = ({
  data,
  type,
  selectedDate,
  closeModal,
  onPatch,
}: CalendarDetailModalProps) => {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const positions = usePositions(parseInt(teamId)).data;
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const personQuery = useTeamMembers(parseInt(teamId));
  const members = personQuery.data?.members?.map((member) =>
    toMemberChip(member)
  );
  const initialState = createInitialState({
    teamId: Number(teamId),
    data,
    type,
    persons: members ?? [],
    positions: positions ?? [],
    selectedDate,
  });
  const [state, dispatch] = useReducer(reducer, initialState);
  const { title } = state;
  const { deleteSchedule } = useScheduleMutations();
  const { deleteTodo } = useTodoMutations();

  const [isClickedDeleteButton, setIsClickedDeleteButton] = useState(false);
  const handleDeleteButton = () => {
    setIsClickedDeleteButton(true);
  };

  const handleConfirmDelete = () => {
    if ("isAllDay" in data) {
      deleteSchedule.mutate({ scheduleId: data.id });
    } else {
      deleteTodo.mutate({ todoId: data.id });
    }
    setIsClickedDeleteButton(false);
    closeModal();
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
    <Modal transparent animationType="slide" onRequestClose={closeModal}>
      <View style={styles.backdrop}>
        <BottomModal.Container style={{ height: "90%" }}>
          <BottomModal.Header {...indicatorHandlers}>
            <BottomModal.LeftButton onPress={handleDeleteButton}>
              <Ionicons name="trash-outline" size={20} color={globalGray700} />
            </BottomModal.LeftButton>
            <BottomModal.Indicator />
            <BottomModal.RightButton
              onPress={() => {
                setIsOpenEditModal(true);
              }}
            >
              <Feather name="edit-2" size={20} color={globalGray700} />
            </BottomModal.RightButton>
          </BottomModal.Header>
          <View>
            <View
              style={[styles.row, { marginVertical: 16, paddingHorizontal: 8 }]}
            >
              <View
                style={{
                  backgroundColor: data.representativeColorHex ?? "#BDBDBD",
                  width: 3,
                  borderRadius: 2,
                  marginRight: 4,
                }}
              />
              <NemoText level="h2">{title}</NemoText>
            </View>
            <CalendarFormContext.Provider
              value={{
                readonly: true,
                state,
                dispatch,
                teamId: parseInt(teamId),
              }}
            >
              {type == "schedule" ? (
                <CalendarScheduleForm />
              ) : (
                <CalendarTodoForm />
              )}
            </CalendarFormContext.Provider>
          </View>
        </BottomModal.Container>
        {isOpenEditModal && (
          <CalendarModal
            teamId={parseInt(teamId)}
            type={type}
            data={data}
            closeModal={() => setIsOpenEditModal(false)}
            confirmModal={onPatch}
            selectedDate={selectedDate}
          />
        )}
        {isClickedDeleteButton && (
          <AlertModal
            visible={isClickedDeleteButton}
            onClose={() => setIsClickedDeleteButton(false)}
          >
            <AlertModal.Title>스케줄 삭제</AlertModal.Title>
            <AlertModal.Text>현재 스케줄을 삭제하시겠어요?</AlertModal.Text>
            <AlertModal.Actions
              type="double"
              cancelLabel="취소하기"
              onCancel={() => setIsClickedDeleteButton(false)}
              confirmLabel="삭제하기"
              onConfirm={handleConfirmDelete}
            />
          </AlertModal>
        )}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000040",
  },
});
export default CalendarDetailModal;
