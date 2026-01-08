import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import { globalGray100 } from "../../ui/index";
import AlertModal from "../../ui/organisms/AlertModal";

const meta: Meta<typeof AlertModal> = {
  title: "organisms/AlertModal",
  component: AlertModal,
  decorators: [
    (Story) => (
      <View
        style={{
          backgroundColor: globalGray100,
          padding: 20,
        }}
      >
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AlertModal>;

// 1. 버튼 하나
export const SingleButton: Story = {
  args: {
    title: "알림",
    content: "작업이 완료되었습니다.",
    confirmLabel: "확인",
    onConfirm: () => {
      console.log("확인 클릭");
    },
  },
};

// 2. 버튼 두 개
export const TwoButtons: Story = {
  args: {
    title: "알림",
    content: "이 작업을 진행하시겠습니까?",
    cancelLabel: "취소",
    confirmLabel: "확인",
    onCancel: () => {
      console.log("취소 클릭");
    },
    onConfirm: () => {
      console.log("확인 클릭");
    },
  },
};

// 3. 이미지 있음
export const WithDefaultProfileImage: Story = {
  args: {
    title: "모달 타이틀",
    content: "모달 본문내용 모달 본문내용 모달 본문내용 모달 본문내용",
    confirmLabel: "맞아요",
    onConfirm: () => {
      console.log("확인 클릭");
    },
  },
  render: (args) => (
    <AlertModal {...args}>
      <AlertModal.ProfileImage size={56} />
    </AlertModal>
  ),
};

// 4. 긴 텍스트
export const LongContent: Story = {
  args: {
    title: "긴 제목이 들어가는 경우 테스트",
    content:
      "이것은 매우 긴 콘텐츠 텍스트입니다. 모달의 width가 화면 크기에 따라 조절되고, 콘텐츠는 자동으로 wrap되어야 합니다. 여러 줄에 걸쳐 표시되는 긴 텍스트를 테스트하기 위한 예시입니다.",
    cancelLabel: "취소",
    confirmLabel: "확인",
    onCancel: () => {
      console.log("취소 클릭");
    },
    onConfirm: () => {
      console.log("확인 클릭");
    },
  },
};
