import type { Meta, StoryObj } from '@storybook/react';
import { GoogleIcon } from './index';

const meta = {
  title: 'Custom/Icons/Google',
  component: GoogleIcon,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof GoogleIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 24,
  },
};
