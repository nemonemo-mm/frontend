import { globalGray50 } from "@/shared/ui";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import Input from "../../ui/atoms/Input";

const meta: Meta<typeof Input> = {
  title: "atoms/Input",
  component: Input,
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: globalGray50, padding: 20 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Primary: Story = {
  args: {
    label: "이메일",
    placeholder: "이메일을 입력해주세요.",
  },
};
