import NemoDate from "@/shared/ui/atoms/NemoDate";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof NemoDate> = {
  title: "atoms/Date",
  component: NemoDate,
  argTypes: {
    isCurrentMonth: {
      control: "boolean",
    },
    date: {
      control: "number",
    },
  },
};

export default meta;

type Story = StoryObj<typeof NemoDate>;

export const ActiveMonth: Story = {
  args: {
    isCurrentMonth: true,
    date: 1,
  },
};
export const InActiveMonth: Story = {
  args: {
    isCurrentMonth: false,
    date: 31,
  },
};
