import { AlarmState } from "../ui/templates/AlarmModal";

export const convertAlarmToNumberArray = (
  alarm: AlarmState | null
): number[] => {
  if (!alarm) return [];
  return Object.entries(alarm)
    .map(([key, value]) => (value ? parseInt(key) : null))
    .filter((value) => value !== null);
};
