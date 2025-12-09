import { Heading } from "./heading";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Heading",
  component: Heading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: "select",
      options: [1, 2, 3, 4, 5, 6],
    },
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Heading Text",
    level: 1,
  },
};

export const Levels: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading level={1}>Heading 1</Heading>
      <Heading level={2}>Heading 2</Heading>
      <Heading level={3}>Heading 3</Heading>
      <Heading level={4}>Heading 4</Heading>
      <Heading level={5}>Heading 5</Heading>
      <Heading level={6}>Heading 6</Heading>
    </div>
  ),
};

export const Primary: Story = {
  args: {
    children: "Primary Heading",
    level: 2,
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Heading",
    level: 2,
    variant: "secondary",
  },
};
