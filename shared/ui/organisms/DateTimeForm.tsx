import { useState } from "react";
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
      label: string;
      date: Date;
      onDate: () => void;
      time?: undefined;
      onTime?: undefined;
    }
  | {
      label: string;
      date: Date;
      onDate: (date: Date) => void;
      time: Time;
      onTime: (time: Time) => void;
    };

const DateTimeForm = ({
  label,
  date,
  time,
  onDate,
  onTime,
}: DateTimeFormProps) => {
  const [isOpenDateModal, setIsOpenDateModal] = useState(false);
  const [isOpenTimeModal, setIsOpenTimeModal] = useState(false);
  return (
    <View style={styles.optionContainer}>
      <NemoTextLabel>{label}</NemoTextLabel>
      <View style={styles.row}>
        <DateButton
          selectedDate={date}
          handlePressDate={() => setIsOpenDateModal(true)}
        />
        {time && (
          <TimeButton
            selectedTime={time}
            handlePressTime={() => setIsOpenTimeModal(true)}
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
    borderBottomWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
  },
});

export default DateTimeForm;
