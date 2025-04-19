import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import type { DocNode } from '~/types/mdx';
import { DocFrontmatterSchema, generateTitleFromFilename } from './frontmatter';
import { getDocRootPath } from '~/config/paths';

const docTreeCache = new Map<string, { data: DocNode[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5分

/**
 * ドキュメントツリーを構築する
 * @param contentDir コンテンツディレクトリのパス（.docsからの相対パス）
 * @param isAuthenticated ユーザーが認証済みかどうか
 * @returns ドキュメントツリー
 */
export function getDocTree(
  contentDir = '',
  isAuthenticated = false
): DocNode[] {
  // キャッシュのキーに認証状態を含める
  const cacheKey = `${contentDir}:${isAuthenticated ? 'auth' : 'noauth'}`;

  // キャッシュチェック
  const cached = docTreeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const baseDir = getDocRootPath();
  const docsDir = contentDir ? join(baseDir, contentDir) : baseDir;

  // ディレクトリが存在しない場合は空の配列を返す
  if (!existsSync(docsDir)) {
    console.warn(`Warning: Directory not found: ${docsDir}`);
    return [];
  }

  function buildTree(dir: string, parentSlug = ''): DocNode[] {
    try {
      // ディレクトリが存在しない場合は空の配列を返す
      if (!existsSync(dir)) {
        console.warn(`Warning: Directory not found: ${dir}`);
        return [];
      }

      const items = readdirSync(dir, { withFileTypes: true });
      const nodes: DocNode[] = [];

      for (const item of items) {
        // 隠しファイルと_で始まるファイル/ディレクトリを除外
        if (item.name.startsWith('.') || item.name.startsWith('_')) continue;

        const path = join(dir, item.name);
        const slug = parentSlug ? `${parentSlug}/${item.name}` : item.name;

        try {
          if (item.isDirectory()) {
            // index.jsonを優先的に確認
            const indexJsonPath = join(path, 'index.json');
            const indexMdxPath = join(path, 'index.mdx');
            let frontmatter: z.infer<typeof DocFrontmatterSchema> | null = null;

            try {
              if (readdirSync(path).includes('index.json')) {
                const indexContent = readFileSync(indexJsonPath, 'utf-8');
                frontmatter = DocFrontmatterSchema.parse(
                  JSON.parse(indexContent)
                );
              } else if (readdirSync(path).includes('index.mdx')) {
                const indexContent = readFileSync(indexMdxPath, 'utf-8');
                const { data } = matter(indexContent);
                frontmatter = DocFrontmatterSchema.parse(data);
              }
            } catch (error) {
              console.warn(`Warning: No valid index file found in ${path}`);
            }

            // ステータスによるフィルタリング
            if (
              (frontmatter?.status === 'private' && !isAuthenticated) ||
              (frontmatter?.status === 'draft' && !isAuthenticated)
            ) {
              // 非公開または下書きのディレクトリは認証されていないユーザーには表示しない
              continue;
            }

            // ディレクトリの子要素を取得
            const children = buildTree(path, slug);

            // 子要素があるか、index.jsonまたはindex.mdxがある場合のみディレクトリを表示
            if (children.length > 0 || frontmatter) {
              nodes.push({
                title: frontmatter?.title ?? item.name,
                description: frontmatter?.description,
                order:
                  typeof frontmatter?.order === 'number'
                    ? frontmatter.order
                    : 0,
                slug: slug.replace(/\\/g, '/'),
                children,
              });
            }
          } else if (item.name.endsWith('.mdx') && item.name !== 'index.mdx') {
            const content = readFileSync(path, 'utf-8');
            const { data } = matter(content);
            const frontmatter = DocFrontmatterSchema.parse(data);
            const title =
              frontmatter.title ?? generateTitleFromFilename(item.name);

            // ステータスによるフィルタリング
            if (
              (frontmatter.status === 'private' && !isAuthenticated) ||
              (frontmatter.status === 'draft' && !isAuthenticated)
            ) {
              // 非公開または下書きのファイルは認証されていないユーザーには表示しない
              continue;
            }

            nodes.push({
              ...frontmatter,
              title,
              slug: slug.replace(/\\/g, '/').replace(/\.mdx$/, ''),
              children: [],
            });
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.warn(
              `Warning: Invalid frontmatter in ${path}, using filename as title`
            );
            if (item.name.endsWith('.mdx') && item.name !== 'index.mdx') {
              nodes.push({
                title: generateTitleFromFilename(item.name),
                slug: slug.replace(/\\/g, '/').replace(/\.mdx$/, ''),
                children: [],
              });
            }
          } else {
            console.warn(`Warning: ${path} not found or invalid:`, error);
          }
        }
      }

      return nodes.sort((a, b) => {
        const aOrder = typeof a.order === 'number' ? a.order : 0;
        const bOrder = typeof b.order === 'number' ? b.order : 0;
        return aOrder - bOrder;
      });
    } catch (error) {
      console.error(`Error processing directory ${dir}:`, error);
      return [];
    }
  }

  const result = buildTree(docsDir);

  // キャッシュを更新
  docTreeCache.set(cacheKey, { data: result, timestamp: Date.now() });

  return result;
}
