/**
 * カテゴリ関連のユーティリティ
 */
import React from 'react';
import type { ReactNode } from 'react';
import { BookOpen, FileText, BookMarked } from 'lucide-react';

/**
 * カテゴリIDから表示名を取得する
 * @param categoryId カテゴリID
 * @returns カテゴリの表示名
 */
export function getCategoryDisplayName(categoryId?: string): string {
  switch (categoryId) {
    case 'documents':
      return 'ドキュメント';
    case 'wiki':
      return 'Wiki';
    default:
      return categoryId || '未分類';
  }
}

/**
 * カテゴリIDからアイコンを取得する
 * @param categoryId カテゴリID
 * @param className アイコンに適用するクラス名
 * @returns カテゴリのアイコン
 */
export function getCategoryIcon(
  categoryId?: string,
  className = 'size-5'
): ReactNode {
  switch (categoryId) {
    case 'documents':
      return <BookMarked className={className} />;
    case 'wiki':
      return <FileText className={className} />;
    default:
      return <BookOpen className={className} />;
  }
}

/**
 * カテゴリIDからアイコン色を取得する
 * @param categoryId カテゴリID
 * @returns カテゴリのアイコン色
 */
export function getCategoryColor(categoryId?: string): string {
  switch (categoryId) {
    case 'documents':
      return 'text-blue-500';
    case 'wiki':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}
