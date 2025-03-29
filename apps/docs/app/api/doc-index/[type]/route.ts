import { NextResponse } from 'next/server';

// Edge Runtimeを使用してサイズ制限を回避
export const runtime = 'edge';

/**
 * ドキュメントアイテムの型定義
 */
interface DocItem {
  slug: string;
  title: string;
  description?: string;
  children?: DocItem[];
  [key: string]: unknown; // その他のプロパティ
}

/**
 * 事前に生成されたJSONデータからドキュメントメタデータを取得
 * @param {string} category - ドキュメントカテゴリ (documents, wiki, journals)
 * @param {string} docType - ドキュメントタイプ
 * @returns {Promise<Object|null>} ドキュメントデータまたはnull
 */
async function getDocumentData(category: string, docType: string) {
  try {
    // 許可されたカテゴリの確認
    if (!['documents', 'wiki', 'journals'].includes(category)) {
      return null;
    }

    // カテゴリに応じたJSONファイルのURLを決定
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
        return null;
    }

    // 生成されたJSONデータを取得
    const response = await fetch(
      new URL(dataUrl, process.env.NEXT_PUBLIC_APP_URL)
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const treeData = (await response.json()) as DocItem[];

    // ツリーデータから対象のドキュメントタイプを検索
    const findDocType = (
      items: DocItem[],
      targetSlug: string
    ): DocItem | null => {
      for (const item of items) {
        if (item.slug === targetSlug || item.slug.endsWith(`/${targetSlug}`)) {
          return item;
        }

        if (item.children && item.children.length > 0) {
          const found = findDocType(item.children, targetSlug);
          if (found) return found;
        }
      }
      return null;
    };

    const docTypeData = findDocType(treeData, docType);

    if (docTypeData) {
      // メタデータを整形して返す
      return {
        ...docTypeData,
        category,
        docType,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching document data:', error);
    return null;
  }
}

/**
 * ドキュメントタイプのメタデータを取得するAPIエンドポイント
 * @returns {Object} ドキュメントタイプのメタデータ（タイトル、説明、アイコンなど）
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;

    // typeパラメータには「category/docType」の形式でパスが渡される
    // 例: documents/makerkit
    const decodedType = decodeURIComponent(type);

    // パスの検証
    if (!decodedType.includes('/')) {
      return NextResponse.json(
        { error: 'Invalid path format. Expected "category/docType"' },
        { status: 400 }
      );
    }

    // パスの分解
    const parts = decodedType.split('/');
    if (parts.length !== 2) {
      return NextResponse.json(
        { error: 'Invalid path format. Expected "category/docType"' },
        { status: 400 }
      );
    }

    const [category, docType] = parts;
    if (!category || !docType) {
      return NextResponse.json(
        { error: 'Missing category or docType' },
        { status: 400 }
      );
    }

    // 事前生成されたJSONからデータを取得
    const docData = await getDocumentData(category, docType);

    if (!docData) {
      return NextResponse.json(
        { error: 'Document type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(docData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in /api/doc-index/[type]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document index' },
      { status: 500 }
    );
  }
}
