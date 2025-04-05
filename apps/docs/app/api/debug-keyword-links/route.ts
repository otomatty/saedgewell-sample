import { type NextRequest, NextResponse } from 'next/server';
import { resolveKeyword } from '~/actions/keywords';
import { getDocTree } from '~/lib/mdx/docs';
import { getKeywordIndex } from '~/lib/mdx/keyword-index';
import { devConfig } from '~/actions/mdx/cache';
import type { DocNode } from '~/types/mdx';

/**
 * キーワードリンク機能のデバッグ用APIエンドポイント
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'status';

    // 基本的なステータス情報を取得
    if (action === 'status') {
      const docTree = getDocTree();
      const { index, duplicates } = getKeywordIndex(docTree, devConfig);

      return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        keywordCount: Object.keys(index).length,
        duplicates: duplicates.length,
        docTree: {
          nodeCount: countNodes(docTree),
          topLevelNodes: docTree.length,
        },
      });
    }

    // キーワードインデックスを取得
    if (action === 'index') {
      const docTree = getDocTree();
      const { index } = getKeywordIndex(docTree, devConfig);

      return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        index,
      });
    }

    // キーワード解決をテスト
    if (action === 'resolve') {
      const keyword = searchParams.get('keyword');
      const docType = searchParams.get('docType') || undefined;

      if (!keyword) {
        return NextResponse.json(
          { error: 'キーワードが指定されていません' },
          { status: 400 }
        );
      }

      const result = await resolveKeyword(keyword, docType);

      return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        keyword,
        docType,
        result,
      });
    }

    return NextResponse.json(
      { error: '不明なアクションです' },
      { status: 400 }
    );
  } catch (error) {
    console.error('キーワードリンクデバッグAPIエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * ドキュメントツリーのノード数をカウント
 */
function countNodes(nodes: DocNode[]): number {
  let count = nodes.length;

  for (const node of nodes) {
    if (node.children && Array.isArray(node.children)) {
      count += countNodes(node.children);
    }
  }

  return count;
}
