import { type NextRequest, NextResponse } from 'next/server';

// Edge Runtimeを使用してサイズ制限を回避
export const runtime = 'edge';

/**
 * ドキュメントタイプの型定義
 */
interface DocType {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  status?: string;
  disabled?: boolean;
  badge?: string;
  badgeColor?: string;
  hidden?: boolean;
  version?: string;
  lastUpdated?: string;
  maintainers?: string[];
  category?: string;
  type: 'docType';
}

/**
 * ドキュメントカテゴリの型定義
 */
interface DocCategory {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  order?: number;
  type: 'category';
  disabled?: boolean;
  hidden?: boolean;
}

/**
 * 生成済みのJSONデータからカテゴリ一覧を取得する
 * @returns {Promise<DocCategory[]>} カテゴリ一覧
 */
async function getDocCategories(): Promise<DocCategory[]> {
  try {
    // 各カテゴリのツリーからカテゴリ情報を抽出
    const categories: DocCategory[] = [];

    // documents、wiki、journalsのカテゴリを追加
    categories.push({
      id: 'documents',
      title: 'ドキュメント',
      icon: 'file-text',
      type: 'category',
      order: 1,
    });

    categories.push({
      id: 'wiki',
      title: 'Wiki',
      icon: 'book',
      type: 'category',
      order: 2,
    });

    categories.push({
      id: 'journals',
      title: 'ジャーナル',
      icon: 'scroll',
      type: 'category',
      order: 3,
    });

    return categories;
  } catch (error) {
    console.error('Error fetching document categories:', error);
    return [];
  }
}

/**
 * 生成済みのJSONデータからドキュメントタイプ一覧を取得する
 * @param {string} categoryId - 特定のカテゴリに属するドキュメントタイプのみを取得する場合に指定
 * @returns {Promise<DocType[]>} ドキュメントタイプ一覧
 */
async function getDocTypes(categoryId?: string): Promise<DocType[]> {
  try {
    const types: DocType[] = [];

    // カテゴリに応じたJSONファイルのURLを決定
    const categoryFiles = categoryId
      ? [categoryId]
      : ['documents', 'wiki', 'journals'];

    for (const category of categoryFiles) {
      // カテゴリが許可されたものか確認
      if (!['documents', 'wiki', 'journals'].includes(category)) {
        continue;
      }

      // JSONファイルのURLを決定
      let dataUrl: string;
      switch (category) {
        case 'documents':
          dataUrl = '/data/documents-tree.json';
          break;
        case 'wiki':
          dataUrl = '/data/wiki-tree.json';
          break;
        case 'journals':
          dataUrl = '/data/journals-tree.json';
          break;
        default:
          continue;
      }

      try {
        // 生成されたJSONデータを取得
        const response = await fetch(
          new URL(dataUrl, process.env.NEXT_PUBLIC_APP_URL)
        );
        if (!response.ok) {
          console.warn(
            `Failed to fetch ${category} data: ${response.statusText}`
          );
          continue;
        }

        const treeData = await response.json();

        // ルートレベルのアイテムをドキュメントタイプとして追加
        for (const item of treeData) {
          types.push({
            id: item.slug,
            title: item.title,
            description: item.description,
            category,
            type: 'docType',
          });
        }
      } catch (error) {
        console.warn(`Error processing ${category} data:`, error);
      }
    }

    return types;
  } catch (error) {
    console.error('Error fetching document types:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const includeCategories = searchParams.get('includeCategories') === 'true';
    const id = searchParams.get('id');

    // ドキュメントタイプを取得
    const docTypes = await getDocTypes(categoryId || undefined);

    // IDが指定されている場合は、そのIDに一致するドキュメントタイプのみを返す
    if (id) {
      const docType = docTypes.find((doc) => doc.id === id);
      if (docType) {
        return NextResponse.json(docType);
      }
      // ドキュメントタイプが見つからない場合は、IDをタイトルとして使用したデフォルト値を返す
      return NextResponse.json({
        id,
        title: id.charAt(0).toUpperCase() + id.slice(1),
        category: 'documents',
        type: 'docType',
      });
    }

    // カテゴリを含める場合
    if (includeCategories) {
      const categories = await getDocCategories();
      return NextResponse.json({
        docTypes,
        categories,
      });
    }

    return NextResponse.json(docTypes);
  } catch (error) {
    console.error('Error in /api/doc-types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document types' },
      { status: 500 }
    );
  }
}
