import type { Meta, StoryObj } from '@storybook/react';
import { LoadingIcon } from './index';

const meta = {
  title: 'Custom/Icons/Loading',
  component: LoadingIcon,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LoadingIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 24,
  },
};
