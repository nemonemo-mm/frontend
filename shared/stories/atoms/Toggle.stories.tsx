import type { Meta, StoryObj } from "@storybook/react";
import Toggle from "../../ui/atoms/Toggle";

const meta: Meta<typeof Toggle> = {
  title: "atoms/Toggle",
  component: Toggle,
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Primary: Story = {};
