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
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Primary: Story = {
  args: {
    year: 2026,
    month: 1,
  },
};
