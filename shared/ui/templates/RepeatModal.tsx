import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { globalGray700, globalGreen700 } from "..";
import Checkbox from "../atoms/Checkbox";
import NemoDayButton, { WeekDayType } from "../molecules/NemoDayButton";
import NemoTextLabel from "../molecules/NemoTextLabel";
import Segments from "../molecules/Segments";
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

export enum RepeatPeriod {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export type RepeatState =
  | {
      period: RepeatPeriod.DAILY;
      interval: number;
      endAt: Date;
    }
  | {
      period: RepeatPeriod.WEEKLY;
      interval: number;
      weekdays: WeekDayType[];
      endAt: Date;
    }
  | {
      period: RepeatPeriod.MONTHLY;
      useDate: boolean;
      endAt: Date;
    }
  | {
      period: RepeatPeriod.YEARLY;
      useDate: boolean;
      endAt: Date;
    };

interface RepeatModalProps {
  initialValue: RepeatState | null;
  closeModal: () => void;
  confirmModal: (data: RepeatState) => void;
}

const segmentTexts = [
  { id: RepeatPeriod.DAILY, content: "매일", isActive: true },
  { id: RepeatPeriod.WEEKLY, content: "매주", isActive: false },
  { id: RepeatPeriod.MONTHLY, content: "매달", isActive: false },
  { id: RepeatPeriod.YEARLY, content: "매년", isActive: false },
];

const convertInitialValue = (v: RepeatState | null): RepeatState => {
  if (v == null)
    return {
      period: RepeatPeriod.DAILY,
      interval: 0,
      endAt: new Date(Date.now()),
    };
  return v;
};

const handleDailyRepeat = (prev: RepeatState): RepeatState => ({
  period: RepeatPeriod.DAILY,
  interval: 1,
  endAt: prev.endAt,
});

const handleWeeklyRepeat = (prev: RepeatState): RepeatState => ({
  period: RepeatPeriod.WEEKLY,
  interval: 1,
  weekdays: [],
  endAt: prev.endAt,
});

const handleMonthlyRepeat = (prev: RepeatState): RepeatState => ({
  period: RepeatPeriod.MONTHLY,
  useDate: false,
  endAt: prev.endAt,
});

const handleYearlyRepeat = (prev: RepeatState): RepeatState => ({
  period: RepeatPeriod.YEARLY,
  useDate: false,
  endAt: prev.endAt,
});

const RepeatModal = ({
  initialValue,
  closeModal,
  confirmModal,
}: RepeatModalProps) => {
  const [repeatState, setRepeatState] = useState<RepeatState>(() =>
    convertInitialValue(initialValue)
  );

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleSegments = (
    texts: { id: string; content: string; isActive: boolean }[]
  ) => {
    const activeSegment = texts.find((t) => t.isActive);
    const period = activeSegment
      ? (activeSegment.id as RepeatPeriod)
      : RepeatPeriod.DAILY;
    const updateRepeatState = (prev: RepeatState): RepeatState => {
      switch (period) {
        case RepeatPeriod.DAILY:
          return handleDailyRepeat(prev);
        case RepeatPeriod.WEEKLY:
          return handleWeeklyRepeat(prev);
        case RepeatPeriod.MONTHLY:
          return handleMonthlyRepeat(prev);
        case RepeatPeriod.YEARLY:
          return handleYearlyRepeat(prev);
      }
    };

    setRepeatState(updateRepeatState);
  };

  const handlePressDate = () => {
    setIsOpenModal(true);
  };

  const handleConfirmModal = () => {
    confirmModal(repeatState);
    closeModal();
  };
  return (
    <Modal
      transparent
      backdropColor={globalGray700 + "20"}
      animationType="slide"
    >
      <View style={style.backdrop}>
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
            {repeatState.period === RepeatPeriod.DAILY && (
              <RepeatCount
                unit="일"
                count={repeatState.interval}
                setCount={(v) =>
                  setRepeatState((prev) =>
                    prev.period === RepeatPeriod.DAILY
                      ? { ...prev, interval: Number(v) }
                      : prev
                  )
                }
              />
            )}
            {repeatState.period === RepeatPeriod.WEEKLY && (
              <View>
                <View style={[style.row, style.weekdayContainer]}>
                  {["월", "화", "수", "목", "금", "토", "일"].map((t, i) => (
                    <NemoDayButton
                      key={t + i}
                      weekday={t as WeekDayType}
                      isActive={repeatState.weekdays.includes(t as WeekDayType)}
                      onPress={(t) =>
                        setRepeatState((prev) =>
                          prev.period === RepeatPeriod.WEEKLY
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
                      prev.period === RepeatPeriod.WEEKLY
                        ? { ...prev, interval: Number(v) }
                        : prev
                    )
                  }
                />
              </View>
            )}
            {repeatState.period === RepeatPeriod.MONTHLY && (
              <View style={style.repeatContainer}>
                <NemoTextLabel>
                  매달 {repeatState.endAt.getDate()}일에 반복
                </NemoTextLabel>
                <Checkbox
                  value={repeatState.useDate}
                  handler={() =>
                    setRepeatState((prev) =>
                      prev.period === RepeatPeriod.MONTHLY
                        ? { ...prev, useDate: !prev.useDate }
                        : prev
                    )
                  }
                />
              </View>
            )}
            {repeatState.period === RepeatPeriod.YEARLY && (
              <View style={style.repeatContainer}>
                <NemoTextLabel>
                  매년 {repeatState.endAt.getMonth() + 1}월{" "}
                  {repeatState.endAt.getDate()}일에 반복
                </NemoTextLabel>
                <Checkbox
                  value={repeatState.useDate}
                  handler={() =>
                    setRepeatState((prev) =>
                      prev.period === RepeatPeriod.YEARLY
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
      </View>
    </Modal>
  );
};
const style = StyleSheet.create({
  container: {
    gap: 24,
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000040",
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
