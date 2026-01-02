import type { Meta, StoryObj } from "@storybook/react";
import Button from "../../ui/atoms/Button";

const meta: Meta<typeof Button> = {
  title: "atoms/Button",
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "텍스트",
  },
};
