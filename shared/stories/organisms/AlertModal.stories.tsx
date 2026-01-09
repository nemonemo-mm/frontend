import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
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
  render: () => (
    <AlertModal>
      <AlertModal.Title>탈퇴할까요?</AlertModal.Title>
      <AlertModal.Actions
        type="single"
        confirmLabel="탈퇴하기"
        onConfirm={() => {
          console.log("확인 클릭");
        }}
      />
    </AlertModal>
  ),
};

// 2. 버튼 둘
export const TwoButtons: Story = {
  render: () => (
    <AlertModal>
      <AlertModal.Title>탈퇴하기</AlertModal.Title>
      <AlertModal.Actions
        type="double"
        cancelLabel="취소하기"
        confirmLabel="탈퇴하기"
        onCancel={() => {
          console.log("취소 클릭");
        }}
        onConfirm={() => {
          console.log("확인 클릭");
        }}
      />
    </AlertModal>
  ),
};

// 3. 타이틀 + 설명 + 버튼 2개
export const WithText: Story = {
  render: () => (
    <AlertModal>
      <AlertModal.Title>탈퇴하기</AlertModal.Title>
      <AlertModal.Text>계정을 삭제하시고 싶으신가요?</AlertModal.Text>
      <AlertModal.Actions
        type="double"
        cancelLabel="취소하기"
        confirmLabel="탈퇴하기"
        onCancel={() => {
          console.log("취소 클릭");
        }}
        onConfirm={() => {
          console.log("확인 클릭");
        }}
      />
    </AlertModal>
  ),
};

// 4. 프로필 이미지 + 타이틀 + 설명 + 버튼 2개
export const WithProfileImage: Story = {
  render: () => (
    <AlertModal>
      <AlertModal.ProfileImage size={56} />
      <AlertModal.Title>탈퇴하기</AlertModal.Title>
      <AlertModal.Text>계정을 삭제하시고 싶으신가요?</AlertModal.Text>
      <AlertModal.Actions
        type="double"
        cancelLabel="취소하기"
        confirmLabel="탈퇴하기"
        onCancel={() => {
          console.log("취소 클릭");
        }}
        onConfirm={() => {
          console.log("확인 클릭");
        }}
      />
    </AlertModal>
  ),
};

// 5. 타이틀 + 설명 + Input + 버튼 2개
export const WithTextAndInput: Story = {
  render: () => {
    const [inputValue, setInputValue] = useState("");

    return (
      <AlertModal>
        <AlertModal.Title>탈퇴하기</AlertModal.Title>
        <AlertModal.Text>
          계정을 삭제하려면 탈퇴하기를 입력해주세요
        </AlertModal.Text>
        <AlertModal.Input
          placeholder="소개글"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <AlertModal.Actions
          type="double"
          cancelLabel="취소하기"
          confirmLabel="탈퇴하기"
          onCancel={() => {
            console.log("취소 클릭");
            setInputValue("");
          }}
          onConfirm={() => {
            console.log("확인 클릭", inputValue);
            setInputValue("");
          }}
        />
      </AlertModal>
    );
  },
};

// 6. 타이틀 + Input만
export const WithInputOnly: Story = {
  render: () => {
    const [inputValue, setInputValue] = useState("");

    return (
      <AlertModal>
        <AlertModal.Title>이름 변경</AlertModal.Title>
        <AlertModal.Input
          placeholder="새 이름을 입력하세요"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <AlertModal.Actions
          type="double"
          cancelLabel="취소"
          confirmLabel="저장"
          onCancel={() => {
            console.log("취소 클릭");
            setInputValue("");
          }}
          onConfirm={() => {
            console.log("저장 클릭", inputValue);
            setInputValue("");
          }}
        />
      </AlertModal>
    );
  },
};

// 7. 계정 완전 삭제 확인 (실제 이미지 케이스)
export const DeleteAccountConfirmation: Story = {
  render: () => (
    <AlertModal>
      <AlertModal.Title>탈퇴하기</AlertModal.Title>
      <AlertModal.Text>
        계정이 탈퇴되었습니다. {"\n"} 그동안 이용해주셔서 감사합니다.
      </AlertModal.Text>
      <AlertModal.Actions
        type="single"
        confirmLabel="첫 화면으로"
        onConfirm={() => {
          console.log("확인 클릭");
        }}
      />
    </AlertModal>
  ),
};
