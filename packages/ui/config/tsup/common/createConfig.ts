import { defineConfig, type Options } from 'tsup';
import {
  commonExternalDependencies,
  commonTsupConfig,
  commonDtsConfig,
} from './config';

/**
 * tsupの設定を生成するヘルパー関数
 * @param entry エントリーポイントの設定
 * @param additionalOptions 追加のオプション（オプショナル）
 */
export function createTsupConfig(
  entry: NonNullable<Options['entry']>,
  additionalOptions: Partial<Options> = {}
) {
  return defineConfig({
    ...commonTsupConfig,
    entry,
    external: commonExternalDependencies,
    ...additionalOptions,
  });
}

/**
 * 型定義生成用の設定を生成するヘルパー関数
 * @param entry エントリーポイントの設定
 * @param additionalOptions 追加のオプション（オプショナル）
 */
export function createDtsConfig(
  entry: NonNullable<Options['entry']>,
  additionalOptions: Partial<Options> = {}
) {
  return defineConfig({
    ...commonDtsConfig,
    entry,
    ...additionalOptions,
  });
}
