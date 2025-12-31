import Chips from "@/shared/ui/molecules/Chips";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Chips> = {
  title: "molecules/Chips",
  component: Chips,
  argTypes: {
    texts: { control: "object" },
    handler: (v: { id: string; active: boolean; content: string }[]) => ({}),
  },
};

export default meta;

type Story = StoryObj<typeof Chips>;

export const Primary: Story = {
  args: {
    texts: [
      { id: "1", active: true, content: "React" },
      { id: "2", active: false, content: "TypeScript" },
      { id: "3", active: true, content: "Storybook" },
      { id: "4", active: false, content: "Chips" },
    ], // Example data for the Chips component
    handler: (updatedTexts) => {
      console.log("Updated texts:", updatedTexts);
      return {};
    },
  },
};
