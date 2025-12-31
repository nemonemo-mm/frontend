import type { Meta, StoryObj } from "@storybook/react";
import Chip from "../ui/atoms/Chip";

const meta: Meta<typeof Chip> = {
  title: "atoms/Chip",
  component: Chip,
  argTypes: {
    active: {
      control: "boolean",
    },
    children: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Chip>;

export const Primary: Story = {
  args: {
    active: true,
    children: "Chip",
  },
};
