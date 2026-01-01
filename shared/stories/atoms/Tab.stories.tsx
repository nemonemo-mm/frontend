import type { Meta, StoryObj } from "@storybook/react";
import Tab from "../../ui/atoms/Tab";

const meta: Meta<typeof Tab> = {
  title: "atoms/Tab",
  component: Tab,
  argTypes: {
    isActive: {
      control: "boolean",
    },
    children: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tab>;

export const Primary: Story = {
  args: {
    isActive: true,
    children: "Tab",
  },
};
