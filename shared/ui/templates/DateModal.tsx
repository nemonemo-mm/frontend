import { AntDesign } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";

import { Modal, StyleSheet, View } from "react-native";
import { globalGray200, globalGray700, globalGreen700 } from "..";
import BottomModal from "../organisms/BottomModal";
import Wheel from "../organisms/Wheel";

interface DateModalProps {
  closeModal: () => void;
  confirmModal: (data: { year: number; month: number; date: number }) => void;
}

const getDaysInMonth = (year: number, month: number) => {
  const maxDay = new Date(year, month + 1, 0).getDate();
  return maxDay;
};

const DateModal = ({ closeModal, confirmModal }: DateModalProps) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  const years = useMemo(
    () => Array.from({ length: 16 }, (_, i) => currentYear - 10 + i),
    []
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth + 1);
  const [date, setDate] = useState(currentDate);

  const dates = Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => i + 1
  );
  useEffect(() => {
    const maxDate = getDaysInMonth(year, month);
    if (date > maxDate) setDate(maxDate);
  }, [year, month]);

  const handleConfirmModal = () => {
    confirmModal({ year, month, date });
    closeModal();
  };

  return (
    <Modal backdropColor={globalGray700 + "20"} animationType="slide">
      <BottomModal.Container>
        <BottomModal.Header>
          <BottomModal.LeftButton onPress={closeModal}>
            <AntDesign name="close" size={20} color={globalGray700} />
          </BottomModal.LeftButton>
          <BottomModal.Title>날짜</BottomModal.Title>
          <BottomModal.RightButton onPress={handleConfirmModal}>
            <AntDesign name="check" size={20} color={globalGreen700} />
          </BottomModal.RightButton>
        </BottomModal.Header>
        <View style={{ flexDirection: "row" }}>
          <Wheel data={years} value={year} onChange={setYear} />
          <View style={style.divider} />
          <Wheel data={months} value={month} onChange={setMonth} />
          <View style={style.divider} />
          <Wheel data={dates} value={date} onChange={setDate} />
        </View>
      </BottomModal.Container>
    </Modal>
  );
};

const style = StyleSheet.create({
  divider: {
    width: 1,
    height: 110,
    backgroundColor: globalGray200,
    marginHorizontal: 8,
  },
});

export default DateModal;
