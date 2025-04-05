'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { Card, CardContent, CardHeader, CardFooter } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { Skeleton } from '@kit/ui/skeleton';
import { getTagDisplayName } from '~/lib/mdx/tag-mappings';
import {
  generatePlaceholderImage,
  DEFAULT_THUMBNAIL_PATH,
} from '~/lib/utils/image';
import { optimizeImageWithApi, preloadImage } from '~/lib/utils/optimizeImage';
import {
  imageUrlAtom,
  updateImageUrlAtom,
  imageStatesAtom,
  updateImageStateAtom,
  type ImageState,
} from '~/store/imageCache';
import {
  getCategoryIcon,
  getCategoryDisplayName,
  getCategoryColor,
} from '~/lib/utils/category';
import { getDocTypePath } from '~/lib/utils/path';
import type { DocType } from '~/types/mdx';

interface DocCardProps {
  docType: DocType;
}

// 標準的なプレースホルダー画像
const DEFAULT_PLACEHOLDER = generatePlaceholderImage();

// タグの表示数の制限
const MAX_TAGS_TO_DISPLAY = 3;

export function DocCard({ docType }: DocCardProps) {
  // グローバルな画像URLキャッシュを使用
  const [imageUrlCache] = useAtom(imageUrlAtom);
  const [, updateImageUrl] = useAtom(updateImageUrlAtom);

  // グローバルな画像状態を使用
  const [imageStates] = useAtom(imageStatesAtom);
  const [, updateImageState] = useAtom(updateImageStateAtom);

  // 安定したupdateImageUrlとupdateImageStateの参照を作成
  const updateImageUrlRef = useRef(updateImageUrl);
  const updateImageStateRef = useRef(updateImageState);
  const processedRef = useRef(false);

  // 参照を更新
  useEffect(() => {
    updateImageUrlRef.current = updateImageUrl;
    updateImageStateRef.current = updateImageState;
  }, [updateImageUrl, updateImageState]);

  // 画像URLを最適化する
  useEffect(() => {
    const loadImage = async () => {
      // すでに処理済みの場合はスキップ
      if (processedRef.current) return;
      processedRef.current = true;

      // 初期状態を設定
      updateImageStateRef.current({
        id: docType.id,
        state: { loading: true, ready: false },
      });

      if (!docType.thumbnail) {
        // サムネイルがない場合はデフォルト画像を使用
        updateImageStateRef.current({
          id: docType.id,
          state: { loading: false, ready: true },
        });
        return;
      }

      // キャッシュを確認
      const cachedUrl = imageUrlCache.get(docType.thumbnail);
      if (cachedUrl) {
        // キャッシュにある場合はそれを使用
        updateImageStateRef.current({
          id: docType.id,
          state: { loading: false, ready: true },
        });
        return;
      }

      try {
        // キャッシュにない場合はAPIから取得
        const optimizedUrl = await optimizeImageWithApi(docType.thumbnail);

        // キャッシュに追加
        updateImageUrlRef.current({
          originalUrl: docType.thumbnail,
          optimizedUrl,
        });

        if (typeof window !== 'undefined') {
          try {
            // 画像をプリロード
            await preloadImage(optimizedUrl);

            // 状態を更新
            updateImageStateRef.current({
              id: docType.id,
              state: { loading: false, ready: true },
            });
          } catch (error) {
            console.error(`Error preloading image for ${docType.id}:`, error);

            // エラー時はデフォルト画像を使用
            updateImageUrlRef.current({
              originalUrl: docType.thumbnail,
              optimizedUrl: DEFAULT_THUMBNAIL_PATH,
            });

            updateImageStateRef.current({
              id: docType.id,
              state: { loading: false, ready: true },
            });
          }
        }
      } catch (error) {
        console.error(`Error optimizing image for ${docType.id}:`, error);

        // エラー時はデフォルト画像を使用
        updateImageUrlRef.current({
          originalUrl: docType.thumbnail,
          optimizedUrl: DEFAULT_THUMBNAIL_PATH,
        });

        updateImageStateRef.current({
          id: docType.id,
          state: { loading: false, ready: true },
        });
      }
    };

    loadImage();
  }, [docType, imageUrlCache]);

  // 画像URLを取得する関数
  const getImageUrl = (): string => {
    if (!docType.thumbnail) return DEFAULT_THUMBNAIL_PATH;
    return imageUrlCache.get(docType.thumbnail) || DEFAULT_THUMBNAIL_PATH;
  };

  // 画像の読み込み状態を取得
  const getImageState = (): ImageState => {
    return imageStates.get(docType.id) || { loading: true, ready: false };
  };

  const imageState = getImageState();

  // タグを処理
  const tags = Array.isArray(docType.tags)
    ? docType.tags
    : docType.tags && typeof docType.tags === 'object'
      ? Object.values(docType.tags)
          .filter(Array.isArray)
          .flat()
          .filter((tag): tag is string => typeof tag === 'string')
      : [];

  // 表示するタグを最大数に制限
  const displayTags = tags.slice(0, MAX_TAGS_TO_DISPLAY);
  const hasMoreTags = tags.length > MAX_TAGS_TO_DISPLAY;

  return (
    <Link href={getDocTypePath(docType)}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted/30">
          {/* スケルトンローディング - 画像読み込み中のみ表示 */}
          {imageState.loading && (
            <div className="absolute inset-0 z-10">
              <Skeleton className="h-full w-full" />
            </div>
          )}

          {/* 画像は準備完了状態のときのみ表示 */}
          {imageState.ready && (
            <Image
              src={getImageUrl()}
              alt={docType.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-2"
              quality={80}
              priority={false}
              loading="lazy"
              blurDataURL={DEFAULT_PLACEHOLDER}
              placeholder="blur"
            />
          )}
        </div>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-md border-2 bg-transparent ${getCategoryColor(docType.category)} border-current`}
            >
              {getCategoryIcon(docType.category, 'size-5')}
            </div>
            <div>
              <h3 className="font-semibold">{docType.title}</h3>
              {docType.category && (
                <p className="text-sm text-muted-foreground">
                  {getCategoryDisplayName(docType.category)}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        {docType.description && (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {docType.description}
            </p>
          </CardContent>
        )}
        {displayTags.length > 0 && (
          <CardFooter>
            <div className="flex flex-wrap gap-1.5">
              {displayTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  # {getTagDisplayName(tag)}
                </Badge>
              ))}
              {hasMoreTags && (
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  +{tags.length - MAX_TAGS_TO_DISPLAY}
                </Badge>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
