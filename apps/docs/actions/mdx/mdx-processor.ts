'use server';

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { cache } from 'react';
import type { DocFrontmatter } from '../../types/mdx';
import { DocFrontmatterSchema } from '../../lib/mdx/frontmatter';
import { remarkKeywordLinks } from '../../lib/mdx/remark-keyword-links';
import { getContentPath } from '../../config/paths';
import { getAuthState } from '@kit/next/actions';

// rehype-highlightの設定
const highlightOptions = {
  ignoreMissing: true,
  subset: false,
};

// MDXのシリアライズオプション
const serializeOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, [remarkKeywordLinks, { docType: 'wiki' }]],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypeHighlight, highlightOptions],
    ],
    format: 'mdx' as const,
  },
  parseFrontmatter: true,
};

/**
 * ドキュメントのパラメータからMDXコンテンツを取得する
 * @param slug スラッグ配列
 * @param checkStatus 公開状態をチェックするかどうか（デフォルトはtrue）
 * @returns フロントマターとMDXコード
 */
export async function getDocFromParams(
  slug: string[],
  checkStatus = true
): Promise<{
  frontmatter: DocFrontmatter;
  code: MDXRemoteSerializeResult;
}> {
  try {
    console.log(`getDocFromParams: Processing slug=${slug.join('/')}`);
    const doc = await getDocBySlug(slug);

    // ステータスによる表示制御
    if (checkStatus) {
      // 認証状態を取得
      let isAdmin = false;
      try {
        const authState = await getAuthState();
        isAdmin = authState.profile?.isAdmin || false;
      } catch (error) {
        console.error('認証状態の取得に失敗しました:', error);
      }

      // 非公開ドキュメントは管理者ユーザーのみ閲覧可能
      if (doc.frontmatter.status === 'private' && !isAdmin) {
        throw new Error('このドキュメントを閲覧する権限がありません');
      }

      // 下書きは管理者ユーザーのみ閲覧可能
      if (doc.frontmatter.status === 'draft' && !isAdmin) {
        throw new Error('この下書きドキュメントを閲覧する権限がありません');
      }
    }

    return doc;
  } catch (error) {
    console.error(`Error getting doc from params: ${slug.join('/')}`, error);
    throw new Error(`ドキュメントの取得に失敗しました: ${slug.join('/')}`);
  }
}

/**
 * スラッグからドキュメントを取得する
 * @param slug スラッグ配列
 * @returns フロントマターとMDXコード
 */
export const getDocBySlug = cache(async (slug: string[]) => {
  if (!slug || slug.length === 0) {
    throw new Error('スラッグが指定されていません');
  }

  // スラッグからファイルパスを構築
  const filePath = getContentPath(...slug);
  console.log(
    `getDocBySlug: Generated filePath=${filePath} from slug=${slug.join('/')}`
  );

  let fullPath = '';

  // journals特有の処理 - journals/2023-03-21/slug のようなパス構造
  if (slug[0] === 'journals' && slug.length >= 3) {
    const category = slug[0];
    const dateDir = slug[1] || '';
    const mdxFile = slug[2] || '';
    const journalPath = getContentPath(category, dateDir, `${mdxFile}.mdx`);
    console.log(
      `getDocBySlug: Checking journals specific path: ${journalPath}`
    );

    if (existsSync(journalPath)) {
      fullPath = journalPath;
      console.log(`getDocBySlug: Found journals MDX file at ${fullPath}`);
    }
  }

  // 通常のパスの確認 (journalsの特殊処理で見つからなかった場合)
  if (!fullPath) {
    if (existsSync(`${filePath}.mdx`)) {
      fullPath = `${filePath}.mdx`;
      console.log(`getDocBySlug: Found MDX file at ${fullPath}`);
    } else if (existsSync(`${filePath}.md`)) {
      fullPath = `${filePath}.md`;
      console.log(`getDocBySlug: Found MD file at ${fullPath}`);
    } else if (
      existsSync(filePath) &&
      existsSync(join(filePath, 'index.mdx'))
    ) {
      fullPath = join(filePath, 'index.mdx');
      console.log(`getDocBySlug: Found index.mdx at ${fullPath}`);
    } else if (existsSync(filePath) && existsSync(join(filePath, 'index.md'))) {
      fullPath = join(filePath, 'index.md');
      console.log(`getDocBySlug: Found index.md at ${fullPath}`);
    } else {
      console.error(`getDocBySlug: Document not found at any of these paths:
        - ${filePath}.mdx
        - ${filePath}.md
        - ${join(filePath, 'index.mdx')}
        - ${join(filePath, 'index.md')}`);
      throw new Error(`ドキュメントが見つかりません: ${filePath}`);
    }
  }

  // ファイルを読み込む
  const fileContents = await readFile(fullPath, 'utf8');

  // フロントマターを解析
  const { content, data } = matter(fileContents);

  // フロントマターをバリデーション
  let frontmatter: DocFrontmatter;
  try {
    frontmatter = DocFrontmatterSchema.parse(data);
  } catch (error) {
    console.warn(`Invalid frontmatter in ${fullPath}:`, error);
    frontmatter = {
      title: slug[slug.length - 1] || '',
    };
  }

  // MDXをシリアライズ
  // @ts-expect-error - 型の互換性の問題を無視
  const code = await serialize(content, {
    ...serializeOptions,
    scope: frontmatter as Record<string, unknown>,
  });

  return {
    frontmatter,
    code,
  };
});

