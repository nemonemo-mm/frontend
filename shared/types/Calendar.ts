export type CalendarSchedule = {
  id: number;
  title: string;
  startAt: string;
};
export type CalendarDate = {
  date: number; // 1 ~ 31
  isCurrentMonth: boolean;
  fullDate: string;
};
