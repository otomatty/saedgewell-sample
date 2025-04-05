import { defineConfig, type Options } from 'tsup';
import { commonDevConfig } from './dev.config';

interface DevConfigOptions {
  name: string;
  memoryLimit: number;
}

/**
 * 開発用の設定を生成するヘルパー関数
 * @param entry エントリーポイントの設定
 * @param options 開発用の設定オプション
 * @param additionalOptions 追加のtsupオプション
 */
export function createDevConfig(
  entry: NonNullable<Options['entry']>,
  options: DevConfigOptions,
  additionalOptions: Partial<Options> = {}
) {
  if (process.env.NODE_OPTIONS === undefined) {
    process.env.NODE_OPTIONS = `--max-old-space-size=${options.memoryLimit}`;
  }

  return defineConfig({
    ...commonDevConfig,
    entry,
    ...additionalOptions,
    onSuccess: async () => {
      console.log(
        `[${options.name}] Build successful, watching for changes...`
      );
    },
  });
}
