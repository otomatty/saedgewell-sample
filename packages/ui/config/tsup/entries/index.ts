/**
 * UIコンポーネントのエントリーポイント定義
 * @description 各カテゴリーのエントリーポイントをまとめてエクスポート
 */
export * from './shadcn';
export * from './makerkit';
export * from './magicui';
export * from './custom';
export * from './util';

/**
 * すべてのエントリーポイントを結合した配列
 * @description ビルド時に使用する全エントリーポイントの配列
 */
import { shadcnEntries } from './shadcn';
import { makerkitEntries } from './makerkit';
import { magicuiEntries } from './magicui';
import { customEntries } from './custom';
import { utilEntries } from './util';

export const allEntries = [
  ...shadcnEntries,
  ...makerkitEntries,
  ...magicuiEntries,
  ...customEntries,
  ...utilEntries,
];
