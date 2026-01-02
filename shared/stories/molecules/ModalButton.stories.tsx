import type { Meta, StoryObj } from "@storybook/react";
import ModalButton from "../../ui/molecules/ModalButton";

const meta: Meta<typeof ModalButton> = {
  title: "molecules/ModalButton",
  component: ModalButton,
};

export default meta;

type Story = StoryObj<typeof ModalButton>;

export const Primary: Story = {
  args: {
    label: "확인",
    variant: "primary",
    onPress: () => {},
  },
};

export const Secondary: Story = {
  args: {
    label: "취소",
    variant: "secondary",
    onPress: () => {},
  },
};
