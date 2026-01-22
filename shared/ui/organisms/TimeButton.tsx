import NemoTextButton from "../molecules/NemoTextButton";

interface TimeButtonProps {
  disabled?: boolean;
  selectedTime: { hour: number; min: number };
  handlePressTime: () => void;
}

const TimeButton = ({
  disabled,
  selectedTime,
  handlePressTime,
}: TimeButtonProps) => {
  const hour = selectedTime.hour.toString().padStart(2, "0");
  const min = selectedTime.min.toString().padStart(2, "0");
  return (
    <NemoTextButton
      title=""
      content={`${hour}:${min}`}
      onPress={handlePressTime}
      disabled={disabled}
    />
  );
};

export default TimeButton;
