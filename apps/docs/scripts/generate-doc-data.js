/**
 * ビルド時にドキュメントデータを生成するスクリプト
 * このスクリプトは、ビルド前に実行し、Edge Runtimeで利用するための
 * 静的JSONデータを生成します
 */

import { mkdir, writeFile, readdir, readFile, stat } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import { existsSync } from 'node:fs';

/**
 * ドキュメントの基本構造を表すインターフェース
 * @typedef {Object} DocNode
 * @property {string} title - ドキュメントのタイトル
 * @property {string} slug - ドキュメントのスラグ（URL用パス）
 * @property {string} [description] - ドキュメントの説明（オプション）
 * @property {number} [order] - 表示順序（オプション）
 * @property {DocNode[]} children - 子ドキュメント
 */

/**
 * ドキュメントルートパスを取得
 * @returns {string} ドキュメントのルートパス
 */
function getDocRootPath() {
  return join(process.cwd(), '.docs');
}

/**
 * ファイル名からタイトルを生成
 * @param {string} filename - ファイル名
 * @returns {string} 生成されたタイトル
 */
function generateTitleFromFilename(filename) {
  return basename(filename, '.mdx')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * MDXファイルからフロントマターを抽出
 * @param {string} content - MDXファイルの内容
 * @returns {Object} 抽出されたフロントマター
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatterStr = match[1];
  const frontmatter = {};

  // 簡易的なYAMLパース
  for (const line of frontmatterStr.split('\n')) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      if (key.trim() === 'order' && !Number.isNaN(Number(value))) {
        frontmatter[key.trim()] = Number(value);
      } else {
        frontmatter[key.trim()] = value.replace(/^['"](.*)['"]$/, '$1');
      }
    }
  }

  return frontmatter;
}

/**
 * ディレクトリからドキュメントツリーを構築
 * @param {string} dir - 対象ディレクトリ
 * @param {string} parentSlug - 親スラグ
 * @returns {Promise<DocNode[]>} ドキュメントノード配列
 */
async function buildTree(dir, parentSlug = '') {
  if (!existsSync(dir)) {
    console.warn(`警告: ディレクトリが見つかりません: ${dir}`);
    return [];
  }

  try {
    const items = await readdir(dir, { withFileTypes: true });
    const nodes = [];

    for (const item of items) {
      // 隠しファイルと_で始まるファイル/ディレクトリを除外
      if (item.name.startsWith('.') || item.name.startsWith('_')) continue;

      const path = join(dir, item.name);
      const slug = parentSlug ? `${parentSlug}/${item.name}` : item.name;

      try {
        if (item.isDirectory()) {
          // indexファイルの検索
          const indexJsonPath = join(path, 'index.json');
          const indexMdxPath = join(path, 'index.mdx');
          let frontmatter = null;

          // index.jsonまたはindex.mdxからフロントマターを取得
          if (existsSync(indexJsonPath)) {
            const indexContent = await readFile(indexJsonPath, 'utf-8');
            frontmatter = JSON.parse(indexContent);
          } else if (existsSync(indexMdxPath)) {
            const indexContent = await readFile(indexMdxPath, 'utf-8');
            frontmatter = extractFrontmatter(indexContent);
          }

          // ディレクトリの子要素を取得
          const children = await buildTree(path, slug);

          // 子要素があるか、フロントマターがある場合のみディレクトリを表示
          if (children.length > 0 || frontmatter) {
            nodes.push({
              title: frontmatter?.title ?? item.name,
              description: frontmatter?.description,
              order:
                typeof frontmatter?.order === 'number' ? frontmatter.order : 0,
              slug: slug.replace(/\\/g, '/'),
              children,
            });
          }
        } else if (item.name.endsWith('.mdx') && item.name !== 'index.mdx') {
          const content = await readFile(path, 'utf-8');
          const frontmatter = extractFrontmatter(content);
          const title =
            frontmatter.title ?? generateTitleFromFilename(item.name);

          nodes.push({
            ...frontmatter,
            title,
            slug: slug.replace(/\\/g, '/').replace(/\.mdx$/, ''),
            children: [],
          });
        }
      } catch (error) {
        console.warn(`警告: ${path}の処理中にエラーが発生しました:`, error);
      }
    }

    // orderでソート
    return nodes.sort((a, b) => {
      const aOrder = typeof a.order === 'number' ? a.order : 0;
      const bOrder = typeof b.order === 'number' ? b.order : 0;
      return aOrder - bOrder;
    });
  } catch (error) {
    console.error(
      `エラー: ディレクトリ${dir}の処理中に問題が発生しました:`,
      error
    );
    return [];
  }
}

/**
 * ドキュメントデータを生成
 */
async function generateDocData() {
  try {
    console.log('📄 ドキュメントデータの生成を開始...');

    // データディレクトリを作成
    const dataDir = join(process.cwd(), 'data');
    await mkdir(dataDir, { recursive: true });

    const baseDir = getDocRootPath();

    // ドキュメントタイプごとのツリーデータを生成
    console.log('📚 ドキュメントツリーを取得中...');
    const documentsTree = await buildTree(join(baseDir, 'documents'));
    const wikiTree = await buildTree(join(baseDir, 'wiki'));
    const journalsTree = await buildTree(join(baseDir, 'journals'));

    // JSONファイルとして出力
    console.log('💾 ドキュメントデータをJSONファイルに保存中...');
    await writeFile(
      join(dataDir, 'documents-tree.json'),
      JSON.stringify(documentsTree, null, 2)
    );
    await writeFile(
      join(dataDir, 'wiki-tree.json'),
      JSON.stringify(wikiTree, null, 2)
    );
    await writeFile(
      join(dataDir, 'journals-tree.json'),
      JSON.stringify(journalsTree, null, 2)
    );

    console.log('✅ ドキュメントデータが正常に生成されました！');
  } catch (error) {
    console.error(
      '❌ ドキュメントデータの生成中にエラーが発生しました:',
      error
    );
    process.exit(1);
  }
}

// スクリプトの実行
generateDocData();
