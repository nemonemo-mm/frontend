import { SchedulesResponse } from "@/features/calendar/types/schedule.model";
import { TodoResponse } from "@/features/calendar/types/todo.model";
import { usePositions } from "@/features/position/hooks/usePositions";
import { useTeamList } from "@/features/team/hooks/useTeamList";
import {
  toMemberChip,
  useTeamMembers,
} from "@/features/team/hooks/useTeamMembers";
import {
  CalendarFormContext,
  createInitialState,
  InitialCalendarState,
} from "@/shared/hooks/useCalendarForm";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  globalGray0,
  globalGray200,
  globalGray400,
  globalGray600,
  globalGray700,
  globalGray900,
  globalGreen700,
  globalSpacingMd,
  globalSpacingSm,
  globalSpacingXs,
} from "..";
import NemoText from "../atoms/NemoText";
import Segments from "../molecules/Segments";
import AlertModal from "../organisms/AlertModal";
import BottomModal from "../organisms/BottomModal";
import CalendarScheduleForm from "../organisms/CalendarScheduleForm";
import CalendarTodoForm from "../organisms/CalendarTodoForm";

interface CalendarModalProps {
  teamId: number;
  type?: "schedule" | "todo";
  data?: SchedulesResponse | TodoResponse;
  selectedDate: Date;
  confirmModal: (data: {
    id: "schedule" | "todo";
    state: InitialCalendarState;
  }) => void;
  closeModal: () => void;
}
const toStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0);

const addHours = (date: Date, hours: number) =>
  new Date(date.getTime() + hours * 60 * 60 * 1000);
const toEndOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);

export const reducer = (
  state: InitialCalendarState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "SET_ISALLDAY": {
      const isAllDay = action.payload;

      if (!isAllDay) {
        return { ...state, isAllDay };
      }

      const startOfDay = toStartOfDay(state.start);

      return {
        ...state,
        isAllDay,
        start: startOfDay,
        end: toEndOfDay(startOfDay),
      };
    }

    case "SET_START": {
      const nextStart: Date = action.payload;
      let nextEnd = state.end;

      // 종료가 시작보다 빠르면 → 시작 + 1시간
      if (nextEnd < nextStart) {
        nextEnd = addHours(nextStart, 1);
      }

      return {
        ...state,
        start: nextStart,
        end: nextEnd,
      };
    }

    case "SET_END": {
      const nextEnd: Date = action.payload;

      // 종료가 시작보다 빠르면 → 시작 + 1시간
      if (nextEnd < state.start) {
        return {
          ...state,
          start: addHours(state.end, 0),
          end: nextEnd,
        };
      }

      return {
        ...state,
        end: nextEnd,
      };
    }

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
    case "RESET":
      return action.payload;

    default:
      return state;
  }
};

const DEFAULT_TEAM_MESSAGE = "아직 생성된 팀이 없습니다";
const CLOSE_MESSAGE = "닫기";

