import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import AuthButton from "../../ui/molecules/AuthButton";

const meta: Meta<typeof AuthButton> = {
  title: "molecules/AuthButton",
  component: AuthButton,
  decorators: [
    (Story) => (
      <View style={{ width: "100%" }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AuthButton>;

export const Google: Story = {
  args: {
    label: "Google",
    onPress: () => {
      console.log("Google 로그인 클릭");
    },
  },
};

export const Apple: Story = {
  args: {
    label: "Apple",
    onPress: () => {
      console.log("Apple 로그인 클릭");
    },
  },
};
