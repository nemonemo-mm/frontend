import type { Meta, StoryObj } from "@storybook/react";
import Checkbox from "../ui/atoms/Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "atoms/Checkbox",
  component: Checkbox,
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Primary: Story = {};