const CalendarModal = ({
  teamId,
  type = "schedule",
  data,
  selectedDate,
  confirmModal,
  closeModal,
}: CalendarModalProps) => {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(
    data?.teamId ?? teamId
  );
  const positionQuery = usePositions(selectedTeamId);

  const personQuery = useTeamMembers(selectedTeamId);
  const members = personQuery.data?.members?.map((member) =>
    toMemberChip(member)
  );
  const initialState = createInitialState({
    data,
    type,
    persons: members ?? [],
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

  useEffect(() => {
    if (!selectedTeamId) return;

    dispatch({
      type: "RESET",
      payload: createInitialState({
        data,
        type,
        positions: positionQuery.data ?? [],
        persons: members ?? [],
        selectedDate,
      }),
    });
  }, [selectedTeamId]);

  const [isTitleWritten, setIsTitleWritten] = useState(true);

  const handleConfirmModal = () => {
    if (!state.title) {
      setIsTitleWritten(false);
      return;
    }
    const newData = {
      id: currentSegment,
      state,
    };
    confirmModal(newData);
    closeModal();
  };

  const [isOpenTeamList, setIsOpenTeamList] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const animateIcon = (toValue: number) =>
    Animated.timing(rotation, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();

  const handleToggleTeamList = () => {
    animateIcon(!isOpenTeamList ? 1 : 0);

    setIsOpenTeamList(true);
  };
  const teamLists = useTeamList().data;
  const handlePressTeam = (id: number) => () => {
    animateIcon(!isOpenTeamList ? 1 : 0);
    setSelectedTeamId(id);
    setIsOpenTeamList(false);
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };
  return (
    <Modal transparent animationType="slide" onRequestClose={closeModal}>
      <View style={style.backdrop}>
        <BottomModal.Container style={{ height: 780 }}>
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
          <ScrollView>
            <View style={style.container}>
              <Pressable
                onPress={handleToggleTeamList}
                style={style.optionContainer}
              >
                {selectedTeamId ? (
                  <NemoText level="body2" style={{ color: globalGray900 }}>
                    {
                      teamLists?.find((list) => list.teamId == selectedTeamId)
                        ?.teamName
                    }
                  </NemoText>
                ) : (
                  <NemoText level="body2" style={{ color: globalGray900 }}>
                    팀을 선택해주세요
                  </NemoText>
                )}
                <Animated.View style={animatedStyle}>
                  <AntDesign name="down" size={16} color={globalGray700} />
                </Animated.View>
              </Pressable>
            </View>
            <View style={style.container}>
              <View style={style.optionContainer}>
                <TextInput
                  editable={!!selectedTeamId}
                  placeholderTextColor={
                    !selectedTeamId ? globalGray400 : globalGray600
                  }
                  value={state.title}
                  onChangeText={(text: string) =>
                    dispatch({ type: "SET_TITLE", payload: text })
                  }
                  placeholder={"제목을 입력하세요"}
                  style={[style.input]}
                />
              </View>
            </View>
            <CalendarFormContext.Provider
              value={{
                state,
                dispatch,
                readonly: !selectedTeamId,
                teamId: selectedTeamId,
              }}
            >
              {currentSegment == "schedule" ? (
                <CalendarScheduleForm />
              ) : (
                <CalendarTodoForm />
              )}
            </CalendarFormContext.Provider>
          </ScrollView>
        </BottomModal.Container>
        {isOpenTeamList && (
          <Modal
            transparent
            visible={isOpenTeamList}
            animationType="fade"
            onRequestClose={() => setIsOpenTeamList(false)}
          >
            <Pressable
              style={style.modalBackdrop}
              onPress={() => setIsOpenTeamList(false)}
            >
              <View style={style.modalContainer}>
                <FlatList
                  data={teamLists}
                  keyExtractor={(item) => item.teamId.toString()}
                  renderItem={({ item }) => (
                    <Pressable onPress={handlePressTeam(item.teamId)}>
                      <View style={[style.link, style.list]}>
                        <NemoText
                          level="body2"
                          style={{ color: globalGray900 }}
                        >
                          {item.teamName}
                        </NemoText>
                      </View>
                      <View style={style.border} />
                    </Pressable>
                  )}
                  ListFooterComponent={() => (
                    <Pressable
                      onPress={() => setIsOpenTeamList(false)}
                      style={[style.link, style.list]}
                    >
                      <NemoText level="body2" style={{ color: globalGray400 }}>
                        {CLOSE_MESSAGE}
                      </NemoText>
                    </Pressable>
                  )}
                  ListEmptyComponent={
                    <View style={{ padding: 20, alignItems: "center" }}>
                      <NemoText level="body2" style={{ color: globalGray400 }}>
                        {DEFAULT_TEAM_MESSAGE}
                      </NemoText>
                    </View>
                  }
                  style={style.modalList}
                  contentContainerStyle={style.listContainer}
                  scrollEnabled={!!teamLists?.length && teamLists.length > 6}
                />
              </View>
            </Pressable>
          </Modal>
        )}
        <AlertModal
          visible={!isTitleWritten}
          onClose={() => setIsTitleWritten(true)}
        >
          <AlertModal.Title>제목을 입력해주세요</AlertModal.Title>
          <AlertModal.Actions
            type="single"
            confirmLabel="돌아가기"
            onConfirm={() => setIsTitleWritten(true)}
          />
        </AlertModal>
      </View>
    </Modal>
  );
};
const style = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000040",
  },
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
  border: {
    height: 1,
    backgroundColor: globalGray200,
  },
  linkContainer: {
    borderRadius: globalSpacingSm,
    backgroundColor: globalGray0,
    marginBottom: globalSpacingMd,
    overflow: "hidden",
  },
  link: {
    paddingHorizontal: globalSpacingXs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: globalGray0,
    height: 48,
  },
  listContainer: {},

  list: {
    justifyContent: "center",
    width: "100%",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  modalContainer: {
    width: "90%",
    backgroundColor: globalGray0,
    borderRadius: globalSpacingSm,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalList: {
    maxHeight: 400,
  },
});

export default CalendarModal;
