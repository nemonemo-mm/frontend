import type { Meta, StoryObj } from "@storybook/react";
import Segment from "../../ui/atoms/Segment";

const meta: Meta<typeof Segment> = {
  title: "atoms/Segment",
  component: Segment,
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

type Story = StoryObj<typeof Segment>;

export const Primary: Story = {
  args: {
    isActive: true,
    children: "Segment",
  },
};
