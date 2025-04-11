import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: false,
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      define: {
        'process.env': {},
      },
      resolve: {
        alias: {
          '@': '/src',
        },
      },
      css: {
        postcss: './postcss.config.js',
      },
    });
  },
};

export default config;
