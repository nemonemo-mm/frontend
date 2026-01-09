export interface APISchedule {
  id: number;
  title: string;
  startAt: string; // ISO
  endAt: string; // ISO
  isAllDay: boolean;
}

export interface CalendarSchedule {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
}
export interface WeekSchedule {
  schedule: CalendarSchedule;
  startIndex: number; // 0~6 (요일)
  span: number; // 며칠짜리
  startsThisWeek: boolean;
}

export interface CalendarDate {
  date: number; // 1 ~ 31
  isCurrentMonth: boolean;
  fullDate: Date;
}
