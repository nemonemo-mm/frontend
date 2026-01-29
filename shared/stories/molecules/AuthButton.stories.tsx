import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import GoogleAuthButton from "../../ui/molecules/GoogleAuthButton";

const meta: Meta<typeof GoogleAuthButton> = {
  title: "molecules/AuthButton",
  component: GoogleAuthButton,
  decorators: [
    (Story) => (
      <View style={{ width: "100%" }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof GoogleAuthButton>;

export const Google: Story = {
  args: {
    onPress: () => {
      console.log("Google 로그인 클릭");
    },
  },
};
