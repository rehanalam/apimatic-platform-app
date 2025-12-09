import { Text } from "./text";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"],
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger", "success", "warning"],
    },
    weight: {
      control: "select",
      options: ["normal", "medium", "semibold", "bold"],
    },
    as: {
      control: "select",
      options: ["p", "span", "div", "label"],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "This is default text",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-2">
      <Text size="xs">Extra small text</Text>
      <Text size="sm">Small text</Text>
      <Text size="base">Base text</Text>
      <Text size="lg">Large text</Text>
      <Text size="xl">Extra large text</Text>
      <Text size="2xl">2XL text</Text>
      <Text size="3xl">3XL text</Text>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-2">
      <Text variant="primary">Primary text</Text>
      <Text variant="secondary">Secondary text</Text>
      <Text variant="danger">Danger text</Text>
      <Text variant="success">Success text</Text>
      <Text variant="warning">Warning text</Text>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="space-y-2">
      <Text weight="normal">Normal weight</Text>
      <Text weight="medium">Medium weight</Text>
      <Text weight="semibold">Semibold weight</Text>
      <Text weight="bold">Bold weight</Text>
    </div>
  ),
};

export const AsSpan: Story = {
  args: {
    as: "span",
    children: "This is a span element",
  },
};
