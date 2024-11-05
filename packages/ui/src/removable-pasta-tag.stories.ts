import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3";
import RemovablePastaTag from "./removable-pasta-tag.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Example/RemovablePastaTag",
  component: RemovablePastaTag,
  tags: ["autodocs"],
  args: {
    onRemove: fn(),
  },
} satisfies Meta<typeof RemovablePastaTag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tag: "Pasta",
  },
};
