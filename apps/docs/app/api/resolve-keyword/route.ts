import { type NextRequest, NextResponse } from 'next/server';
import { resolveKeyword } from '../../../actions/keywords';
import type { ResolvedKeyword } from '~/types/mdx';

/**
 * キーワード解決API
 * クライアントサイドからのキーワード解決リクエストを処理します
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // URLからパラメータを取得
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const docType = searchParams.get('docType') || undefined;
    const context = searchParams.get('context') || undefined;

    // キーワードが指定されていない場合はエラー
    if (!keyword) {
      console.warn('キーワードが指定されていません');
      return NextResponse.json(
        {
          error: 'キーワードが指定されていません',
          isAmbiguous: false,
          keyword: '',
        } as ResolvedKeyword,
        { status: 400 }
      );
    }

    // キーワードを解決
    const result = await resolveKeyword(keyword, docType);
    const elapsedTime = Date.now() - startTime;

    // 結果を返す
    return NextResponse.json(result, {
      headers: {
        'X-Response-Time': elapsedTime.toString(),
        'Cache-Control': 'private, max-age=60',
      },
    });
  } catch (error) {
    // エラーが発生した場合
    const elapsedTime = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : '不明なエラーが発生しました';
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('キーワード解決APIでエラーが発生しました:', {
      error: errorMessage,
      stack: errorStack,
    });

    return NextResponse.json(
      {
        error: errorMessage,
        isAmbiguous: false,
        keyword: request.nextUrl.searchParams.get('keyword') || '',
        debug: {
          timestamp: new Date().toISOString(),
          errorType: error instanceof Error ? error.name : 'Unknown',
        },
      } as ResolvedKeyword & { debug?: Record<string, unknown> },
      {
        status: 500,
        headers: {
          'X-Response-Time': elapsedTime.toString(),
          'X-Error-Type': error instanceof Error ? error.name : 'Unknown',
        },
      }
    );
  }
}
