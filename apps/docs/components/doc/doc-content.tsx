'use client';

import {
  Suspense,
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { MDXContent } from '~/components/mdx';
import {
  TableOfContents,
  type TOCItem,
} from '~/components/toc/table-of-contents';
import { TableOfContentsSkeleton } from '~/components/toc/table-of-contents-skeleton';
import { TextToSpeechControls } from '~/components/doc/text-to-speech-controls';
import { GeminiSpeechControls } from '~/components/doc/gemini-speech-controls';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { PageHeader } from '@kit/ui/page-header';
import { DocNavigation } from '~/components/doc/doc-navigation';
import { BreadcrumbNavigation } from '~/components/doc/navigation';
import { Badge } from '@kit/ui/badge';
import dynamic from 'next/dynamic';

// クライアントサイドでのみレンダリングするためにdynamicインポートを使用
const PdfButton = dynamic(
  () => import('~/components/doc/pdf/pdf-button').then((mod) => mod.PdfButton),
  { ssr: false }
);

interface DocContentProps {
  code: MDXRemoteSerializeResult;
  frontmatter: {
    title?: string;
    description?: string;
    order?: number;
    status?: 'published' | 'draft' | 'private';
  };
  adjacentDocs?: {
    prev: { title: string; slug: string[] } | null;
    next: { title: string; slug: string[] } | null;
  };
  slug?: string[];
}

export function DocContent({
  code,
  frontmatter,
  adjacentDocs,
  slug = [],
}: DocContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [docText, setDocText] = useState<string>('');
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // ステータスに応じたバッジの色を取得
  const getStatusBadgeVariant = useMemo(() => {
    switch (frontmatter.status) {
      case 'draft':
        return 'secondary' as const;
      case 'private':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  }, [frontmatter.status]);

  // ステータスに応じたバッジのテキストを取得
  const getStatusBadgeText = useMemo(() => {
    switch (frontmatter.status) {
      case 'draft':
        return '下書き';
      case 'private':
        return '非公開';
      default:
        return '公開';
    }
  }, [frontmatter.status]);

  // フロントマターのタイトルから初期見出しを生成
  const initialHeadings = useMemo(() => {
    if (!frontmatter.title) {
      return [];
    }

    const slug = frontmatter.title.toLowerCase().replace(/\s+/g, '-');
    const heading = {
      id: slug,
      text: frontmatter.title,
      level: 1,
    };

    return [heading];
  }, [frontmatter.title]);

  // ドキュメントのテキストコンテンツを取得する関数
  const getDocumentText = useCallback(() => {
    if (!contentRef.current) return '';

    const textContent = contentRef.current.textContent || '';

    // タイトルとディスクリプションを追加
    let fullText = '';
    if (frontmatter.title) {
      fullText += `${frontmatter.title}。 `;
    }
    if (frontmatter.description) {
      fullText += `${frontmatter.description}。 `;
    }

    fullText += textContent;
    console.log('Generated document text, length:', fullText.length);
    return fullText;
  }, [frontmatter.title, frontmatter.description]);

  // 見出しをクリックしたときのハンドラー
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // レンダリング後にDOM要素から見出しを抽出する
  useEffect(() => {
    const extractHeadingsFromDOM = () => {
      if (!contentRef.current) return;

      // h2〜h6要素を取得（h1はPageHeaderで使用するため除外）
      const headingElements =
        contentRef.current.querySelectorAll('h2, h3, h4, h5, h6');

      // 既存のIDマップを追跡
      const idMap = new Map<string, number>();

      // 見出し要素から目次アイテムを生成
      const extractedHeadings: TOCItem[] = Array.from(headingElements).map(
        (element) => {
          const level = Number.parseInt(element.tagName.substring(1), 10);
          const text = element.textContent || '';
          let id =
            element.id ||
            text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');

          // 同じIDが既に存在する場合、インデックスを追加
          if (idMap.has(id)) {
            const count = (idMap.get(id) || 0) + 1;
            idMap.set(id, count);
            const newId = `${id}-${count}`;
            console.log(`Duplicate ID detected: ${id} -> ${newId}`);
            id = newId;
          } else {
            idMap.set(id, 0);
          }

          // IDがない場合は追加
          if (!element.id) {
            element.id = id;
          }

          return {
            id,
            text,
            level,
          };
        }
      );

      console.log('Extracted headings from DOM:', extractedHeadings);

      // フロントマターのタイトルが見出しに含まれていない場合は追加
      if (
        frontmatter.title &&
        !extractedHeadings.some((h) => h.text === frontmatter.title)
      ) {
        // タイトル用のIDを生成（既存のIDと衝突しないように）
        const titleId = frontmatter.title.toLowerCase().replace(/\s+/g, '-');

        let uniqueTitleId = titleId;

        // 既存のIDと衝突する場合は接尾辞を追加
        if (idMap.has(titleId)) {
          const count = (idMap.get(titleId) || 0) + 1;
          idMap.set(titleId, count);
          uniqueTitleId = `${titleId}-${count}`;
        } else {
          idMap.set(titleId, 0);
        }

        const titleHeading = {
          id: uniqueTitleId,
          text: frontmatter.title,
          level: 1,
        };

        setHeadings([titleHeading, ...extractedHeadings]);
      } else {
        setHeadings(extractedHeadings);
      }
    };

    // コンテンツがレンダリングされた後に見出しを抽出
    const timer = setTimeout(() => {
      extractHeadingsFromDOM();
      const text = getDocumentText();
      console.log('Document text extracted, length:', text.length);
      setDocText(text);
    }, 1000); // コンテンツがレンダリングされるのを待つ

    return () => clearTimeout(timer);
  }, [getDocumentText, frontmatter.title]);

  // 見出しの可視性を監視
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 画面内に入った見出しのうち、最も上にあるものをアクティブにする
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // 複数の見出しが表示されている場合は、最も上にあるものを選択
          const topEntry = visibleEntries.reduce((prev, current) => {
            return prev.boundingClientRect.top > current.boundingClientRect.top
              ? current
              : prev;
          });
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: '-80px 0% -80% 0%',
        threshold: 0.1, // 少しでも見えたらトリガー
      }
    );

    for (const heading of headings) {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  return (
    <div className="container relative max-w-7xl py-6 lg:py-10">
      <BreadcrumbNavigation slug={slug} />

      <div className="mb-4">
        <PageHeader
          title={frontmatter.title || ''}
          description={frontmatter.description}
          className="pr-16"
          actions={
            <div className="flex items-center space-x-2">
              {frontmatter.status && frontmatter.status !== 'published' && (
                <Badge variant={getStatusBadgeVariant}>
                  {getStatusBadgeText}
                </Badge>
              )}
              <PdfButton
                contentRef={contentRef as React.RefObject<HTMLElement>}
                title={frontmatter.title}
                filename={`${slug.join('-') || 'document'}.pdf`}
              />
            </div>
          }
        />
      </div>

      {/* 音声読み上げコントロール */}
      <Suspense fallback={null}>
        <TextToSpeechControls text={docText} />
        <GeminiSpeechControls text={docText} />
      </Suspense>

      <div className="flex flex-col justify-between lg:flex-row">
        <div className="min-w-0 flex-1">
          <div ref={contentRef} className="mdx">
            <MDXContent code={code} />
          </div>
        </div>

        <div className="hidden xl:block">
          <div className="sticky top-16 ml-auto w-[280px] pl-10">
            <Suspense fallback={<TableOfContentsSkeleton />}>
              <TableOfContents
                headings={headings.length > 0 ? headings : initialHeadings}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {adjacentDocs && <DocNavigation adjacentDocs={adjacentDocs} />}
    </div>
  );
}
