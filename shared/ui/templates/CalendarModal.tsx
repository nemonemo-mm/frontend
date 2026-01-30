import { SchedulesResponse } from "@/features/calendar/types/schedule.model";
import { TodoResponse } from "@/features/calendar/types/todo.model";
import { usePositions } from "@/features/position/hooks/usePositions";
import {
  CalendarFormContext,
  createInitialState,
  InitialCalendarState,
} from "@/shared/hooks/useCalendarForm";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useReducer, useState } from "react";
import { Modal, StyleSheet, TextInput, View } from "react-native";
import {
  globalGray200,
  globalGray600,
  globalGray700,
  globalGreen700,
  globalSpacingXs,
} from "..";
import Segments from "../molecules/Segments";
import BottomModal from "../organisms/BottomModal";
import CalendarScheduleForm from "../organisms/CalendarScheduleForm";
import CalendarTodoForm from "../organisms/CalendarTodoForm";

interface CalendarModalProps {
  type?: "schedule" | "todo";
  data?: SchedulesResponse | TodoResponse;
  selectedDate: Date;
  confirmModal: (data: {
    id: "schedule" | "todo";
    state: InitialCalendarState;
  }) => void;
  closeModal: () => void;
}

export const reducer = (
  state: InitialCalendarState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "SET_ISALLDAY":
      return { ...state, isAllDay: action.payload };
    case "SET_START":
      return { ...state, start: action.payload };
    case "SET_END":
      return { ...state, end: action.payload };
    case "SET_PERSON":
      return { ...state, person: action.payload };
    case "SET_POSITION":
      return { ...state, position: action.payload };
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_ALARM":
      return { ...state, alarm: action.payload };
    case "SET_REPEAT":
      return { ...state, repeat: action.payload };
    case "SET_MEMO":
      return { ...state, description: action.payload };
    case "SET_URL":
      return { ...state, url: action.payload };
    default:
      return state;
  }
};

const CalendarModal = ({
  type = "schedule",
  data,
  selectedDate,
  confirmModal,
  closeModal,
}: CalendarModalProps) => {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const positionQuery = usePositions(parseInt(teamId));
  const initialState = createInitialState({
    data,
    type,
    positions: positionQuery.data ?? [],
    selectedDate,
  });
  const segmentTexts = [
    {
      id: "schedule",
      content: "캘린더",
      isActive: type == "schedule",
    },
    {
      id: "todo",
      content: "투두",
      isActive: type == "todo",
    },
  ];
  const [currentSegment, setCurrentSegment] = useState<"schedule" | "todo">(
    type
  );

  const [state, dispatch] = useReducer(reducer, initialState);

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

  const handleConfirmModal = () => {
    const newData = {
      id: currentSegment,
      state,
    };
    confirmModal(newData);
    closeModal();
  };
  return (
    <Modal backdropColor={globalGray700 + "40"} animationType="slide">
      <BottomModal.Container style={{ minHeight: 660 }}>
        <BottomModal.Header>
          <BottomModal.LeftButton onPress={closeModal}>
            <AntDesign name="close" size={20} color={globalGray700} />
          </BottomModal.LeftButton>
          <BottomModal.RightButton onPress={handleConfirmModal}>
            <EvilIcons name="plus" size={30} color={globalGreen700} />
          </BottomModal.RightButton>
        </BottomModal.Header>
        <Segments
          level="l"
          texts={segmentTexts}
          handler={handleModalSegments}
        />
        <View>
          <View style={style.container}>
            <View style={style.optionContainer}>
              <TextInput
                placeholderTextColor={globalGray600}
                value={state.title}
                onChangeText={(text: string) =>
                  dispatch({ type: "SET_TITLE", payload: text })
                }
                placeholder="제목을 입력하세요"
                style={[style.input]}
              />
            </View>
          </View>
          <CalendarFormContext.Provider value={{ state, dispatch }}>
            {currentSegment == "schedule" ? (
              <CalendarScheduleForm />
            ) : (
              <CalendarTodoForm />
            )}
          </CalendarFormContext.Provider>
        </View>
      </BottomModal.Container>
    </Modal>
  );
};
const style = StyleSheet.create({
  container: {
    borderRadius: globalSpacingXs,
    borderWidth: 1,
    borderColor: globalGray200,
    overflow: "hidden",
    marginTop: 12,
  },
  optionContainer: {
    flexDirection: "row",
    height: 48,
    paddingHorizontal: 8,
    borderBottomColor: globalGray200,
    borderBottomWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionInput: {
    paddingHorizontal: 0,
  },
  input: {
    fontFamily: "Pretendard-Regular",
    fontWeight: "400",
    fontSize: 14,
    flex: 1, // 컨테이너의 남은 가로 공간을 다 사용
    marginLeft: 12,
    letterSpacing: 0,
    paddingVertical: 0,
  },
  row: {
    flexDirection: "row",
  },
  btn: {
    borderRadius: globalSpacingXs,
    backgroundColor: globalGray200 + "60",
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginLeft: 6,
  },
});

export default CalendarModal;
