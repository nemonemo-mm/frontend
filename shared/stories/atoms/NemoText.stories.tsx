import type { Meta, StoryObj } from "@storybook/react";
import NemoText from "../../ui/atoms/NemoText";

const meta: Meta<typeof NemoText> = {
  title: "atoms/NemoText",
  component: NemoText,
  argTypes: {
    level: {
      control: "select",
      options: ["h1", "h2", "h3", "body1", "body2", "body3"],
    },
    children: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof NemoText>;

export const Primary: Story = {
  args: {
    level: "h1",
    children: "text",
  },
};
