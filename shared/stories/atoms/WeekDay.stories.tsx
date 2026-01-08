import WeekDay from "@/shared/ui/atoms/WeekDay";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof WeekDay> = {
  title: "atoms/WeekDay",
  component: WeekDay,
  argTypes: {
    weekday: {
      control: "select",
      options: ["월", "화", "수", "목", "금", "토", "일"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof WeekDay>;

export const Primary: Story = {
  args: {
    weekday: "월",
  },
};
