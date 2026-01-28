import { createContext, Dispatch } from "react";
import {
  CalendarDate,
  CalendarSchedule,
  CalendarState,
} from "../types/Calendar";
import { InitialState } from "../ui/templates/CalendarModal";

export interface CalendarContextType {
  currentYearMonth: CalendarState;
  days: CalendarDate[][];
  selectedDate: Date;
  schedules: CalendarSchedule[];
  setSchedules: Dispatch<
    React.SetStateAction<
      {
        id: string;
        state: InitialState;
      }[]
    >
  >;
  goNextMonth: () => void;
  goPrevMonth: () => void;
  selectDate: (date: Date) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export { CalendarContext };
