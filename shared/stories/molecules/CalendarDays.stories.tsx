import CalendarDays from "@/shared/ui/molecules/CalendarDays";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof CalendarDays> = {
  title: "molecules/CalendarDays",
  component: CalendarDays,
};

export default meta;

type Story = StoryObj<typeof CalendarDays>;

export const Primary: Story = {};
