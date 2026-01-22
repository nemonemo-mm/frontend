import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { globalGray700, globalGreen700 } from "..";
import Checkbox from "../atoms/Checkbox";
import NemoDayButton, { WeekDayType } from "../molecules/NemoDayButton";
import NemoTextLabel from "../molecules/NemoTextLabel";
import Segments from "../molecules/Segments";
import { TabsText } from "../molecules/Tabs";
import BottomModal from "../organisms/BottomModal";
import DateButton from "../organisms/DateButton";
import RepeatCount from "../organisms/RepeatCount";
import DateModal from "./DateModal";
type Data = {
  repeatableCounts: number;
  repeatableChecked: boolean;
  activeWeekday: WeekDayType[];
  endAt: Date;
};

export type RepeatState =
  | {
      period: "daily";
      interval: number;
      endAt: Date;
    }
  | {
      period: "weekly";
      interval: number;
      weekdays: WeekDayType[];
      endAt: Date;
    }
  | {
      period: "monthly";
      useDate: boolean;
      endAt: Date;
    }
  | {
      period: "yearly";
      useDate: boolean;
      endAt: Date;
    };

interface RepeatModalProps {
  initialValue: RepeatState | null;
  closeModal: () => void;
  confirmModal: (data: RepeatState) => void;
}

type SegmentType = "daily" | "weekly" | "monthly" | "yearly";
const segmentTexts = [
  { id: "daily", content: "매일", isActive: true },
  { id: "weekly", content: "매주", isActive: false },
  { id: "monthly", content: "매달", isActive: false },
  { id: "yearly", content: "매년", isActive: false },
];

const convertInitialValue = (v: RepeatState | null): RepeatState => {
  if (v == null)
    return {
      period: "daily",
      interval: 0,
      endAt: new Date(Date.now()),
    };
  return v;
};

const RepeatModal = ({
  initialValue,
  closeModal,
  confirmModal,
}: RepeatModalProps) => {
  const [repeatState, setRepeatState] = useState<RepeatState>(() =>
    convertInitialValue(initialValue)
  );

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleSegments = (texts: TabsText[]) => {
    const period = texts.find((t) => t.isActive)!.id as SegmentType;

    setRepeatState((prev) => {
      switch (period) {
        case "daily":
          return { period, interval: 1, endAt: prev.endAt };
        case "weekly":
          return { period, interval: 1, weekdays: [], endAt: prev.endAt };
        case "monthly":
          return { period, useDate: false, endAt: prev.endAt };
        case "yearly":
          return { period, useDate: false, endAt: prev.endAt };
      }
    });
  };

  const handlePressDate = () => {
    setIsOpenModal(true);
  };

  const handleConfirmModal = () => {
    confirmModal(repeatState);
    closeModal();
  };
  return (
    <Modal backdropColor={globalGray700 + "20"} animationType="slide">
      <BottomModal.Container>
        <BottomModal.Header>
          <BottomModal.LeftButton onPress={closeModal}>
            <AntDesign name="close" size={20} color={globalGray700} />
          </BottomModal.LeftButton>
          <BottomModal.Title>반복</BottomModal.Title>
          <BottomModal.RightButton onPress={handleConfirmModal}>
            <AntDesign name="check" size={20} color={globalGreen700} />
          </BottomModal.RightButton>
        </BottomModal.Header>
        <View style={style.container}>
          <Segments level="m" texts={segmentTexts} handler={handleSegments} />
          {repeatState.period == "daily" && (
            <RepeatCount
              unit="일"
              count={repeatState.interval}
              setCount={(v) =>
                setRepeatState((prev) =>
                  prev.period === "daily"
                    ? { ...prev, interval: Number(v) }
                    : prev
                )
              }
            />
          )}
          {repeatState.period == "weekly" && (
            <View>
              <View style={[style.row, style.weekdayContainer]}>
                {["월", "화", "수", "목", "금", "토", "일"].map((t, i) => (
                  <NemoDayButton
                    key={t + i}
                    weekday={t as WeekDayType}
                    isActive={repeatState.weekdays.includes(t as WeekDayType)}
                    onPress={(t) =>
                      setRepeatState((prev) =>
                        prev.period === "weekly"
                          ? {
                              ...prev,
                              weekdays: prev.weekdays.includes(t)
                                ? prev.weekdays.filter((d) => d !== t)
                                : [...prev.weekdays, t],
                            }
                          : prev
                      )
                    }
                  />
                ))}
              </View>
              <RepeatCount
                unit="주"
                count={repeatState.interval}
                setCount={(v) =>
                  setRepeatState((prev) =>
                    prev.period === "daily"
                      ? { ...prev, interval: Number(v) }
                      : prev
                  )
                }
              />
            </View>
          )}
          {repeatState.period == "monthly" && (
            <View style={style.repeatContainer}>
              <NemoTextLabel>
                매달 {repeatState.endAt.getDate()}일에 반복
              </NemoTextLabel>
              <Checkbox
                value={repeatState.useDate}
                handler={() =>
                  setRepeatState((prev) =>
                    prev.period == "monthly"
                      ? { ...prev, useDate: !prev.useDate }
                      : prev
                  )
                }
              />
            </View>
          )}
          {repeatState.period == "yearly" && (
            <View style={style.repeatContainer}>
              <NemoTextLabel>
                매년 {repeatState.endAt.getMonth() + 1}월{" "}
                {repeatState.endAt.getDate()}일에 반복
              </NemoTextLabel>
              <Checkbox
                value={repeatState.useDate}
                handler={() =>
                  setRepeatState((prev) =>
                    prev.period == "monthly"
                      ? { ...prev, useDate: !prev.useDate }
                      : prev
                  )
                }
              />
            </View>
          )}
        </View>
        <View style={style.repeatContainer}>
          <NemoTextLabel>반복 종료일</NemoTextLabel>
          <DateButton
            selectedDate={repeatState.endAt}
            handlePressDate={handlePressDate}
          />
        </View>
      </BottomModal.Container>
      {isOpenModal && (
        <DateModal
          initialValue={repeatState.endAt}
          closeModal={() => setIsOpenModal(false)}
          confirmModal={(date) => {
            setRepeatState((prev) => ({
              ...prev,
              endAt: date,
            }));
          }}
        />
      )}
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
