import useCalendar from "@/shared/hooks/useCalendar";
import Calendar from "@/shared/ui/organisms/Calendar";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Calendar> = {
  title: "organisms/Calendar",
  component: Calendar,
  argTypes: {
    year: {
      control: "number",
    },
    month: {
      control: "number",
    },
    schedules: {
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Primary: Story = {
  render: (args) => {
    const { currentYearMonth, days, goPrevMonth, goNextMonth } = useCalendar(
      args.year,
      args.month
    );
    const handleCalendarMonth = (direction: -1 | 1) => {
      if (direction == -1) goPrevMonth();
      else goNextMonth();
    };
    return (
      <Calendar
        year={currentYearMonth.year}
        month={currentYearMonth.month + 1}
        days={days}
        schedules={args.schedules}
        handleCalendarMonth={handleCalendarMonth}
        // handleAddSchedule={handleAddSchedule}
      />
    );
  },
  args: {
    year: 2026,
    month: 1,
    days: [],
    schedules: [
      {
        id: 1,
        startDate: new Date(2026, 0, 5),
        endDate: new Date(2026, 0, 5),
        title: "Team Meeting",
      },
      {
        id: 2,
        startDate: new Date(2025, 11, 10),
        endDate: new Date(2026, 0, 10),
        title: "Project Deadline",
      },
      {
        id: 3,
        startDate: new Date(2026, 0, 15),
        endDate: new Date(2026, 0, 15),
        title: "Client Presentation",
      },
      {
        id: 4,
        startDate: new Date(2026, 0, 20),
        endDate: new Date(2026, 0, 22),
        title: "Team Building Retreat",
      },
      {
        id: 5,
        startDate: new Date(2026, 0, 25),
        endDate: new Date(2026, 0, 25),
        title: "Performance Review",
      },
      {
        id: 6,
        startDate: new Date(2026, 0, 28),
        endDate: new Date(2026, 0, 28),
        title: "Monthly Wrap-Up",
      },
    ],
  },
};
