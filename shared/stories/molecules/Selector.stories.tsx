import Selector from "@/shared/ui/molecules/Selector";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Selector> = {
  title: "molecules/Selector",
};

export default meta;

type Story = StoryObj<typeof Selector>;

export const Vertical: Story = {
  render: () => (
    <Selector.Vertical
      level="h2"
      title="제목"
      handler={(dir) => {
        console.log(dir);
      }}
    />
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Selector.Horizontal
      level="h2"
      title="제목"
      handler={(dir) => {
        console.log(dir);
      }}
    />
  ),
};
