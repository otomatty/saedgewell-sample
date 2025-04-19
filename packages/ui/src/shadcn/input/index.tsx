import * as React from 'react';

import { cn } from '../../lib/utils';

/**
 * 汎用的な入力フィールドコンポーネントです。
 * モダンなスタイリングとアクセシビリティを考慮した実装になっています。
 *
 * @example
 * ```tsx
 * // 基本的な使用方法
 * <Input placeholder="ユーザー名を入力" />
 *
 * // タイプを指定
 * <Input type="password" placeholder="パスワード" />
 *
 * // 無効化状態
 * <Input disabled placeholder="入力不可" />
 *
 * // カスタムスタイル
 * <Input className="border-2 border-blue-500" />
 *
 * // ファイル入力
 * <Input type="file" accept="image/*" />
 * ```
 *
 * @property {string} [type] - 入力フィールドのタイプ（text, password, email, number, file など）
 * @property {string} [className] - 追加のCSSクラス
 * @property {string} [placeholder] - プレースホルダーテキスト
 * @property {boolean} [disabled] - 無効化状態を制御
 * @property {boolean} [required] - 必須入力を制御
 * @property {string} [pattern] - 入力値の検証パターン
 * @property {number} [minLength] - 最小文字数
 * @property {number} [maxLength] - 最大文字数
 * @property {string} [defaultValue] - デフォルト値
 * @property {function} [onChange] - 値が変更されたときのコールバック
 * @property {function} [onFocus] - フォーカス時のコールバック
 * @property {function} [onBlur] - フォーカスが外れたときのコールバック
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-2xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
