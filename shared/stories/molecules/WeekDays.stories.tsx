import WeekDays from "@/shared/ui/molecules/WeekDays";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof WeekDays> = {
  title: "molecules/WeekDays",
  component: WeekDays,
};

export default meta;

type Story = StoryObj<typeof WeekDays>;

export const Primary: Story = {};
