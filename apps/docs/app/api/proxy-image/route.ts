import { type NextRequest, NextResponse } from 'next/server';
import { DEFAULT_THUMBNAIL_PATH } from '~/lib/utils/image';

/**
 * 画像プロキシAPI
 * 指定されたURLから画像を取得し、プロキシとして返す
 * @param request リクエスト
 * @returns 画像データ
 */
export async function GET(request: NextRequest) {
  try {
    // URLパラメータから画像URLを取得
    const url = request.nextUrl.searchParams.get('url');

    // URLが指定されていない場合はエラー
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // URLをデコード
    const decodedUrl = decodeURIComponent(url);

    try {
      // タイムアウトを8秒に設定
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // 画像を取得
      const response = await fetch(decodedUrl, {
        headers: {
          // 一般的なブラウザのUser-Agentを設定
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // レスポンスが成功しなかった場合はエラー
      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch image: ${response.status}` },
          { status: response.status }
        );
      }

      // Content-Typeを取得
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      // 画像データを取得
      const imageData = await response.arrayBuffer();

      // Content-Typeが画像でないかチェック
      if (!contentType.startsWith('image/')) {
        return NextResponse.json(
          {
            error: `The requested resource isn't a valid image, received ${contentType}`,
          },
          { status: 415 }
        );
      }

      // 画像データを返す
      return new NextResponse(imageData, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=604800', // 7日間キャッシュ
        },
      });
    } catch (fetchError) {
      // アボートエラーの場合はタイムアウトとして処理
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout while fetching image' },
          { status: 408 }
        );
      }

      // その他のネットワークエラー
      return NextResponse.json(
        { error: 'Network error while fetching image' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}
