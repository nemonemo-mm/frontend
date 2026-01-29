import { createContext } from "react";
import {
  CalendarDate,
  CalendarSchedule,
  CalendarState,
} from "../types/Calendar";

export interface CalendarContextType {
  currentYearMonth: CalendarState;
  days: CalendarDate[][];
  selectedDate: Date;
  schedules: CalendarSchedule[];
  todos: CalendarSchedule[];
  callSchedules: () => void;
  callTodos: () => void;
  goNextMonth: () => void;
  goPrevMonth: () => void;
  selectDate: (date: Date) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export { CalendarContext };
