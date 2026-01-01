import type { Meta, StoryObj } from "@storybook/react";
import CtaButton from "../ui/atoms/CtaButton";

const meta: Meta<typeof CtaButton> = {
  title: "atoms/CtaButton",
  component: CtaButton,
};

export default meta;

type Story = StoryObj<typeof CtaButton>;

export const Primary: Story = {
  args: {
    label: "확인",
    isActive: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "비활성화",
    isActive: false,
  },
};
