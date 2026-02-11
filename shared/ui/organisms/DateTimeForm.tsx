import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { globalGray200, globalSpacingXs } from "..";
import NemoTextLabel from "../molecules/NemoTextLabel";
import DateModal from "../templates/DateModal";
import TimeModal from "../templates/TimeModal";
import DateButton from "./DateButton";
import TimeButton from "./TimeButton";

type Time = { hour: number; min: number };

type DateTimeFormProps =
  | {
      disabled?: boolean;
      label: string;
      date: Date;
      onDate: () => void;
      time?: undefined;
      onTime?: undefined;
      disableTime?: boolean;
    }
  | {
      disabled?: boolean;
      label: string;
      date: Date;
      onDate: (date: Date) => void;
      time: Time;
      onTime: (time: Time) => void;
      disableTime?: boolean;
    };

const DateTimeForm = ({
  disabled,
  label,
  date,
  time,
  onDate,
  onTime,
  disableTime,
}: DateTimeFormProps) => {
  const [isOpenDateModal, setIsOpenDateModal] = useState(false);
  const [isOpenTimeModal, setIsOpenTimeModal] = useState(false);
  const timeDisabled = !!(disabled || disableTime);
  useEffect(() => {
    if (timeDisabled) {
      setIsOpenTimeModal(false);
    }
  }, [timeDisabled]);
  return (
    <View style={[styles.optionContainer]}>
      <NemoTextLabel disabled={disabled}>{label}</NemoTextLabel>
      <View style={styles.row}>
        <DateButton
          selectedDate={date}
          handlePressDate={() => !disabled && setIsOpenDateModal(true)}
        />
        {time && (
          <TimeButton
            selectedTime={time}
            handlePressTime={() => !timeDisabled && setIsOpenTimeModal(true)}
            disabled={timeDisabled}
          />
        )}
      </View>
      {time && isOpenTimeModal && (
        <TimeModal
          initialValue={time}
          closeModal={() => setIsOpenTimeModal(false)}
          confirmModal={onTime}
        />
      )}
      {isOpenDateModal && (
        <DateModal
          initialValue={date}
          closeModal={() => setIsOpenDateModal(false)}
          confirmModal={onDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: "space-between",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
  },
});

export default DateTimeForm;
