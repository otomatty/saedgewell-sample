'use client';

import Link from 'next/link';
import { Button } from '../../shadcn/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
}

/**
 * ページネーションコンポーネント
 *
 * @description
 * 指定されたページ数とURLベースに基づいたページ遷移を提供します。
 * 現在のページ、総ページ数、ベースURLを受け取り、ページ間のナビゲーションを生成します。
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={3}
 *   totalPages={10}
 *   baseUrl="/works?category=web&page="
 * />
 * ```
 */
export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  className = '',
}: PaginationProps) {
  // 表示するページ番号の範囲を計算
  const getPageNumbers = () => {
    // 全て表示できる場合（7ページ以下）
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 現在のページが先頭近くの場合
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    // 現在のページが末尾近くの場合
    if (currentPage >= totalPages - 2) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // それ以外の場合は現在のページを中心に表示
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  // ページが1ページしかない場合は表示しない
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className={`flex items-center justify-center space-x-1 ${className}`}
      aria-label="ページナビゲーション"
    >
      {/* 最初のページへのボタン */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 hidden sm:flex"
        disabled={currentPage === 1}
        asChild={currentPage !== 1}
      >
        {currentPage === 1 ? (
          <span>
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">最初のページ</span>
          </span>
        ) : (
          <Link href={`${baseUrl}1`}>
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">最初のページ</span>
          </Link>
        )}
      </Button>

      {/* 前のページへのボタン */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage === 1}
        asChild={currentPage !== 1}
      >
        {currentPage === 1 ? (
          <span>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">前のページ</span>
          </span>
        ) : (
          <Link href={`${baseUrl}${currentPage - 1}`}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">前のページ</span>
          </Link>
        )}
      </Button>

      {/* ページ番号ボタン */}
      {pageNumbers.map((page, i) => {
        // 省略記号の場合
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${i}-${currentPage}`}
              className="h-8 w-8 flex items-center justify-center text-sm"
            >
              ...
            </span>
          );
        }

        // 数値のページ
        const pageNum = page as number;
        const isCurrentPage = pageNum === currentPage;

        return (
          <Button
            key={`page-${pageNum}`}
            variant={isCurrentPage ? 'default' : 'outline'}
            size="icon"
            className="h-8 w-8"
            disabled={isCurrentPage}
            asChild={!isCurrentPage}
          >
            {isCurrentPage ? (
              <span aria-current="page">{pageNum}</span>
            ) : (
              <Link href={`${baseUrl}${pageNum}`}>
                <span>{pageNum}</span>
              </Link>
            )}
          </Button>
        );
      })}

      {/* 次のページへのボタン */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage === totalPages}
        asChild={currentPage !== totalPages}
      >
        {currentPage === totalPages ? (
          <span>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">次のページ</span>
          </span>
        ) : (
          <Link href={`${baseUrl}${currentPage + 1}`}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">次のページ</span>
          </Link>
        )}
      </Button>

      {/* 最後のページへのボタン */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 hidden sm:flex"
        disabled={currentPage === totalPages}
        asChild={currentPage !== totalPages}
      >
        {currentPage === totalPages ? (
          <span>
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">最後のページ</span>
          </span>
        ) : (
          <Link href={`${baseUrl}${totalPages}`}>
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">最後のページ</span>
          </Link>
        )}
      </Button>
    </nav>
  );
}
