import { AlarmState } from "../ui/templates/AlarmModal";
import { RepeatState } from "../ui/templates/RepeatModal";

export const formatRepeat = (repeat: RepeatState | null): string => {
  if (!repeat) return "지정없음";

  const { period, endAt } = repeat;
  const endDate = `${endAt.getFullYear()}년 ${endAt.getMonth() + 1}월 ${endAt.getDate()}일`;
  let result: string;
  switch (period) {
    case "daily":
      result = `${repeat.interval}일 간격으로 ${endDate}까지 반복`;
      break;
    case "weekly":
      result = `${repeat.weekdays.join(", ")}요일에 ${repeat.interval}주 간격으로 ${endDate}까지 반복`;
      break;
    case "monthly":
      result = `${repeat.useDate ? "매월 " : ""}${endDate}까지 반복`;
      break;
    case "yearly":
      result = `${repeat.useDate ? "매년 " : ""}${endDate}까지 반복`;
      break;
    default:
      result = "지정없음";
  }

  return result;
};

export const formatAlarm = (alarm: AlarmState | null) => {
  let result: string = "끔";
  if (!alarm) result = "끔";
  else {
    const times = [];
    if (alarm["10"]) times.push("10분전");
    if (alarm["30"]) times.push("30분전");
    if (alarm["60"]) times.push("1시간전");
    if (times.length > 1) {
      result = times.join(", ");
    } else result = times.join("");
  }
  return result;
};
