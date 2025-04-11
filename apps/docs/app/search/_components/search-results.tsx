'use client';

// import { searchDocuments, type SearchResult } from '~/actions/search';
import { searchDocuments } from '~/actions/search'; // searchDocuments のインポートはそのまま
import type { SearchResult } from '~/types/search'; // SearchResult 型は ~/types/search からインポート
import Image from 'next/image';
import Link from 'next/link';
import { getCategoryDisplayName, getCategoryColor } from '~/lib/utils/category';
import { BookOpen, FileText, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { getCategoryIcon } from '~/lib/utils/category';
import {
  optimizeImageUrlSync,
  DEFAULT_THUMBNAIL_PATH,
  generatePlaceholderImage,
} from '~/lib/utils/image';
import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from '@kit/ui/skeleton';
import { Spinner } from '@nextui-org/spinner';
import { useInView } from 'react-intersection-observer';
import { searchConfig } from '~/config/search.config';
import { searchLogger } from '~/lib/logger/search'; // Logger can be used on client too if configured

// 標準的なプレースホルダー画像
const DEFAULT_PLACEHOLDER = generatePlaceholderImage();

// サムネイル画像コンポーネント
function DocTypeThumbnail({
  thumbnail,
  title,
}: {
  thumbnail?: string;
  title: string;
}) {
  // 最適化された画像URLを保持するstate
  const [imageUrl, setImageUrl] = useState<string>(DEFAULT_THUMBNAIL_PATH);
  const [isLoading, setIsLoading] = useState(true);

  // ローカルストレージからキャッシュを読み込む
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined' || !thumbnail) return;

    try {
      const cacheKey = `search:${thumbnail}`;
      const cachedUrl = localStorage.getItem(cacheKey);
      if (cachedUrl) {
        setImageUrl(cachedUrl);
        setIsLoading(false);
      }
    } catch (error) {
      console.warn('Failed to load cached image URL:', error);
    }
  }, [thumbnail]);

  // 画像URLを最適化する
  useEffect(() => {
    const optimizeUrl = async () => {
      if (!thumbnail) {
        setImageUrl(DEFAULT_THUMBNAIL_PATH);
        return;
      }

      // ローカルストレージにキャッシュがあるか確認
      const cacheKey = `search:${thumbnail}`;
      const cachedUrl = localStorage.getItem(cacheKey);
      if (cachedUrl) {
        setImageUrl(cachedUrl);
        setIsLoading(false);
        return;
      }

      try {
        // 初期値として同期的に最適化したURLを設定
        setImageUrl(optimizeImageUrlSync(thumbnail));

        // 非同期で最適化したURLを取得（OGP画像の取得など）
        const encodedUrl = encodeURIComponent(thumbnail);
        const apiUrl = `/api/optimize-image?url=${encodedUrl}`;

        // 相対パスを絶対パスに変換
        const baseUrl = window.location.origin;
        const absoluteApiUrl = new URL(apiUrl, baseUrl).toString();

        const response = await fetch(absoluteApiUrl);
        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            setImageUrl(data.url);

            // ローカルストレージにキャッシュ
            try {
              localStorage.setItem(cacheKey, data.url);
            } catch (error) {
              console.warn('Failed to cache image URL:', error);
            }
          }
        }
      } catch (error) {
        console.error(`Error optimizing image for ${title}:`, error);
        // エラーが発生した場合はデフォルト画像を使用
        setImageUrl(DEFAULT_THUMBNAIL_PATH);
      }
    };

    optimizeUrl();
  }, [thumbnail, title]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageUrl(DEFAULT_THUMBNAIL_PATH);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted/30">
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="h-full w-full" />
        </div>
      )}
      <Image
        src={imageUrl}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-contain p-2"
        quality={80}
        priority={false}
        loading="lazy"
        blurDataURL={DEFAULT_PLACEHOLDER}
        placeholder="blur"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </div>
  );
}

