/**
 * ドキュメントナビゲーション関連の機能を提供するモジュール
 * 前後のドキュメントへのナビゲーションを管理します
 */

import { readdirSync, statSync, existsSync } from 'node:fs';
import { promises as fsPromises } from 'node:fs';
import { join } from 'node:path';
import { glob } from 'glob';
import matter from 'gray-matter';

/**
 * ナビゲーション用のドキュメント情報の型定義
 */
export interface DocNavigationItem {
  title: string;
  slug: string[];
}

/**
 * ナビゲーション情報の型定義
 */
export interface DocNavigation {
  prev: DocNavigationItem | null;
  next: DocNavigationItem | null;
}

/**
 * サブディレクトリ情報の型定義
 */
interface SubdirectoryInfo {
  dir: string;
  order: number;
  title: string;
}

/**
 * ドキュメント情報の内部型定義
 */
interface DocInfo {
  title: string;
  order: number;
  slug: string[];
  path: string;
}

/**
 * 前後のドキュメントを取得する
 * @param slug 現在のドキュメントのスラグ
 * @returns 前後のドキュメントの情報
 */
export async function getAdjacentDocs(slug: string[]): Promise<DocNavigation> {
  if (!Array.isArray(slug) || slug.length < 2) {
    return { prev: null, next: null };
  }

  const [category, docType, ...pathSegments] = slug;

  // categoryとdocTypeが存在することを確認
  if (!category || !docType) {
    return { prev: null, next: null };
  }

  // ベースディレクトリパスを構築
  const basePath = join(process.cwd(), 'contents', category, docType);

  // 現在のファイルが存在するディレクトリと、現在のファイル名を特定
  let currentDir = basePath;
  let currentFileName = 'index.mdx';
  let directorySegments: string[] = [];
  let isTopLevelIndex = false;
  let currentSubdir = ''; // 現在のサブディレクトリ名

  if (pathSegments.length > 0) {
    // パスセグメントの最後がファイル名、それ以外がディレクトリパス
    directorySegments = [...pathSegments];
    const lastSegment = directorySegments.pop();

    // ディレクトリパスがある場合は、そのディレクトリに移動
    if (directorySegments.length > 0) {
      currentDir = join(basePath, ...directorySegments);
      currentSubdir = directorySegments[0] || ''; // 最初のセグメントがサブディレクトリ名
    }

    // 最後のセグメントがindexの場合はindex.mdx、それ以外は{lastSegment}.mdx
    currentFileName =
      lastSegment === 'index' ? 'index.mdx' : `${lastSegment || ''}.mdx`;
  } else {
    // パスセグメントがない場合はトップレベルのindex.mdx
    isTopLevelIndex = true;
  }

  // ディレクトリが存在しない場合は終了
  if (!existsSync(currentDir)) {
    return { prev: null, next: null };
  }

  // 現在のディレクトリ内のMDXファイルのみを取得（サブディレクトリは含まない）
  const mdxFiles = await glob('*.mdx', {
    cwd: currentDir,
    ignore: ['**/node_modules/**', '**/.git/**'],
  });

  // 各ファイルのフロントマターを取得
  const docsWithOrder = await Promise.all(
    mdxFiles.map(async (file) => {
      const filePath = join(currentDir, file);
      const content = await fsPromises.readFile(filePath, 'utf-8');
      const { data } = matter(content);

      // ファイル名からスラグを構築
      const fileName = file.replace(/\.mdx$/, '');
      // index.mdxの場合は現在のディレクトリパスのみ、それ以外はファイル名を追加
      const fileSlug =
        fileName === 'index'
          ? [...directorySegments]
          : [...directorySegments, fileName];

      return {
        title: data.title || fileName,
        order: typeof data.order === 'number' ? data.order : 999, // orderがない場合は大きな値を設定
        slug: [...slug.slice(0, 2), ...fileSlug],
        path: file,
      };
    })
  );

  // orderでソート
  docsWithOrder.sort((a, b) => a.order - b.order);

  // 現在のドキュメントのインデックスを見つける
  const currentIndex = docsWithOrder.findIndex(
    (doc) => doc.path === currentFileName
  );

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  // 前後のドキュメントを取得
  let prev = currentIndex > 0 ? docsWithOrder[currentIndex - 1] : null;
  let next =
    currentIndex < docsWithOrder.length - 1
      ? docsWithOrder[currentIndex + 1]
      : null;

  // サブディレクトリ間のナビゲーションを処理
  if (directorySegments.length > 0) {
    // 親ディレクトリのパス
    const parentDir = basePath;

    // 親ディレクトリ内のすべてのサブディレクトリを取得
    try {
      // 1. 前のページがない場合、前のサブディレクトリの最後のページを取得
      if (!prev && currentIndex === 0 && currentSubdir) {
        // サブディレクトリを取得してorderでソート
        const subdirs = await getSubdirectoriesWithOrder(parentDir);

        // 現在のサブディレクトリのインデックスを見つける
        const currentSubdirIndex = subdirs.findIndex(
          (s) => s?.dir === currentSubdir
        );

        if (currentSubdirIndex > 0) {
          // 前のサブディレクトリを取得
          const prevSubdir = subdirs[currentSubdirIndex - 1];

          if (prevSubdir?.dir) {
            // 親ディレクトリのindex.mdxがあるか確認
            const parentIndexPath = join(parentDir, 'index.mdx');
            if (existsSync(parentIndexPath)) {
              // 親ディレクトリのindex.mdxを前のページとして設定
              const parentContent = await fsPromises.readFile(
                parentIndexPath,
                'utf-8'
              );
              const { data } = matter(parentContent);
              prev = {
                title: data.title || 'Index',
                slug: [category, docType],
                order: typeof data.order === 'number' ? data.order : 0,
                path: 'index.mdx',
              };
            } else {
              // 前のサブディレクトリの最後のページを取得
              const prevSubdirPath = join(parentDir, prevSubdir.dir);
              const prevSubdirFiles = await glob('*.mdx', {
                cwd: prevSubdirPath,
                ignore: ['**/node_modules/**', '**/.git/**'],
              });

              if (prevSubdirFiles.length > 0) {
                const prevSubdirDocs = await Promise.all(
                  prevSubdirFiles.map(async (file) => {
                    const filePath = join(prevSubdirPath, file);
                    const content = await fsPromises.readFile(
                      filePath,
                      'utf-8'
                    );
                    const { data } = matter(content);

                    const fileName = file.replace(/\.mdx$/, '');
                    const fileSlug =
                      fileName === 'index'
                        ? [prevSubdir.dir]
                        : [prevSubdir.dir, fileName];

                    return {
                      title: data.title || fileName,
                      order: typeof data.order === 'number' ? data.order : 999,
                      slug: [...slug.slice(0, 2), ...fileSlug],
                      path: file,
                    };
                  })
                );

                // orderでソートして最後のページを取得
                prevSubdirDocs.sort((a, b) => a.order - b.order);
                prev = prevSubdirDocs[prevSubdirDocs.length - 1];
              }
            }
          }
        }
      }

      // 2. 次のページがない場合、次のサブディレクトリの最初のページを取得
      if (!next && currentIndex === docsWithOrder.length - 1 && currentSubdir) {
        // サブディレクトリを取得してorderでソート
        const subdirs = await getSubdirectoriesWithOrder(parentDir);

        // 現在のサブディレクトリのインデックスを見つける
        const currentSubdirIndex = subdirs.findIndex(
          (s) => s?.dir === currentSubdir
        );

        if (
          currentSubdirIndex >= 0 &&
          currentSubdirIndex < subdirs.length - 1
        ) {
          // 次のサブディレクトリを取得
          const nextSubdir = subdirs[currentSubdirIndex + 1];

          if (nextSubdir?.dir) {
            // 次のサブディレクトリの最初のページを取得
            const nextSubdirPath = join(parentDir, nextSubdir.dir);
            const nextSubdirFiles = await glob('*.mdx', {
              cwd: nextSubdirPath,
              ignore: ['**/node_modules/**', '**/.git/**'],
            });

            if (nextSubdirFiles.length > 0) {
              const nextSubdirDocs = await Promise.all(
                nextSubdirFiles.map(async (file) => {
                  const filePath = join(nextSubdirPath, file);
                  const content = await fsPromises.readFile(filePath, 'utf-8');
                  const { data } = matter(content);

                  const fileName = file.replace(/\.mdx$/, '');
                  const fileSlug =
                    fileName === 'index'
                      ? [nextSubdir.dir]
                      : [nextSubdir.dir, fileName];

                  return {
                    title: data.title || fileName,
                    order: typeof data.order === 'number' ? data.order : 999,
                    slug: [...slug.slice(0, 2), ...fileSlug],
                    path: file,
                  };
                })
              );

              // orderでソートして最初のページを取得
              nextSubdirDocs.sort((a, b) => a.order - b.order);
              next = nextSubdirDocs[0];
            }
          }
        }
      }
    } catch (error) {
      console.error('Error handling subdirectory navigation:', error);
    }
  }

  // トップレベルのindex.mdxで次のページがない場合、サブディレクトリを探索
  if (isTopLevelIndex && !next) {
    try {
      // サブディレクトリを取得してorderでソート
      const subdirs = await getSubdirectoriesWithOrder(basePath);

      // 最も優先度の高いサブディレクトリを取得
      if (subdirs.length > 0) {
        const topSubdir = subdirs[0];

        if (topSubdir?.dir) {
          const subdirPath = join(basePath, topSubdir.dir);

          // サブディレクトリ内のMDXファイルを取得
          const subdirMdxFiles = await glob('*.mdx', {
            cwd: subdirPath,
            ignore: ['**/node_modules/**', '**/.git/**'],
          });

          // 各ファイルのフロントマターを取得
          const subdirDocsWithOrder = await Promise.all(
            subdirMdxFiles.map(async (file) => {
              const filePath = join(subdirPath, file);
              const content = await fsPromises.readFile(filePath, 'utf-8');
              const { data } = matter(content);

              // ファイル名からスラグを構築
              const fileName = file.replace(/\.mdx$/, '');
              const fileSlug =
                fileName === 'index'
                  ? [topSubdir.dir]
                  : [topSubdir.dir, fileName];

              return {
                title: data.title || fileName,
                order: typeof data.order === 'number' ? data.order : 999,
                slug: [...slug.slice(0, 2), ...fileSlug],
                path: file,
              };
            })
          );

          // orderでソート
          subdirDocsWithOrder.sort((a, b) => a.order - b.order);

          // 最も優先度の高いファイルを「次のページ」として設定
          if (subdirDocsWithOrder.length > 0) {
            const topDoc = subdirDocsWithOrder[0];
            if (topDoc) {
              next = {
                title: topDoc.title,
                slug: topDoc.slug,
                order: topDoc.order,
                path: topDoc.path,
              };
            }
          }
        }
      }
    } catch (error) {
      console.error('Error finding next page in subdirectories:', error);
    }
  }

  return {
    prev: prev ? { title: prev.title, slug: prev.slug } : null,
    next: next ? { title: next.title, slug: next.slug } : null,
  };
}

