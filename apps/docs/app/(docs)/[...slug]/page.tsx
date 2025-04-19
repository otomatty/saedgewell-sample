import { notFound } from 'next/navigation';
import { getAdjacentDocs } from '~/lib/mdx/docs';
import { getDocFromParams } from '~/actions/mdx/mdx-processor';
import { DocContent } from '~/components/doc/doc-content';
import { ErrorBoundary } from '~/components/error/error-boundary';
import { existsSync } from 'node:fs';
import { getContentPath } from '~/config/paths';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function DocPage(props: PageProps) {
  const params = await props.params;

  // デバッグ情報
  console.log('DocPage: Received slug params:', params.slug);

  // APIパスの場合は404を返す
  if (params.slug[0] === 'api') {
    console.log('DocPage: API path detected, returning 404');
    return notFound();
  }

  // 静的アセットファイルの場合は404を返す
  const staticAssetExtensions = [
    '.svg',
    '.ico',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
  ];
  if (
    params.slug.some((segment) =>
      staticAssetExtensions.some((ext) => segment.endsWith(ext))
    )
  ) {
    console.log('DocPage: Static asset requested, returning 404');
    return notFound();
  }

  try {
    // パスの検証
    if (params.slug.length < 1) {
      console.error('DocPage: Invalid path - need at least category');
      return notFound();
    }

    const [category, ...restSlug] = params.slug;
    console.log(
      `DocPage: Processing document for category=${category}, restSlug=${restSlug.join('/')}`
    );

    // 許可されたカテゴリのみ処理
    const allowedCategories = ['documents', 'wiki', 'development', 'journals'];
    if (!category || !allowedCategories.includes(category)) {
      console.error(`DocPage: Invalid category: ${category}`);
      return notFound();
    }

    let contentDir: string;
    let processedSlug: string[];

    // カテゴリごとに異なる処理を行う
    if (category === 'wiki') {
      // wikiカテゴリの場合、2番目のパスセグメントはファイル名
      if (restSlug.length === 0) {
        // wiki/index の場合
        contentDir = getContentPath(category);
        processedSlug = [category];
      } else {
        // wiki/{filename} の場合
        const filename = restSlug[0] || '';
        contentDir = getContentPath(category);
        processedSlug = [category, filename];
      }
    } else if (category === 'journals') {
      // journals カテゴリの場合の特別処理
      if (restSlug.length === 0) {
        // journals/ の場合（インデックスページ）
        contentDir = getContentPath(category);
        processedSlug = [category];
        console.log(`DocPage: journals index path - contentDir=${contentDir}`);
      } else if (restSlug.length === 1) {
        // journals/2025-03-21 のような日付ディレクトリの場合（日付インデックスページ）
        const dateDir = restSlug[0] || '';
        contentDir = getContentPath(category, dateDir);
        processedSlug = [category, dateDir];
        console.log(
          `DocPage: journals date directory path - contentDir=${contentDir}, processedSlug=${processedSlug.join('/')}`
        );
      } else {
        // journals/2025-03-21/slug などの場合（特定の記事）
        const [dateDir = '', ...fileSlug] = restSlug;
        const filename = fileSlug.join('/');
        contentDir = getContentPath(category, dateDir);

        // ファイル名がなく、ディレクトリだけの場合はディレクトリパスを使用
        if (fileSlug.length === 0) {
          processedSlug = [category, dateDir];
        } else {
          // .mdxを含めないようにする
          const cleanFilename = filename.endsWith('.mdx')
            ? filename.slice(0, -4)
            : filename;
          processedSlug = [category, dateDir, cleanFilename];
        }

        console.log(
          `DocPage: journals article path - contentDir=${contentDir}, processedSlug=${processedSlug.join('/')}, dateDir=${dateDir}, filename=${filename}`
        );
      }
    } else if (category === 'documents' || category === 'development') {
      // documents や development など、通常の階層構造を持つカテゴリ
      if (restSlug.length === 0) {
        console.error(`DocPage: Invalid docType for category ${category}`);
        return notFound();
      }

      const docType = restSlug[0] || '';
      contentDir = getContentPath(category, docType);
      processedSlug = params.slug;
    } else {
      console.error(`DocPage: Unhandled category: ${category}`);
      return notFound();
    }

    // ディレクトリの存在確認
    if (!existsSync(contentDir)) {
      console.error(`DocPage: Content directory not found: ${contentDir}`);
      return notFound();
    }

    // ドキュメントの取得
    const doc = await getDocFromParams(processedSlug);

    if (!doc) {
      console.error('DocPage: Document not found after processing');
      return notFound();
    }

    // 前後のドキュメントを取得
    const adjacentDocs = await getAdjacentDocs(processedSlug);

    return (
      <ErrorBoundary>
        <DocContent
          code={doc.code}
          frontmatter={doc.frontmatter}
          adjacentDocs={adjacentDocs}
          slug={params.slug}
        />
      </ErrorBoundary>
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in DocPage:', {
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error('Unknown error in DocPage:', error);
    }
    throw error;
  }
}