// ハイライト付きテキストコンポーネント
function HighlightedText({
  text,
  searchTerm,
  className = '',
}: {
  text: string;
  searchTerm: string;
  className?: string;
}) {
  // 検索語句が空または存在しない場合はそのまま表示
  if (!searchTerm || !text) {
    return <span className={className}>{text}</span>;
  }

  // 検索語句をエスケープして正規表現で使えるようにする
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // 正規表現を使って検索語句を含む部分を分割
  const parts = useMemo(() => {
    try {
      const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
      return text.split(regex);
    } catch (e) {
      // 正規表現エラーの場合はそのまま表示
      return [text];
    }
  }, [text, escapedSearchTerm]);

  // 分割した部分を表示（検索語句に一致する部分はハイライト）
  return (
    <span className={className}>
      {parts.map((part, i) => {
        // 大文字小文字を区別せずに比較
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          return (
            <mark
              key={`${i}-${part}`}
              className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded"
            >
              {part}
            </mark>
          );
        }
        // 一致しない部分はそのまま表示
        return part;
      })}
    </span>
  );
}

export function SearchResults({ query }: { query: string }) {
  // 状態管理
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 検索結果をカテゴリ別に分類
  const categorizedResults = {
    docTypes: results.filter((result) => result.sourceType === 'index'), // index.jsonから検索したもの
    documents: results.filter((result) => result.sourceType === 'content'), // ページから検索したもの
  };

  // 検索実行
  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchResults = await searchDocuments(query);
        setResults(searchResults);
      } catch (err) {
        console.error('検索エラー:', err);
        setError('検索中にエラーが発生しました。もう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  // ローディング中
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="space-y-4 w-full max-w-3xl">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  // 検索クエリが空の場合
  if (!query) {
    return (
      <div className="text-center text-muted-foreground">
        検索キーワードを入力してください
      </div>
    );
  }

  // 検索結果がない場合
  if (results.length === 0) {
    return (
      <div className="text-center text-muted-foreground mb-4">
        「{query}」に一致する結果は見つかりませんでした
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        「{query}」の検索結果: {results.length}件
      </p>

      {/* コンテンツタイプの検索結果 */}
      {categorizedResults.docTypes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            「{query}」のコンテンツ
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categorizedResults.docTypes.map((result: SearchResult) => (
              <Link key={result.id} href={result.path}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <DocTypeThumbnail
                    thumbnail={result.thumbnail}
                    title={result.title}
                  />
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-md border-2 bg-transparent ${getCategoryColor(
                          result.category
                        )} border-current`}
                      >
                        {getCategoryIcon(result.category, 'size-5')}
                      </div>
                      <div>
                        <h3 className="font-semibold">{result.title}</h3>
                        {result.category && (
                          <p className="text-sm text-muted-foreground">
                            {getCategoryDisplayName(result.category)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {result.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {result.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ドキュメントページの検索結果 */}
      {categorizedResults.documents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            「{query}」関連のページ
          </h2>
          <ul className="space-y-4">
            {categorizedResults.documents.map((result: SearchResult) => (
              <li
                key={result.id}
                className="rounded-lg border p-4 hover:bg-accent/50"
              >
                <Link href={result.path} className="block">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${getCategoryColor(
                        result.category
                      )}`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {getCategoryDisplayName(result.category)}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mt-2">
                    <div className="flex-shrink-0 mt-1">
                      {result.category === 'wiki' ? (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        <HighlightedText
                          text={result.title}
                          searchTerm={query}
                        />
                      </h3>

                      {result.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          <HighlightedText
                            text={result.description}
                            searchTerm={query}
                          />
                        </p>
                      )}

                      {result.matchedContent && (
                        <div className="mt-2 text-sm bg-muted/50 p-2 rounded">
                          <p className="line-clamp-2">
                            <HighlightedText
                              text={result.matchedContent}
                              searchTerm={query}
                            />
                          </p>
                        </div>
                      )}

                      {/* パス情報 */}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {result.path}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
