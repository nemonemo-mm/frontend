import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { globalGray700, globalGreen700 } from "..";
import Checkbox from "../atoms/Checkbox";
import Input from "../atoms/Input";
import NemoText from "../atoms/NemoText";
import NemoDayButton, { WeekDayType } from "../molecules/NemoDayButton";
import NemoTextLabel from "../molecules/NemoTextLabel";
import Segments from "../molecules/Segments";
import { TabsText } from "../molecules/Tabs";
import BottomModal from "../organisms/BottomModal";
import DateButton from "../organisms/DateButton";
import DateModal from "./DateModal";

interface RepeatModalProps {
  closeModal: () => void;
}

type SegmentType = "daily" | "weekly" | "monthly" | "yearly";
const segmentTexts = [
  { id: "daily", content: "매일", isActive: true },
  { id: "weekly", content: "매주", isActive: false },
  { id: "monthly", content: "매달", isActive: false },
  { id: "yearly", content: "매년", isActive: false },
];
const RepeatModal = ({ closeModal }: RepeatModalProps) => {
  const [currentSegment, setCurrentSegment] = useState<SegmentType>("daily");

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [activeWeekday, setActiveWeekday] = useState<WeekDayType[]>([]);

  const endAt = new Date(Date.now());
  const handleSegments = (texts: TabsText[]) => {
    setCurrentSegment(texts.find((t) => t.isActive)!.id as SegmentType);
  };
  const handlePressDate = () => {
    setIsOpenModal(true);
  };
  return (
    <Modal backdropColor={globalGray700 + "20"} animationType="slide">
      <BottomModal.Container>
        <BottomModal.Header>
          <BottomModal.LeftButton onPress={closeModal}>
            <AntDesign name="close" size={20} color={globalGray700} />
          </BottomModal.LeftButton>
          <BottomModal.Title>반복</BottomModal.Title>
          <BottomModal.RightButton>
            <AntDesign name="check" size={20} color={globalGreen700} />
          </BottomModal.RightButton>
        </BottomModal.Header>
        <View style={style.container}>
          <Segments level="m" texts={segmentTexts} handler={handleSegments} />
          {currentSegment == "daily" && (
            <View>
              <View style={style.repeatContainer}>
                <NemoTextLabel>지정 간격으로 반복</NemoTextLabel>
                <View style={style.row}>
                  <Input
                    placeholder="0"
                    maxLength={3}
                    inputMode="numeric"
                    textAlign="right"
                  />
                  <NemoText level="body3" style={{ color: globalGray700 }}>
                    일
                  </NemoText>
                </View>
              </View>
              <View style={style.repeatContainer}>
                <NemoTextLabel>반복 종료일</NemoTextLabel>
                <DateButton
                  selectedDate={endAt}
                  handlePressDate={handlePressDate}
                />
              </View>
            </View>
          )}
          {currentSegment == "weekly" && (
            <View>
              <View style={[style.row, style.weekdayContainer]}>
                {["월", "화", "수", "목", "금", "토", "일"].map((t, i) => (
                  <NemoDayButton
                    key={t + i}
                    weekday={t as WeekDayType}
                    isActive={activeWeekday.includes(t as WeekDayType)}
                    onPress={(t) => {
                      setActiveWeekday((prev) => {
                        return prev.includes(t)
                          ? prev.filter((p) => p != t)
                          : [...prev, t];
                      });
                    }}
                  />
                ))}
              </View>
              <View style={style.repeatContainer}>
                <NemoTextLabel>지정 간격으로 반복</NemoTextLabel>
                <View style={style.row}>
                  <Input
                    placeholder="0"
                    maxLength={3}
                    inputMode="numeric"
                    textAlign="right"
                  />
                  <NemoText level="body3" style={{ color: globalGray700 }}>
                    주
                  </NemoText>
                </View>
              </View>
              <View style={style.repeatContainer}>
                <NemoTextLabel>반복 종료일</NemoTextLabel>
                <DateButton
                  selectedDate={endAt}
                  handlePressDate={handlePressDate}
                />
              </View>
            </View>
          )}
          {currentSegment == "monthly" && (
            <View>
              <View style={style.repeatContainer}>
                <NemoTextLabel>매달 {endAt.getDate()}일에 반복</NemoTextLabel>
                <Checkbox value={true} handler={() => {}} />
              </View>
              <View style={style.repeatContainer}>
                <NemoTextLabel>반복 종료일</NemoTextLabel>
                <DateButton
                  selectedDate={endAt}
                  handlePressDate={handlePressDate}
                />
              </View>
            </View>
          )}
          {currentSegment == "yearly" && (
            <View>
              <View style={style.repeatContainer}>
                <NemoTextLabel>
                  매년 {endAt.getMonth() + 1}월 {endAt.getDate()}일에 반복
                </NemoTextLabel>
                <Checkbox value={true} handler={() => {}} />
              </View>
              <View style={style.repeatContainer}>
                <NemoTextLabel>반복 종료일</NemoTextLabel>
                <DateButton
                  selectedDate={endAt}
                  handlePressDate={handlePressDate}
                />
              </View>
            </View>
          )}
        </View>
      </BottomModal.Container>
      {isOpenModal && <DateModal closeModal={() => setIsOpenModal(false)} />}
    </Modal>
  );
};
const style = StyleSheet.create({
  container: {
    gap: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  repeatContainer: {
    height: 48,
    flexDirection: "row",

    paddingHorizontal: 8,
    paddingVertical: 9,
    justifyContent: "space-between",
    alignItems: "center",
  },

  weekdayContainer: {
    overflow: "hidden",
    borderRadius: 4,
    marginBottom: 8,
  },
});
export default RepeatModal;
