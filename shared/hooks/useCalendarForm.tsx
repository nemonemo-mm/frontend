import { createContext } from "react";

// CalendarFormContext.ts
export const CalendarFormContext = createContext<{
  state: any;
  dispatch: React.Dispatch<any>;
} | null>(null);
