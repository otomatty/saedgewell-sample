'use client';

import { useCallback, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import type { ResolvedKeyword } from '~/types/mdx/keyword';

interface KeywordLinkClientProps {
  initialData: ResolvedKeyword;
  keyword: string;
  docType?: string;
  className?: string;
  displayText?: ReactNode;
}

export function KeywordLinkClient({
  initialData,
  keyword: propKeyword,
  docType: propDocType,
  className,
  displayText,
}: KeywordLinkClientProps) {
  const router = useRouter();
  const [resolvedData, setResolvedData] =
    useState<ResolvedKeyword>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const { keyword, docType, mapping, error, isAmbiguous, relatedKeywords } =
    resolvedData;

  // 表示するテキスト（displayTextが指定されていない場合はkeywordを使用）
  const textToDisplay = displayText || keyword;

  // 初期データにマッピングがなく、エラーもない場合は、クライアントサイドで解決を試みる
  useEffect(() => {
    const shouldResolveClientSide =
      !initialData.mapping && !initialData.error && !isResolving;

    if (shouldResolveClientSide) {
      const resolveKeywordClientSide = async () => {
        setIsResolving(true);
        setClientError(null);

        try {
          // APIエンドポイントを呼び出してキーワードを解決
          const queryParams = new URLSearchParams({
            keyword: propKeyword,
          });

          if (propDocType) {
            queryParams.append('docType', propDocType);
          }

          // 現在のページのコンテキストを取得（オプション）
          try {
            const pageContent =
              document.querySelector('main')?.textContent || '';
            if (pageContent) {
              queryParams.append('context', pageContent.slice(0, 1000)); // 最初の1000文字だけ送信
            }
          } catch (contextError) {
            console.warn(
              'コンテキスト取得中にエラーが発生しました:',
              contextError
            );
          }

          const response = await fetch(
            `/api/resolve-keyword?${queryParams.toString()}`
          );

          if (!response.ok) {
            throw new Error(
              `APIエラー: ${response.status} ${response.statusText}`
            );
          }

          const result: ResolvedKeyword = await response.json();

          setResolvedData(result);
        } catch (err) {
          console.error('キーワード解決エラー:', err);
          const errorMessage =
            err instanceof Error ? err.message : '不明なエラー';
          setClientError(errorMessage);
          setResolvedData({
            ...initialData,
            error: `キーワードの解決に失敗しました: ${errorMessage}`,
          });
        } finally {
          setIsResolving(false);
        }
      };

      resolveKeywordClientSide();
    }
  }, [initialData, propKeyword, propDocType, isResolving]);

  // 追加情報用のツールチップテキストを生成
  const getTooltipText = useCallback(() => {
    if (clientError) {
      return `${keyword}${docType ? ` (${docType})` : ''} - クライアントエラー: ${clientError}`;
    }

    if (error) {
      return `${keyword}${docType ? ` (${docType})` : ''} - ${error}`;
    }

    if (isAmbiguous && mapping) {
      return `${mapping.metadata.title} - ${mapping.metadata.description || ''}
複数の候補があります (${resolvedData.alternatives?.length || 0}件)`;
    }

    if (mapping) {
      return `${mapping.metadata.title} - ${mapping.metadata.description || ''}`;
    }

    return `${keyword}${docType ? ` (${docType})` : ''}`;
  }, [
    keyword,
    docType,
    mapping,
    error,
    clientError,
    isAmbiguous,
    resolvedData.alternatives,
  ]);

  const handleClick = useCallback(() => {
    if (!mapping) return;

    try {
      // クリック時にローディング状態を表示
      setIsLoading(true);

      // パスの構築方法を詳細にログ出力
      const pathParts = mapping.path.split('/');

      // パスにdocTypeが含まれているかチェックし、適切なナビゲーションパスを構築
      let navigationPath: string;
      if (pathParts.includes(mapping.docType)) {
        // パスにすでにdocTypeが含まれている場合は、そのままのパスを使用
        navigationPath = `/${mapping.path}`;
      } else {
        // パスにdocTypeが含まれていない場合は、docTypeを追加
        navigationPath = `/${mapping.docType}/${mapping.slug}`;
      }

      router.push(navigationPath);

      // ナビゲーション後にローディング状態を解除（実際のナビゲーションが完了する前に実行される可能性あり）
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (err) {
      console.error('ナビゲーション中にエラーが発生しました:', err);
      setIsLoading(false);
      setClientError(err instanceof Error ? err.message : '不明なエラー');
    }
  }, [mapping, router]);

  // エラーハンドリング用のラッパー
  try {
    // 読み込み中状態の表示（キーワード解決中またはナビゲーション中）
    if (isLoading || isResolving) {
      return (
        <span
          className={twMerge(
            'keyword-link',
            'inline-block',
            'text-blue-400',
            'border-b',
            'border-dashed',
            'border-blue-300',
            'animate-pulse',
            className
          )}
          title="読み込み中..."
          aria-label={`${keyword} - 読み込み中...`}
          data-keyword={keyword}
          data-status="loading"
        >
          {textToDisplay}
          <span className="ml-1 text-xs">⟳</span>
        </span>
      );
    }

    // クライアントエラー状態の表示
    if (clientError) {
      return (
        <span
          className={twMerge(
            'keyword-link',
            'inline-block',
            'text-orange-500',
            'border-b',
            'border-dashed',
            'border-orange-300',
            'group',
            className
          )}
          title={getTooltipText()}
          aria-label={`${keyword} - クライアントエラー: ${clientError}`}
          data-keyword={keyword}
          data-status="client-error"
          data-error={clientError}
        >
          {textToDisplay}
          <span className="ml-1 text-xs opacity-70 group-hover:opacity-100">
            ⚠
          </span>
        </span>
      );
    }

    // エラー状態の表示
    if (error) {
      return (
        <span
          className={twMerge(
            'keyword-link',
            'inline-block',
            'text-red-500',
            'border-b',
            'border-dashed',
            'border-red-300',
            'group',
            className
          )}
          title={getTooltipText()}
          aria-label={`${keyword} - エラー: ${error}`}
          data-keyword={keyword}
          data-status="error"
          data-error={error}
        >
          {textToDisplay}
          <span className="ml-1 text-xs opacity-70 group-hover:opacity-100">
            ⚠
          </span>
        </span>
      );
    }

    // 曖昧な参照の表示
    if (isAmbiguous) {
      return (
        <button
          type="button"
          className={twMerge(
            'keyword-link',
            'inline-block',
            'transition-colors',
            'cursor-pointer',
            'text-yellow-600',
            'border-b',
            'border-dashed',
            'border-yellow-300',
            'group',
            'hover:text-yellow-700',
            className
          )}
          title={getTooltipText()}
          onClick={handleClick}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick();
            }
          }}
          aria-label={`${keyword} - 複数のドキュメントが見つかりました (${resolvedData.alternatives?.length || 0}件)`}
          data-keyword={keyword}
          data-status="ambiguous"
          data-alternatives-count={resolvedData.alternatives?.length || 0}
        >
          {textToDisplay}
          <span className="ml-1 text-xs opacity-70 group-hover:opacity-100">
            *
          </span>
        </button>
      );
    }

    // 通常の有効なリンク
    return (
      <button
        type="button"
        className={twMerge(
          'keyword-link',
          'inline-block',
          'transition-colors',
          'cursor-pointer',
          'text-blue-500',
          'hover:text-blue-600',
          'hover:underline',
          'group',
          className
        )}
        title={getTooltipText()}
        onClick={handleClick}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
        aria-label={
          mapping ? `${keyword} - ${mapping.metadata.title}` : keyword
        }
        data-keyword={keyword}
        data-status="valid"
        data-path={mapping?.path}
      >
        {textToDisplay}
        {relatedKeywords && relatedKeywords.length > 0 && (
          <span className="ml-1 text-xs opacity-0 group-hover:opacity-70">
            +
          </span>
        )}
      </button>
    );
  } catch (error) {
    // 予期しないエラーが発生した場合のフォールバック
    console.error('KeywordLinkClient: 予期しないエラーが発生しました', error);

    // エラー表示用のフォールバックコンポーネント
    return (
      <span
        className="keyword-link inline-block text-red-500 border-b border-dashed border-red-300"
        title={`エラー: ${error instanceof Error ? error.message : '不明なエラー'}`}
        data-keyword={propKeyword || '不明なキーワード'}
        data-error="true"
      >
        {displayText || propKeyword || '不明なキーワード'}
        <span className="ml-1 text-xs">⚠</span>
      </span>
    );
  }
}
