import { NextResponse } from 'next/server';
import { getDocTreeEdge } from '~/lib/mdx/docs-edge';

// Edge Runtimeを使用してサイズ制限を回避
export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const url = new URL(request.url);
    const subDir = url.searchParams.get('subDir');

    // Edge Runtime対応の関数を使用してドキュメントツリーを取得
    const docTree = await getDocTreeEdge(type, subDir);

    // ドキュメントが存在しない場合は404を返す
    if (!docTree || docTree.length === 0) {
      console.warn(`Documents not found for type: ${type}`);
      return NextResponse.json([], { status: 404 });
    }

    // サブディレクトリが指定されている場合は、そのサブディレクトリのコンテンツのみを取得
    if (subDir && type === 'documents') {
      // 指定されたサブディレクトリに対応するDocNodeを探す
      const subDirNode = docTree.find((item) => {
        const slugParts = item.slug?.split('/') || [];
        return slugParts[0] === subDir;
      });

      // サブディレクトリが見つかり、子要素がある場合はその子要素を返す
      if (subDirNode?.children?.length) {
        return NextResponse.json(subDirNode.children);
      }

      // サブディレクトリが見つからない場合は空の配列を返す
      return NextResponse.json([]);
    }

    // 通常のケース：すべてのドキュメントを返す
    return NextResponse.json(docTree);
  } catch (error) {
    console.error('Error in /api/docs/[type]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document tree' },
      { status: 500 }
    );
  }
}
