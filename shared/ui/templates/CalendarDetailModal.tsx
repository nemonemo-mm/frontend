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
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useReducer, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
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
  return (
    <Modal backdropColor={globalGray700 + "40"} animationType="slide">
      <BottomModal.Container style={{ minHeight: 660 }}>
        <BottomModal.Header>
          <BottomModal.LeftButton onPress={closeModal}>
            <AntDesign name="close" size={20} color={globalGray700} />
          </BottomModal.LeftButton>
          <View style={{ marginLeft: "auto", flexDirection: "row", gap: 12 }}>
            <Pressable
              onPress={() => {
                setIsOpenEditModal(true);
              }}
            >
              <Feather name="edit-2" size={20} color={globalGray700} />
            </Pressable>
            <Pressable onPress={handleDeleteButton}>
              <Ionicons name="trash-outline" size={20} color={globalGray700} />
            </Pressable>
          </View>
        </BottomModal.Header>
        <View>
          <View style={styles.row}>
            <View
              style={{
                backgroundColor: data.representativeColorHex,
                width: 1,
                marginRight: 4,
              }}
            />
            <NemoText level="h2">{title}</NemoText>
          </View>
          <CalendarFormContext.Provider
            value={{ readonly: true, state, dispatch }}
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
    </Modal>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});
export default CalendarDetailModal;
