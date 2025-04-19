'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Check,
  ChevronsUpDown,
  BookOpen,
  ChevronRight,
  FileText,
  BookMarked,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@kit/ui/sidebar';
import { Skeleton } from '@kit/ui/skeleton';
import { getCategoryDisplayName, getCategoryColor } from '~/lib/utils/category';
import {
  optimizeImageUrlSync,
  DEFAULT_THUMBNAIL_PATH,
} from '~/lib/utils/image';
import type { DocType, DocCategory } from '~/types/mdx';

// カテゴリごとのアイコンを取得する関数
function getCategoryIcon(category?: string) {
  switch (category) {
    case 'documents':
      return <BookMarked className="size-5" />;
    case 'wiki':
      return <FileText className="size-5" />;
    default:
      return <BookOpen className="size-5" />;
  }
}

export function DocTypeSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const [docTypes, setDocTypes] = useState<DocType[]>([]);
  const [categories, setCategories] = useState<DocCategory[]>([]);
  const [currentType, setCurrentType] = useState<DocType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // 画像の読み込み状態を保持するstate
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const fetchDocTypes = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/doc-types?includeCategories=true');
        if (!res.ok) {
          throw new Error(`Failed to fetch doc types: ${res.status}`);
        }
        const data = await res.json();

        // カテゴリとドキュメントタイプを設定
        if (data.categories && data.docTypes) {
          setCategories(data.categories);
          setDocTypes(data.docTypes);

          // 画像の読み込み状態を初期化
          const initialLoadingStates: Record<string, boolean> = {};
          for (const docType of data.docTypes) {
            initialLoadingStates[docType.id] = true;
          }
          for (const category of data.categories) {
            initialLoadingStates[`category-${category.id}`] = true;
          }
          setImageLoadingStates(initialLoadingStates);
        } else {
          // 後方互換性のため、配列の場合はドキュメントタイプとして扱う
          setDocTypes(Array.isArray(data) ? data : []);

          // 画像の読み込み状態を初期化
          const initialLoadingStates: Record<string, boolean> = {};
          if (Array.isArray(data)) {
            for (const docType of data) {
              initialLoadingStates[docType.id] = true;
            }
          }
          setImageLoadingStates(initialLoadingStates);
        }

        // パスから現在のドキュメントタイプを特定
        const pathParts = pathname.split('/');
        const currentDocTypeId =
          pathParts[1] ||
          (Array.isArray(data) ? data[0]?.id : data.docTypes[0]?.id) ||
          '';

        // 現在のドキュメントタイプを検索
        const allDocTypes = Array.isArray(data) ? data : data.docTypes || [];
        const currentDocType =
          allDocTypes.find((type: DocType) => type.id === currentDocTypeId) ||
          allDocTypes[0];

        setCurrentType(currentDocType);
      } catch (err) {
        console.error('Error fetching doc types:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocTypes();
  }, [pathname]);

  const handleTypeChange = (type: DocType) => {
    setCurrentType(type);
    router.push(`/${type.id}`);
  };

  // 画像の読み込み完了時の処理
  const handleImageLoad = (id: string) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  // 画像の読み込みエラー時の処理
  const handleImageError = (id: string) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <Skeleton className="h-9 w-9 rounded-md" />
            <div className="flex flex-col gap-0.5 w-full">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-4 ml-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // カテゴリごとにドキュメントタイプをグループ化
  const docTypesByCategory: Record<string, DocType[]> = {};
  const uncategorizedDocTypes: DocType[] = [];

  for (const docType of docTypes) {
    if (docType.category) {
      if (!docTypesByCategory[docType.category]) {
        docTypesByCategory[docType.category] = [];
      }
      docTypesByCategory[docType.category]?.push(docType);
    } else {
      uncategorizedDocTypes.push(docType);
    }
  }

  return (
    <SidebarMenu>
      {currentType && (
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div
                  className={`flex aspect-square size-9 items-center justify-center rounded-md border-2 bg-transparent ${getCategoryColor(currentType.category)} border-current`}
                >
                  {currentType.icon ? (
                    <div className="relative size-5">
                      {imageLoadingStates[currentType.id] && (
                        <Skeleton className="absolute inset-0 z-10" />
                      )}
                      <Image
                        src={optimizeImageUrlSync(currentType.icon)}
                        alt={currentType.title}
                        width={20}
                        height={20}
                        className="size-5"
                        onLoad={() => handleImageLoad(currentType.id)}
                        onError={() => handleImageError(currentType.id)}
                        style={{
                          opacity: imageLoadingStates[currentType.id] ? 0 : 1,
                          transition: 'opacity 0.2s ease-in-out',
                        }}
                      />
                    </div>
                  ) : (
                    getCategoryIcon(currentType.category)
                  )}
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{currentType.title}</span>
                  {currentType.category && (
                    <span className="text-xs text-muted-foreground">
                      {categories.find((c) => c.id === currentType.category)
                        ?.title || getCategoryDisplayName(currentType.category)}
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width]"
              align="start"
            >
              {/* カテゴリがある場合は、カテゴリごとにサブメニューを表示 */}
              {categories.length > 0 &&
                Object.keys(docTypesByCategory).length > 0 && (
                  <>
                    {categories.map((category) => {
                      const categoryDocTypes =
                        docTypesByCategory[category.id] || [];
                      if (categoryDocTypes.length === 0) return null;

                      return (
                        <DropdownMenuSub key={category.id}>
                          <DropdownMenuSubTrigger className="flex items-center gap-2">
                            {category.icon ? (
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-md border-2 bg-transparent ${getCategoryColor(category.id)} border-current`}
                              >
                                <div className="relative size-5">
                                  {imageLoadingStates[
                                    `category-${category.id}`
                                  ] && (
                                    <Skeleton className="absolute inset-0 z-10" />
                                  )}
                                  <Image
                                    src={optimizeImageUrlSync(category.icon)}
                                    alt={category.title}
                                    width={20}
                                    height={20}
                                    className="size-5"
                                    onLoad={() =>
                                      handleImageLoad(`category-${category.id}`)
                                    }
                                    onError={() =>
                                      handleImageError(
                                        `category-${category.id}`
                                      )
                                    }
                                    style={{
                                      opacity: imageLoadingStates[
                                        `category-${category.id}`
                                      ]
                                        ? 0
                                        : 1,
                                      transition: 'opacity 0.2s ease-in-out',
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-md border-2 bg-transparent ${getCategoryColor(category.id)} border-current`}
                              >
                                {getCategoryIcon(category.id)}
                              </div>
                            )}
                            <span>{category.title}</span>
                            <ChevronRight className="ml-auto size-4" />
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {categoryDocTypes.map((type) => (
                              <DropdownMenuItem
                                key={type.id}
                                onSelect={() => handleTypeChange(type)}
                                className="flex flex-col items-start gap-1 py-2"
                              >
                                <div className="flex w-full items-center gap-2">
                                  {type.icon ? (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-md border-2 bg-transparent border-current">
                                      <div className="relative size-5">
                                        {imageLoadingStates[type.id] && (
                                          <Skeleton className="absolute inset-0 z-10" />
                                        )}
                                        <Image
                                          src={optimizeImageUrlSync(type.icon)}
                                          alt={type.title}
                                          width={20}
                                          height={20}
                                          className="size-5"
                                          onLoad={() =>
                                            handleImageLoad(type.id)
                                          }
                                          onError={() =>
                                            handleImageError(type.id)
                                          }
                                          style={{
                                            opacity: imageLoadingStates[type.id]
                                              ? 0
                                              : 1,
                                            transition:
                                              'opacity 0.2s ease-in-out',
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-md border-2 bg-transparent border-current">
                                      {getCategoryIcon(type.category)}
                                    </div>
                                  )}
                                  <span className="font-medium">
                                    {type.title}
                                  </span>
                                  {type.id === currentType.id && (
                                    <Check className="ml-auto size-4" />
                                  )}
                                </div>
                                {type.description && (
                                  <span className="text-xs text-muted-foreground pl-6">
                                    {type.description}
                                  </span>
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      );
                    })}

                    {/* カテゴリなしのドキュメントタイプがある場合は区切り線を表示 */}
                    {uncategorizedDocTypes.length > 0 && (
                      <DropdownMenuSeparator />
                    )}
                  </>
                )}

              {/* カテゴリなしのドキュメントタイプを表示 */}
              {uncategorizedDocTypes.map((type) => (
                <DropdownMenuItem
                  key={type.id}
                  onSelect={() => handleTypeChange(type)}
                  className="flex flex-col items-start gap-1 py-2"
                >
                  <div className="flex w-full items-center gap-2">
                    {type.icon ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-md border-2 bg-transparent border-current">
                        <div className="relative size-5">
                          {imageLoadingStates[type.id] && (
                            <Skeleton className="absolute inset-0 z-10" />
                          )}
                          <Image
                            src={optimizeImageUrlSync(type.icon)}
                            alt={type.title}
                            width={20}
                            height={20}
                            className="size-5"
                            onLoad={() => handleImageLoad(type.id)}
                            onError={() => handleImageError(type.id)}
                            style={{
                              opacity: imageLoadingStates[type.id] ? 0 : 1,
                              transition: 'opacity 0.2s ease-in-out',
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-md border-2 bg-transparent border-current">
                        <BookOpen className="size-5" />
                      </div>
                    )}
                    <span className="font-medium">{type.title}</span>
                    {type.id === currentType.id && (
                      <Check className="ml-auto size-4" />
                    )}
                  </div>
                  {type.description && (
                    <span className="text-xs text-muted-foreground pl-6">
                      {type.description}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
