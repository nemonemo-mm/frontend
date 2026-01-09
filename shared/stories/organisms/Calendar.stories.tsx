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
  args: {
    year: 2026,
    month: 1,
    schedules: [
      {
        id: 1,
        startDate: new Date(2026, 0, 1),
        endDate: new Date(2026, 0, 1),
        title: "0 with team",
      },
      {
        id: 12,
        startDate: new Date(2026, 0, 1),
        endDate: new Date(2026, 0, 1),
        title: "1 with team",
      },
      {
        id: 13,
        startDate: new Date(2026, 0, 1),
        endDate: new Date(2026, 0, 1),
        title: "2 with team",
      },
      {
        id: 14,
        startDate: new Date(2026, 0, 1),
        endDate: new Date(2026, 0, 1),
        title: "3 with team",
      },
      {
        id: 15,
        startDate: new Date(2026, 0, 1),
        endDate: new Date(2026, 0, 1),
        title: "4 with team",
      },
      {
        id: 2,
        startDate: new Date(2026, 0, 4),
        endDate: new Date(2026, 0, 7),
        title: "Doctor's appointment",
      },
      {
        id: 6,
        startDate: new Date(2025, 11, 3),
        endDate: new Date(2026, 0, 11),
        title: "long schedule test",
      },
    ],
  },
};
