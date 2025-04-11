import type { Meta, StoryObj } from '@storybook/react';
import { PaperclipIcon, SendIcon } from './index';

const meta = {
  title: 'Custom/Icons/Lucide',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PaperclipIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paperclip: Story = {
  render: () => <PaperclipIcon size={24} />,
};

export const Send: Story = {
  render: () => <SendIcon size={24} />,
};
