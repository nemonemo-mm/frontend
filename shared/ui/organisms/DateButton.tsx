import NemoTextButton from "../molecules/NemoTextButton";

interface DateButtonProps {
  selectedDate: Date;
  handlePressDate: () => void;
}

const DateButton = ({ selectedDate, handlePressDate }: DateButtonProps) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const date = selectedDate.getDate();
  return (
    <NemoTextButton
      content={`${year}년 ${month}월 ${date}일`}
      onPress={handlePressDate}
    />
  );
};

export default DateButton;
