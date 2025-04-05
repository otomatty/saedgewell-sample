'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, AlertCircle, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sidebar as SidebarRoot,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@kit/ui/sidebar';
import { DocTree } from '../navigation/doc-tree';
import { DocTreeSkeleton } from '../navigation/doc-tree-skeleton';
import type { DocNode } from '~/types/mdx';
import type { DocType } from '~/types/mdx';
import { optimizeImageUrlSync } from '~/lib/utils/image';

// サイドバーを表示するパスのリスト
const SIDEBAR_PATHS = ['documents', 'wiki', 'development'];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [docTree, setDocTree] = useState<DocNode[]>([]);
  const [currentDocInfo, setCurrentDocInfo] = useState<DocType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // パスから現在のドキュメントタイプを取得
  const currentDocType = pathname.split('/')[1] || 'docs';

  // サイドバーを表示するかどうかを判定
  const shouldShowSidebar = SIDEBAR_PATHS.some(
    (path) => pathname === `/${path}` || pathname.startsWith(`/${path}/`)
  );

  // 現在のサブディレクトリを取得（例: /documents/makerkit/page -> makerkit）
  const pathParts = pathname.split('/');
  const currentSubDir = pathParts.length > 2 ? pathParts[2] : null;

  // 現在のドキュメント情報を取得
  useEffect(() => {
    // サイドバーを表示しない場合は何もしない
    if (!shouldShowSidebar) return;

    const fetchCurrentDocInfo = async () => {
      if (!currentSubDir || currentDocType !== 'documents') return;

      try {
        const res = await fetch(`/api/doc-types?id=${currentSubDir}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch doc info: ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCurrentDocInfo(data[0]);
        } else if (data?.id) {
          setCurrentDocInfo(data);
        } else {
          // APIからデータが取得できない場合は、ディレクトリ名をタイトルとして使用
          setCurrentDocInfo({
            id: currentSubDir,
            title:
              currentSubDir.charAt(0).toUpperCase() + currentSubDir.slice(1),
            category: 'documents',
          });
        }
      } catch (err) {
        console.error('Error fetching doc info:', err);
        // エラー時もディレクトリ名をタイトルとして使用
        setCurrentDocInfo({
          id: currentSubDir,
          title: currentSubDir.charAt(0).toUpperCase() + currentSubDir.slice(1),
          category: 'documents',
        });
      }
    };

    fetchCurrentDocInfo();
  }, [currentDocType, currentSubDir, shouldShowSidebar]);

  useEffect(() => {
    // サイドバーを表示しない場合は何もしない
    if (!shouldShowSidebar) return;

    const fetchDocs = async () => {
      try {
        setIsLoading(true);

        // サブディレクトリが指定されている場合は、そのサブディレクトリのコンテンツのみを取得
        const apiUrl =
          currentSubDir && currentDocType === 'documents'
            ? `/api/docs/${currentDocType}?subDir=${currentSubDir}`
            : `/api/docs/${currentDocType}`;

        const res = await fetch(apiUrl);
        if (!res.ok) {
          // 404の場合は空の配列を設定して処理を続行
          if (res.status === 404) {
            console.warn(`Directory not found: ${apiUrl}`);
            setDocTree([]);
            return;
          }
          throw new Error(`Failed to fetch docs: ${res.status}`);
        }
        const data = await res.json();
        setDocTree(data);
      } catch (err) {
        console.error('Error fetching docs:', err);
        // エラーメッセージを設定するが、空の配列も設定して表示を継続
        setError(
          err instanceof Error ? err.message : 'Failed to load documentation'
        );
        setDocTree([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocs();
  }, [currentDocType, currentSubDir, shouldShowSidebar]);

  const handleHomeClick = () => {
    router.push('/');
  };

  // 現在のコンテンツへのパスを生成
  const currentContentPath =
    currentSubDir && currentDocType === 'documents'
      ? `/documents/${currentSubDir}`
      : `/${currentDocType}`;

  // サイドバーを表示しない場合は何も表示しない
  if (!shouldShowSidebar) {
    return null;
  }

  return (
    <SidebarRoot>
      <SidebarHeader className="border-b p-4">
        {currentSubDir && currentDocType === 'documents' ? (
          <Link
            href={currentContentPath}
            className="flex items-center gap-3 hover:opacity-80"
          >
            {currentDocInfo?.icon ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-md border-2 bg-transparent border-current">
                <Image
                  src={optimizeImageUrlSync(currentDocInfo.icon)}
                  alt={currentDocInfo.title || currentSubDir}
                  width={20}
                  height={20}
                  className="size-5"
                />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-md border-2 bg-transparent border-current">
                <span className="text-sm font-bold">
                  {(currentDocInfo?.title || currentSubDir)
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
            )}
            <h2 className="text-lg font-semibold">
              {currentDocInfo?.title || currentSubDir}
            </h2>
          </Link>
        ) : (
          <h2 className="text-lg font-semibold">
            {currentDocType === 'wiki' ? 'Wiki' : 'ドキュメント'}
          </h2>
        )}
      </SidebarHeader>

      <SidebarContent>
        {error ? (
          <div className="p-4">
            <div className="rounded-md bg-destructive/10 p-3 text-destructive">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">
                  ドキュメントの読み込みに失敗しました
                </p>
              </div>
              <p className="mt-2 text-xs">{error}</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="p-4">
            <DocTreeSkeleton depth={2} itemsPerLevel={5} />
          </div>
        ) : docTree.length === 0 ? (
          <div className="p-4">
            <div className="rounded-md bg-muted p-4 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">
                ドキュメントがありません
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                このカテゴリにはまだドキュメントが追加されていません
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <DocTree items={docTree} docType={currentDocType} />
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={handleHomeClick}
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Home className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">ホームに戻る</span>
                <span className="text-xs text-muted-foreground">
                  コンテンツを選択する
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarRoot>
  );
}
