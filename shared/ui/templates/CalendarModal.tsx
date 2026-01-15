import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { useReducer, useState } from "react";
import { Modal, StyleSheet, TextInput, View } from "react-native";
import {
  globalGray200,
  globalGray600,
  globalGray700,
  globalGreen700,
  globalSpacingXs,
} from "..";
import Toggle from "../atoms/Toggle";
import NemoTextLabel from "../molecules/NemoTextLabel";
import Segments from "../molecules/Segments";
import { TabsText } from "../molecules/Tabs";
import BottomModal from "../organisms/BottomModal";
import DateButton from "../organisms/DateButton";
import TimeButton from "../organisms/TimeButton";

interface CalendarModalProps {
  closeModal: () => void;
}
const segmentTexts = [
  {
    id: "calendar",
    content: "캘린더",
    isActive: true,
  },
  {
    id: "todo",
    content: "투두",
    isActive: false,
  },
];

const today = new Date(Date.now());

const initialState = {
  startAt: today,
  startAtTime: { hour: 0, min: 0 },
  endAt: today,
  endAtTime: { hour: 0, min: 0 },
  title: "",
};

const reducer = (
  state: typeof initialState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "SET_START_DATE":
      return { ...state, startAt: action.payload };
    case "SET_SELECTED_TIME":
    case "SET_TITLE":
      return { ...state, title: action.payload };
    default:
      return state;
  }
};
const CalendarModal = ({ closeModal }: CalendarModalProps) => {
  const [currentSegment, setCurrentSegment] = useState("calendar");

  const [state, dispatch] = useReducer(reducer, initialState);
  const { startAt, startAtTime, endAt, endAtTime } = state;
  const handleModalSegments = (segment: TabsText[]) => {
    setCurrentSegment(segment.find((s) => s.isActive)!.id);
  };
  const handlePressDate = () => {};
  const handlePressTime = () => {};
  return (
    <Modal backdropColor={globalGray700 + "05"} animationType="slide">
      <BottomModal.Container>
        <BottomModal.Header>
          <BottomModal.LeftButton onPress={closeModal}>
            <AntDesign name="close" size={20} color={globalGray700} />
          </BottomModal.LeftButton>
          <BottomModal.RightButton>
            <EvilIcons name="plus" size={30} color={globalGreen700} />
          </BottomModal.RightButton>
        </BottomModal.Header>
        <Segments
          level="l"
          texts={segmentTexts}
          handler={handleModalSegments}
        />
        <View>
          {currentSegment == "calendar" ? (
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
                  <NemoTextLabel>종일</NemoTextLabel>
                  <Toggle value={false} />
                </View>
                <View style={style.optionContainer}>
                  <NemoTextLabel>시작일</NemoTextLabel>
                  <View style={style.row}>
                    <DateButton
                      selectedDate={startAt}
                      handlePressDate={handlePressDate}
                    />
                    <TimeButton
                      selectedTime={startAtTime}
                      handlePressTime={handlePressTime}
                    />
                  </View>
                </View>
                <View style={style.optionContainer}>
                  <NemoTextLabel>종료일</NemoTextLabel>
                  <View style={style.row}>
                    <DateButton
                      selectedDate={endAt}
                      handlePressDate={handlePressDate}
                    />
                    <TimeButton
                      selectedTime={endAtTime}
                      handlePressTime={handlePressTime}
                    />
                  </View>
                </View>
              </View>
              <View style={style.container}>
                <View style={style.optionContainer}>
                  <NemoTextLabel>알림</NemoTextLabel>
                  <NemoTextLabel>지정없음</NemoTextLabel>
                </View>
                <View style={style.optionContainer}>
                  <NemoTextLabel>반복</NemoTextLabel>
                  <NemoTextLabel>끔</NemoTextLabel>
                </View>
              </View>
              <View style={style.container}>
                <View style={style.optionContainer}>
                  <NemoTextLabel>참석자</NemoTextLabel>
                  <NemoTextLabel>지정없음</NemoTextLabel>
                </View>
                <View style={style.optionContainer}>
                  <NemoTextLabel>포지션</NemoTextLabel>
                  <NemoTextLabel>지정없음</NemoTextLabel>
                </View>
                <View style={[style.optionContainer, style.optionInput]}>
                  <TextInput
                    placeholderTextColor={globalGray600}
                    placeholder="메모를 남겨주세요"
                    style={[style.input]}
                  />
                </View>
                <View style={[style.optionContainer, style.optionInput]}>
                  <TextInput
                    placeholderTextColor={globalGray600}
                    placeholder="관련 링크를 추가해 보세요"
                    style={[style.input]}
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
                      handlePressDate={handlePressDate}
                    />
                    <TimeButton
                      selectedTime={endAtTime}
                      handlePressTime={handlePressTime}
                    />
                  </View>
                </View>
              </View>
              <View style={style.container}>
                <View style={style.optionContainer}>
                  <NemoTextLabel>참석자</NemoTextLabel>
                  <NemoTextLabel>지정없음</NemoTextLabel>
                </View>
                <View style={style.optionContainer}>
                  <NemoTextLabel>포지션</NemoTextLabel>
                  <NemoTextLabel>지정없음</NemoTextLabel>
                </View>
              </View>
            </View>
          )}
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
