'use client';

import type React from 'react';
import { cn } from '../../lib/utils';

export interface MarkdownProps {
  /**
   * Markdownコンテンツ
   */
  content: string;
  /**
   * 追加のクラス名
   */
  className?: string;
}

/**
 * Markdownをレンダリングするコンポーネント
 *
 * 注意: このコンポーネントは現在プレーンテキストとして表示します。
 * TODO: react-markdownの型問題を解決し、適切なMarkdown変換を実装する
 */
export const Markdown: React.FC<MarkdownProps> = ({ content, className }) => {
  // 一時的な実装: プレーンテキストとして表示
  return (
    <div className={cn('whitespace-pre-wrap break-words', className)}>
      {content}
    </div>
  );
};
