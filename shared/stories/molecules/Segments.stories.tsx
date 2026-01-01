import Segments from "@/shared/ui/molecules/Segments";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Segments> = {
  title: "molecules/Segments",
  component: Segments,
  argTypes: {
    texts: { control: "object" },
    handler: (v: { id: string; active: boolean; content: string }[]) => ({}),
  },
};

export default meta;

type Story = StoryObj<typeof Segments>;

export const Primary: Story = {
  args: {
    texts: [
      { id: "1", isActive: true, content: "React" },
      { id: "2", isActive: false, content: "TypeScript" },
      { id: "3", isActive: false, content: "Storybook" },
      { id: "4", isActive: false, content: "Chips" },
    ], // Example data for the Chips component
    handler: (updatedTexts) => {
      console.log("Updated texts:", updatedTexts);
      return {};
    },
  },
};
