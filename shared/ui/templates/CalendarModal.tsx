import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { useReducer, useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import {
  globalGray200,
  globalGray600,
  globalGray700,
  globalGreen700,
  globalSpacingXs,
} from "..";
import NemoText from "../atoms/NemoText";
import Toggle from "../atoms/Toggle";
import NemoTextLabel from "../molecules/NemoTextLabel";
import Segments from "../molecules/Segments";
import { TabsText } from "../molecules/Tabs";
import BottomModal from "../organisms/BottomModal";
import DateButton from "../organisms/DateButton";
import TimeButton from "../organisms/TimeButton";
import AlarmModal, { AlarmState } from "./AlarmModal";
import DateModal from "./DateModal";
import PersonPositionModal from "./PersonPositionModal";
import RepeatModal, { RepeatState } from "./RepeatModal";
import TimeModal from "./TimeModal";

interface CalendarModalProps {
  selectedDate: Date;
  positions: TabsText[];
  confirmModal: (data: { id: string; state: InitialState }) => void;
  closeModal: () => void;
}

type WhichModalType =
  | { type: ""; target: ""; initialValue: null }
  | { type: "date"; target: "startAt" | "endAt"; initialValue: Date }
  | {
      type: "time";
      target: "startAtTime" | "endAtTime";
      initialValue: { hour: number; min: number };
    }
  | { type: "repeat"; target: "repeat"; initialValue: RepeatState | null }
  | { type: "alarm"; target: "alarm"; initialValue: AlarmState | null }
  | { type: "person"; target: "person"; initialValue: TabsText[] }
  | { type: "position"; target: "position"; initialValue: TabsText[] };

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
export interface InitialState {
  isAllDay: boolean;
  startAt: Date;
  startAtTime: { hour: number; min: number };
  endAt: Date;
  endAtTime: { hour: number; min: number };
  person: TabsText[];
  position: TabsText[];
  repeat: RepeatState | null;
  alarm: AlarmState | null;

  title: string;
  description: string;
  url: string;
}

const reducer = (
  state: InitialState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "SET_ISALLDAY":
      return { ...state, isAllDay: action.payload };
    case "SET_START_DATE":
      return { ...state, startAt: action.payload };
    case "SET_START_TIME":
      return { ...state, startAtTime: action.payload };
    case "SET_END_DATE":
      return { ...state, endAt: action.payload };
    case "SET_END_TIME":
      return { ...state, endAtTime: action.payload };
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

const formatRepeat = (repeat: RepeatState): string => {
  if (!repeat) return "지정없음";

  const { period, endAt } = repeat;
  const endDate = `${endAt.getFullYear()}년 ${endAt.getMonth() + 1}월 ${endAt.getDate()}일`;
  let result: string;
  switch (period) {
    case "daily":
      result = `${repeat.interval}일 간격으로 ${endDate}까지 반복`;
      break;
    case "weekly":
      result = `${repeat.weekdays.join(", ")}요일에 ${repeat.interval}주 간격으로 ${endDate}까지 반복`;
      break;
    case "monthly":
      result = `${repeat.useDate ? "매월 " : ""}${endDate}까지 반복`;
      break;
    case "yearly":
      result = `${repeat.useDate ? "매년 " : ""}${endDate}까지 반복`;
      break;
    default:
      result = "지정없음";
  }

  return result;
};

export const formatAlarm = (alarm: AlarmState | null) => {
  let result: string = "";
  if (!alarm || alarm.off) result = "끔";
  else if (alarm.ten) result = "10분전";
  else if (alarm.thirty) result = "30분전";
  else if (alarm.sixty) result = "1시간전";
  return result;
};

const CalendarModal = ({
  selectedDate,
  positions,
  confirmModal,
  closeModal,
}: CalendarModalProps) => {
  const initialState: InitialState = {
    isAllDay: false,
    startAt: selectedDate,
    startAtTime: { hour: 0, min: 0 },
    endAt: selectedDate,
    endAtTime: { hour: 0, min: 0 },
    person: [],
    position: positions,
    repeat: null,
    alarm: null,
    title: "",
    description: "",
    url: "",
  };

  const [currentSegment, setCurrentSegment] = useState("schedule");

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    isAllDay,
    startAt,
    startAtTime,
    endAt,
    endAtTime,
    person,
    position,
    repeat,
    alarm,
    title,
    description,
    url,
  } = state as InitialState;

  const repeatLabel = repeat ? formatRepeat(repeat) : "지정없음";
  const alarmLabel = alarm ? formatAlarm(alarm) : "지정없음";
  const personLabel =
    person.filter((per) => per.isActive).length > 0
      ? person.filter((per) => per.isActive).length
      : "지정없음";
  const positionLabel =
    position.filter((pos) => pos.isActive).length > 0
      ? position.filter((pos) => pos.isActive).length
      : "지정없음";
  const handleModalSegments = (
    segment: { id: string; content: string; isActive: boolean }[]
  ) => {
    setCurrentSegment(segment.find((s) => s.isActive)!.id);
  };

  //모달 온/오프

  const [whichOpenModal, setWhichOpenModal] = useState<WhichModalType>({
    target: "",
    type: "",
    initialValue: null,
  });

  const handleCloseInnerModal = () => {
    setWhichOpenModal({ target: "", type: "", initialValue: null });
  };

  const handlePressStartDate = () => {
    setWhichOpenModal({
      type: "date",
      target: "startAt",
      initialValue: startAt,
    });
  };
  const handlePressEndDate = () => {
    setWhichOpenModal({ type: "date", target: "endAt", initialValue: endAt });
  };
  const handlePressStartTime = () => {
    if (isAllDay) return;
    setWhichOpenModal({
      type: "time",
      target: "startAtTime",
      initialValue: startAtTime,
    });
  };
  const handlePressEndTime = () => {
    if (isAllDay) return;
    setWhichOpenModal({
      type: "time",
      target: "endAtTime",
      initialValue: endAtTime,
    });
  };

  const handleConfirmModal = () => {
    const data = {
      id: currentSegment,
      state,
    };
    confirmModal(data);
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
          {currentSegment == "schedule" ? (
            <View>
              <View style={style.container}>
                <View style={style.optionContainer}>
                  <TextInput
                    placeholderTextColor={globalGray600}
                    value={title}
                    onChangeText={(text: string) =>
                      dispatch({ type: "SET_TITLE", payload: text })
                    }
                    placeholder="제목을 입력하세요"
                    style={[style.input]}
                  />
                </View>
              </View>
              <View style={style.container}>
                <View style={style.optionContainer}>
                  <NemoTextLabel>종일</NemoTextLabel>
                  <Toggle
                    value={isAllDay}
                    handler={(result) => {
                      dispatch({ type: "SET_ISALLDAY", payload: result });
                    }}
                  />
                </View>
                <View style={style.optionContainer}>
                  <NemoTextLabel>시작일</NemoTextLabel>
                  <View style={style.row}>
                    <DateButton
                      disabled={isAllDay}
                      selectedDate={startAt}
                      handlePressDate={handlePressStartDate}
                    />
                    <TimeButton
                      disabled={isAllDay}
                      selectedTime={startAtTime}
                      handlePressTime={handlePressStartTime}
                    />
                  </View>
                </View>
                <View style={style.optionContainer}>
                  <NemoTextLabel>종료일</NemoTextLabel>
                  <View style={style.row}>
                    <DateButton
                      disabled={isAllDay}
                      selectedDate={endAt}
                      handlePressDate={handlePressEndDate}
                    />
                    <TimeButton
                      disabled={isAllDay}
                      selectedTime={endAtTime}
                      handlePressTime={handlePressEndTime}
                    />
                  </View>
                </View>
              </View>
              <View style={style.container}>
                <View style={style.optionContainer}>
                  <NemoTextLabel>알림</NemoTextLabel>
                  <Pressable
                    onPress={() =>
                      setWhichOpenModal({
                        type: "alarm",
                        target: "alarm",
                        initialValue: alarm,
                      })
                    }
                  >
                    <NemoText level="body3" style={{ color: globalGray700 }}>
                      {alarmLabel}
                    </NemoText>
                  </Pressable>
                </View>
                <View style={style.optionContainer}>
                  <NemoTextLabel>반복</NemoTextLabel>
                  <Pressable
                    onPress={() =>
                      setWhichOpenModal({
                        type: "repeat",
                        target: "repeat",
                        initialValue: repeat,
                      })
                    }
                  >
                    <NemoText level="body3" style={{ color: globalGray700 }}>
                      {repeatLabel}
                    </NemoText>
                  </Pressable>
                </View>
              </View>
              <View style={style.container}>
                <View style={style.optionContainer}>
                  <NemoTextLabel>참석자</NemoTextLabel>
                  <Pressable
                    onPress={() =>
                      setWhichOpenModal({
                        type: "person",
                        target: "person",
                        initialValue: person,
                      })
                    }
                  >
                    <NemoText level="body3" style={{ color: globalGray700 }}>
                      {personLabel}
                    </NemoText>
                  </Pressable>
                </View>
                <View style={style.optionContainer}>
                  <NemoTextLabel>포지션</NemoTextLabel>
                  <Pressable
                    onPress={() =>
                      setWhichOpenModal({
                        type: "position",
                        target: "position",
                        initialValue: position,
                      })
                    }
                  >
                    <NemoText level="body3" style={{ color: globalGray700 }}>
                      {positionLabel}
                    </NemoText>
                  </Pressable>
                </View>
                <View style={[style.optionContainer, style.optionInput]}>
                  <TextInput
                    placeholderTextColor={globalGray600}
                    placeholder="메모를 남겨주세요"
                    style={[style.input]}
                    value={description}
                    onChangeText={(text: string) =>
                      dispatch({ type: "SET_MEMO", payload: text })
                    }
                  />
                </View>
                <View style={[style.optionContainer, style.optionInput]}>
                  <TextInput
                    placeholderTextColor={globalGray600}
                    placeholder="관련 링크를 추가해 보세요"
                    style={[style.input]}
                    value={url}
                    onChangeText={(text: string) =>
                      dispatch({ type: "SET_URL", payload: text })
                    }
                  />
                </View>
              </View>
            </View>
          ) : (
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
              <View style={style.container}>
                <View style={style.optionContainer}>
                  <NemoTextLabel>종료일</NemoTextLabel>
                  <View style={style.row}>
                    <DateButton
                      selectedDate={endAt}
                      handlePressDate={handlePressEndDate}
                    />
                    <TimeButton
                      selectedTime={endAtTime}
                      handlePressTime={handlePressEndTime}
                    />
                  </View>
                </View>
              </View>
              <View style={style.container}>
                <View style={style.optionContainer}>
                  <NemoTextLabel>참석자</NemoTextLabel>
                  <Pressable
                    onPress={() =>
                      setWhichOpenModal({
                        type: "person",
                        target: "person",
                        initialValue: person,
                      })
                    }
                  >
                    <NemoText level="body3" style={{ color: globalGray700 }}>
                      {personLabel}
                    </NemoText>
                  </Pressable>
                </View>
                <View style={style.optionContainer}>
                  <NemoTextLabel>포지션</NemoTextLabel>
                  <Pressable
                    onPress={() =>
                      setWhichOpenModal({
                        type: "position",
                        target: "position",
                        initialValue: position,
                      })
                    }
                  >
                    <NemoText level="body3" style={{ color: globalGray700 }}>
                      {positionLabel}
                    </NemoText>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      </BottomModal.Container>
      {whichOpenModal.type == "time" && (
        <TimeModal
          initialValue={whichOpenModal.initialValue}
          closeModal={handleCloseInnerModal}
          confirmModal={(time) => {
            if (whichOpenModal.target === "startAtTime") {
              dispatch({ type: "SET_START_TIME", payload: time });
            }
            if (whichOpenModal.target === "endAtTime") {
              dispatch({ type: "SET_END_TIME", payload: time });
            }
          }}
        />
      )}
      {whichOpenModal.type == "date" && (
        <DateModal
          initialValue={whichOpenModal.initialValue}
          closeModal={handleCloseInnerModal}
          confirmModal={(date) => {
            if (whichOpenModal.target === "startAt") {
              dispatch({ type: "SET_START_DATE", payload: date });
              if (isAllDay) {
                dispatch({ type: "SET_END_DATE", payload: date });
              }
            }
            if (whichOpenModal.target === "endAt") {
              dispatch({ type: "SET_END_DATE", payload: date });
              if (isAllDay) {
                dispatch({ type: "SET_START_DATE", payload: date });
              }
            }
          }}
        />
      )}
      {whichOpenModal.type == "alarm" && (
        <AlarmModal
          initialValue={whichOpenModal.initialValue}
          closeModal={handleCloseInnerModal}
          confirmModal={(alarmState) =>
            dispatch({ type: "SET_ALARM", payload: alarmState })
          }
        />
      )}
      {whichOpenModal.type == "repeat" && (
        <RepeatModal
          initialValue={whichOpenModal.initialValue}
          closeModal={handleCloseInnerModal}
          confirmModal={(repeatState) => {
            dispatch({ type: "SET_REPEAT", payload: repeatState });
          }}
        />
      )}
      {whichOpenModal.type == "person" && (
        <PersonPositionModal
          initialValue={whichOpenModal.initialValue}
          closeModal={handleCloseInnerModal}
          confirmModal={(person) => {
            dispatch({ type: "SET_PERSON", payload: person });
          }}
        />
      )}
      {whichOpenModal.type == "position" && (
        <PersonPositionModal
          initialValue={whichOpenModal.initialValue}
          closeModal={handleCloseInnerModal}
          confirmModal={(position) => {
            dispatch({ type: "SET_POSITION", payload: position });
          }}
        />
      )}
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