/**
 * サブディレクトリを取得してorderでソートする
 * @param dirPath ディレクトリパス
 * @returns orderでソートされたサブディレクトリの配列
 */
async function getSubdirectoriesWithOrder(
  dirPath: string
): Promise<Array<SubdirectoryInfo>> {
  // サブディレクトリを取得
  const subdirs = readdirSync(dirPath).filter((item) => {
    const itemPath = join(dirPath, item);
    return statSync(itemPath).isDirectory() && !item.startsWith('_');
  });

  // サブディレクトリのindex.jsonからorderを取得
  const subdirsWithOrder = await Promise.all(
    subdirs.map(async (dir) => {
      const indexJsonPath = join(dirPath, dir, 'index.json');
      let order = 999; // デフォルト値
      let title = dir;

      if (existsSync(indexJsonPath)) {
        try {
          const content = await fsPromises.readFile(indexJsonPath, 'utf-8');
          const data = JSON.parse(content);
          if (typeof data.order === 'number') {
            order = data.order;
          }
          if (data.title) {
            title = data.title;
          }
        } catch (error) {
          console.error(`Error reading ${indexJsonPath}:`, error);
        }
      }

      return { dir, order, title };
    })
  );

  // orderでソート
  return subdirsWithOrder.sort((a, b) => a.order - b.order);
}