/**
 * ドキュメントのパスを取得する
 * @param docType ドキュメントタイプ
 * @param slug スラッグ
 * @returns ドキュメントパス
 */
export async function getDocPath(
  docType: string,
  slug?: string
): Promise<string> {
  if (!slug) return `/${docType}`;
  return `/${docType}/${slug}`;
}

/**
 * ドキュメントのURLを取得する
 * @param docType ドキュメントタイプ
 * @param slug スラッグ
 * @returns ドキュメントURL
 */
export async function getDocUrl(
  docType: string,
  slug?: string
): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  return `${baseUrl}${await getDocPath(docType, slug)}`;
}

/**
 * ドキュメントのタイトルを取得する
 * @param slug スラッグ配列
 * @returns ドキュメントタイトル
 */
export async function getDocTitle(slug: string[]): Promise<string> {
  try {
    const { frontmatter } = await getDocBySlug(slug);
    return frontmatter.title || slug[slug.length - 1] || '';
  } catch (error) {
    return slug[slug.length - 1] || '';
  }
}

/**
 * ドキュメントのメタデータを取得する
 * @param slug スラッグ配列
 * @returns ドキュメントメタデータ
 */
export async function getDocMetadata(slug: string[]): Promise<DocFrontmatter> {
  try {
    const { frontmatter } = await getDocBySlug(slug);
    return frontmatter;
  } catch (error) {
    return {
      title: slug[slug.length - 1] || '',
    };
  }
}

/**
 * ドキュメントの存在を確認する
 * @param slug スラッグ配列
 * @returns ドキュメントが存在するか
 */
export async function doesDocExist(slug: string[]): Promise<boolean> {
  if (!slug || slug.length === 0) {
    return false;
  }

  // スラッグからファイルパスを構築
  const filePath = getContentPath(...slug);

  // ファイルが存在するか確認
  return (
    existsSync(`${filePath}.mdx`) ||
    existsSync(`${filePath}.md`) ||
    (existsSync(filePath) && existsSync(join(filePath, 'index.mdx'))) ||
    (existsSync(filePath) && existsSync(join(filePath, 'index.md')))
  );
}

/**
 * ドキュメントのコンテンツを取得する
 * @param slug スラッグ配列
 * @returns ドキュメントコンテンツ
 */
export async function getDocContent(slug: string[]): Promise<string> {
  if (!slug || slug.length === 0) {
    throw new Error('スラッグが指定されていません');
  }

  // スラッグからファイルパスを構築
  const filePath = getContentPath(...slug);

  // ファイルが存在するか確認
  let fullPath = '';
  if (existsSync(`${filePath}.mdx`)) {
    fullPath = `${filePath}.mdx`;
  } else if (existsSync(`${filePath}.md`)) {
    fullPath = `${filePath}.md`;
  } else if (existsSync(filePath) && existsSync(join(filePath, 'index.mdx'))) {
    fullPath = join(filePath, 'index.mdx');
  } else if (existsSync(filePath) && existsSync(join(filePath, 'index.md'))) {
    fullPath = join(filePath, 'index.md');
  } else {
    throw new Error(`ドキュメントが見つかりません: ${filePath}`);
  }

  // ファイルを読み込む
  const fileContents = await readFile(fullPath, 'utf8');

  // フロントマターを解析
  const { content } = matter(fileContents);

  return content;
}
