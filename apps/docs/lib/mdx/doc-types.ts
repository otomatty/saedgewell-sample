import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { DocType, DocCategory } from '~/types/mdx';

const docTypesCache = new Map<string, { data: DocType[]; timestamp: number }>();
const docCategoriesCache = new Map<
  string,
  { data: DocCategory[]; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5分

/**
 * ドキュメントカテゴリの一覧を取得する
 * @param baseDir コンテンツのベースディレクトリ
 * @returns ドキュメントカテゴリの配列
 */
export function getDocCategories(baseDir = 'contents'): DocCategory[] {
  // キャッシュチェック
  const cached = docCategoriesCache.get(baseDir);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const contentPath = join(process.cwd(), baseDir);

  try {
    const items = readdirSync(contentPath, { withFileTypes: true });
    const categories: DocCategory[] = [];

    for (const item of items) {
      if (item.isDirectory() && !item.name.startsWith('.')) {
        const configPath = join(contentPath, item.name, 'index.json');
        try {
          if (existsSync(configPath)) {
            const configContent = readFileSync(configPath, 'utf-8');
            const config = JSON.parse(configContent);

            // typeプロパティが'category'の場合のみカテゴリとして追加
            if (config.type === 'category') {
              categories.push({
                id: item.name,
                title: config.title,
                description: config.description,
                icon: config.icon,
                order: config.order,
                type: 'category',
                disabled: config.disabled,
                hidden: config.hidden,
              });
            }
          }
        } catch (error) {
          console.error(
            `Error reading category config from ${configPath}:`,
            error
          );
        }
      }
    }

    // キャッシュを更新
    docCategoriesCache.set(baseDir, {
      data: categories,
      timestamp: Date.now(),
    });

    return categories;
  } catch (error) {
    console.error(`Error reading doc categories from ${contentPath}:`, error);
    return [];
  }
}

/**
 * ドキュメントタイプの一覧を取得する
 * @param baseDir コンテンツのベースディレクトリ
 * @param categoryId 特定のカテゴリに属するドキュメントタイプのみを取得する場合に指定
 * @returns ドキュメントタイプの配列
 */
export function getDocTypes(
  baseDir = 'contents',
  categoryId?: string
): DocType[] {
  // キャッシュキーにカテゴリIDを含める
  const cacheKey = categoryId ? `${baseDir}:${categoryId}` : baseDir;

  // キャッシュチェック
  const cached = docTypesCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const contentPath = join(process.cwd(), baseDir);
  const types: DocType[] = [];

  try {
    // カテゴリが指定されている場合は、そのカテゴリディレクトリ内のドキュメントタイプを取得
    if (categoryId) {
      const categoryPath = join(contentPath, categoryId);
      if (existsSync(categoryPath)) {
        const items = readdirSync(categoryPath, { withFileTypes: true });

        for (const item of items) {
          if (item.isDirectory() && !item.name.startsWith('.')) {
            const docType = readDocTypeConfig(
              join(categoryPath, item.name),
              item.name,
              categoryId
            );
            if (docType) {
              types.push(docType);
            }
          }
        }
      }
    } else {
      // カテゴリが指定されていない場合は、すべてのドキュメントタイプを取得
      const items = readdirSync(contentPath, { withFileTypes: true });

      for (const item of items) {
        if (item.isDirectory() && !item.name.startsWith('.')) {
          const itemPath = join(contentPath, item.name);
          const configPath = join(itemPath, 'index.json');

          // index.jsonが存在するか確認
          if (existsSync(configPath)) {
            try {
              const configContent = readFileSync(configPath, 'utf-8');
              const config = JSON.parse(configContent);

              // カテゴリの場合は、そのカテゴリ内のドキュメントタイプを取得
              if (config.type === 'category') {
                const categoryItems = readdirSync(itemPath, {
                  withFileTypes: true,
                });

                for (const categoryItem of categoryItems) {
                  if (
                    categoryItem.isDirectory() &&
                    !categoryItem.name.startsWith('.') &&
                    categoryItem.name !== 'index.json'
                  ) {
                    const docType = readDocTypeConfig(
                      join(itemPath, categoryItem.name),
                      categoryItem.name,
                      item.name
                    );
                    if (docType) {
                      types.push(docType);
                    }
                  }
                }
              } else {
                // カテゴリでない場合は、直接ドキュメントタイプとして追加
                const docType = readDocTypeConfig(itemPath, item.name);
                if (docType) {
                  types.push(docType);
                }
              }
            } catch (error) {
              // index.jsonが不正な場合は、ディレクトリ名をそのまま使用
              types.push({
                id: item.name,
                title: item.name.charAt(0).toUpperCase() + item.name.slice(1),
                type: 'docType',
              });
            }
          } else {
            // index.jsonが存在しない場合は、ディレクトリ名をそのまま使用
            types.push({
              id: item.name,
              title: item.name.charAt(0).toUpperCase() + item.name.slice(1),
              type: 'docType',
            });
          }
        }
      }
    }

    // キャッシュを更新
    docTypesCache.set(cacheKey, { data: types, timestamp: Date.now() });

    return types;
  } catch (error) {
    console.error(`Error reading doc types from ${contentPath}:`, error);
    return [];
  }
}

/**
 * ドキュメントタイプの設定を読み込む
 * @param dirPath ドキュメントタイプのディレクトリパス
 * @param id ドキュメントタイプのID
 * @param categoryId カテゴリID（オプション）
 * @returns ドキュメントタイプ設定
 */
function readDocTypeConfig(
  dirPath: string,
  id: string,
  categoryId?: string
): DocType | null {
  const configPath = join(dirPath, 'index.json');

  try {
    if (existsSync(configPath)) {
      const configContent = readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent);

      return {
        id,
        title: config.title || id.charAt(0).toUpperCase() + id.slice(1),
        description: config.description,
        icon: config.icon,
        status: config.status,
        disabled: config.disabled,
        badge: config.badge,
        badgeColor: config.badgeColor,
        hidden: config.hidden,
        version: config.version,
        lastUpdated: config.lastUpdated,
        maintainers: config.maintainers,
        category: categoryId || config.category,
        type: 'docType',
      };
    }

    // index.jsonが存在しない場合は、ディレクトリ名をそのまま使用
    return {
      id,
      title: id.charAt(0).toUpperCase() + id.slice(1),
      category: categoryId,
      type: 'docType',
    };
  } catch (error) {
    console.error(`Error reading doc type config from ${configPath}:`, error);
    return null;
  }
}
