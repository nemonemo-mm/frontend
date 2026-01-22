import { createContext } from "react";
import { CalendarDate, CalendarState } from "../types/Calendar";

export interface CalendarContextType {
  currentYearMonth: CalendarState;
  days: CalendarDate[][];
  selectedDate: Date;
  goNextMonth: () => void;
  goPrevMonth: () => void;
  selectDate: (date: Date) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export { CalendarContext };