/**
 * 指定されたディレクトリ内のMDXファイルを取得し、フロントマターの情報を含むドキュメント情報を返す
 * @param dirPath ディレクトリパス
 * @param baseSlug ベースとなるスラグ
 * @param directorySegments ディレクトリセグメント
 * @returns ドキュメント情報の配列
 */
export async function getDocsWithOrder(
  dirPath: string,
  baseSlug: string[],
  directorySegments: string[] = []
): Promise<DocInfo[]> {
  // ディレクトリが存在しない場合は空配列を返す
  if (!existsSync(dirPath)) {
    return [];
  }

  // MDXファイルを取得
  const mdxFiles = await glob('*.mdx', {
    cwd: dirPath,
    ignore: ['**/node_modules/**', '**/.git/**'],
  });

  // 各ファイルのフロントマターを取得
  const docsWithOrder = await Promise.all(
    mdxFiles.map(async (file) => {
      const filePath = join(dirPath, file);
      const content = await fsPromises.readFile(filePath, 'utf-8');
      const { data } = matter(content);

      // ファイル名からスラグを構築
      const fileName = file.replace(/\.mdx$/, '');
      // index.mdxの場合は現在のディレクトリパスのみ、それ以外はファイル名を追加
      const fileSlug =
        fileName === 'index'
          ? [...directorySegments]
          : [...directorySegments, fileName];

      return {
        title: data.title || fileName,
        order: typeof data.order === 'number' ? data.order : 999,
        slug: [...baseSlug, ...fileSlug],
        path: file,
      };
    })
  );

  // orderでソート
  return docsWithOrder.sort((a, b) => a.order - b.order);
}
