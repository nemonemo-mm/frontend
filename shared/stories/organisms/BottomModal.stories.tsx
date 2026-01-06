import BottomModal from "@/shared/ui/organisms/BottomModal";
import { EvilIcons } from "@expo/vector-icons";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";

const meta: Meta<typeof BottomModal> = {
  title: "organisms/BottomModal",
};

export default meta;

type Story = StoryObj<typeof BottomModal>;

export const Type1: Story = {
  render: () => (
    <View style={{ backgroundColor: "black", height: 300 }}>
      <BottomModal.Container>
        <BottomModal.Indicator />

        <BottomModal.Header>
          <BottomModal.LeftButton>
            <EvilIcons name="close" size={24} color="black" />
          </BottomModal.LeftButton>

          <BottomModal.RightButton>
            <EvilIcons name="check" size={24} color="black" />
          </BottomModal.RightButton>
        </BottomModal.Header>

        <View style={{ paddingTop: 15 }}></View>
      </BottomModal.Container>
    </View>
  ),
};
export const Type2: Story = {
  render: () => (
    <View style={{ backgroundColor: "black", height: 300 }}>
      <BottomModal.Container>
        <BottomModal.Header>
          <BottomModal.LeftButton>
            <EvilIcons name="close" size={24} color="black" />
          </BottomModal.LeftButton>

          <BottomModal.Title>날짜</BottomModal.Title>

          <BottomModal.RightButton>
            <EvilIcons name="check" size={24} color="black" />
          </BottomModal.RightButton>
        </BottomModal.Header>

        <View style={{ padding: 16 }}>{/* 나머지 모달 컨텐츠 */}</View>
      </BottomModal.Container>
    </View>
  ),
};
export const Type3: Story = {
  render: () => (
    <View style={{ backgroundColor: "black", height: 300 }}>
      <BottomModal.Container>
        <BottomModal.Indicator />
        <BottomModal.Header>
          <BottomModal.RightButton>
            <EvilIcons name="check" size={24} color="black" />
          </BottomModal.RightButton>
        </BottomModal.Header>

        <View style={{ padding: 16 }}>{/* 나머지 모달 컨텐츠 */}</View>
      </BottomModal.Container>
    </View>
  ),
};
