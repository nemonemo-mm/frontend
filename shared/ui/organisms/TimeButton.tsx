import NemoTextButton from "../molecules/NemoTextButton";

interface TimeButtonProps {
  selectedTime: { hour: number; min: number };
  handlePressTime: () => void;
}

const TimeButton = ({ selectedTime, handlePressTime }: TimeButtonProps) => {
  const hour = selectedTime.hour.toString().padStart(2, "0");
  const min = selectedTime.min.toString().padStart(2, "0");
  return (
    <NemoTextButton content={`${hour}:${min}`} onPress={handlePressTime} />
  );
};

export default TimeButton;
