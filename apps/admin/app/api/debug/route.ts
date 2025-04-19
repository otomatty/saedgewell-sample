import { debugAdminPermissions } from '@kit/next/actions';
import { NextResponse } from 'next/server';

/**
 * 管理者権限のデバッグ情報を取得するAPIエンドポイント
 * このエンドポイントは開発環境でのみ有効にする
 */
export async function GET() {
  // 本番環境では無効化
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const debug = await debugAdminPermissions();
    return NextResponse.json(debug);
  } catch (error) {
    console.error('Error in debug API:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        errorObject: error,
      },
      { status: 500 }
    );
  }
}
