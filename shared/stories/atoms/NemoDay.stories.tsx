import NemoDay from "@/shared/ui/atoms/NemoDay";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof NemoDay> = {
  title: "atoms/NemoDay",
  component: NemoDay,
  argTypes: {
    weekday: {
      control: "select",
      options: ["월", "화", "수", "목", "금", "토", "일"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof NemoDay>;

export const Primary: Story = {
  args: {
    weekday: "월",
  },
};
