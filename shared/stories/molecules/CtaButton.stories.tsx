import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import CtaButton from "../../ui/molecules/CtaButton";

const meta: Meta<typeof CtaButton> = {
  title: "molecules/CtaButton",
  component: CtaButton,
  decorators: [
    (Story) => (
      <View style={{ width: "100%" }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CtaButton>;

export const Primary: Story = {
  args: {
    label: "확인",
    isActive: true,
    onPress: () => {},
  },
};

export const Disabled: Story = {
  args: {
    label: "비활성화",
    isActive: false,
    onPress: () => {},
  },
};
