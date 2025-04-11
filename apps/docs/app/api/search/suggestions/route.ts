import { type NextRequest, NextResponse } from 'next/server';
import { getSuggestions } from '~/actions/search';

export async function GET(request: NextRequest) {
  try {
    // URLからクエリパラメータを取得
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    // 検索候補を取得
    const suggestions = await getSuggestions(query);

    // 結果を返す
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('検索候補APIエラー:', error);
    return NextResponse.json(
      { error: '検索候補の取得に失敗しました' },
      { status: 500 }
    );
  }
}
