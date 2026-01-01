import type { Meta, StoryObj } from "@storybook/react";
import Input from "../ui/atoms/Input";

const meta: Meta<typeof Input> = {
  title: "atoms/Input",
  component: Input,
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Primary: Story = {
  args: {
    label: "이메일",
    placeholder: "이메일을 입력해주세요.",
  },
};
