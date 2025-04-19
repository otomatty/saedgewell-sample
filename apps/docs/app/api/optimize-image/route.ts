import { type NextRequest, NextResponse } from 'next/server';
import { optimizeImageUrl, DEFAULT_THUMBNAIL_PATH } from '~/lib/utils/image';

/**
 * 画像URL最適化API
 * 指定されたURLを最適化する
 * @param request リクエスト
 * @returns 最適化された画像URL
 */
export async function GET(request: NextRequest) {
  try {
    // URLパラメータから画像URLを取得
    const url = request.nextUrl.searchParams.get('url');

    // URLが指定されていない場合はエラー
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required', url: DEFAULT_THUMBNAIL_PATH },
        { status: 400 }
      );
    }

    // URLをデコード
    const decodedUrl = decodeURIComponent(url);

    // 画像URLを最適化
    const optimizedUrl = await optimizeImageUrl(decodedUrl);

    // 最適化された画像URLを返す
    return NextResponse.json({ url: optimizedUrl });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to optimize image URL', url: DEFAULT_THUMBNAIL_PATH },
      { status: 500 }
    );
  }
}
