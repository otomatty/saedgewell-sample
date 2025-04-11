'use client';

import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';

interface SessionDebuggerProps {
  session: Session | null;
}

/**
 * セッションデバッグ情報を表示するコンポーネント
 * 開発環境でのみ使用することを想定しています
 */
export function SessionDebugger({ session }: SessionDebuggerProps) {
  const [showDetails, setShowDetails] = useState(false);

  // ログインページへの遷移処理
  const handleLoginClick = () => {
    window.location.href = '/auth/login';
  };

  // ログアウトページへの遷移処理
  const handleLogoutClick = () => {
    window.location.href = '/auth/logout';
  };

  // コンソール出力処理
  const handleConsoleOutput = () => {
    console.log('セッション情報:', session);
    console.log('ユーザー情報:', session?.user);
    console.log('リフレッシュトークン:', session?.refresh_token);
    alert('セッション情報をコンソールに出力しました');
  };

  // セッションがない場合
  if (!session) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-center justify-between">
          <p className="text-red-800 font-medium">認証状態: 未認証</p>
          <button
            type="button"
            className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
            onClick={handleLoginClick}
          >
            ログインページへ
          </button>
        </div>
      </div>
    );
  }

  // セッション有効期限の表示用フォーマット
  const expirationDate = session.expires_at
    ? new Date(session.expires_at * 1000).toLocaleString('ja-JP')
    : '不明';

  // セッションがある場合
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <p className="text-green-800 font-medium">認証状態: 認証済み</p>
        <button
          type="button"
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '詳細を隠す' : '詳細を表示'}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <p className="font-medium text-gray-700">ユーザーID:</p>
          <p className="text-gray-800">{session.user.id}</p>
        </div>
        {session.user.email && (
          <div>
            <p className="font-medium text-gray-700">メールアドレス:</p>
            <p className="text-gray-800">{session.user.email}</p>
          </div>
        )}
        {session.user.app_metadata?.provider && (
          <div>
            <p className="font-medium text-gray-700">認証プロバイダー:</p>
            <p className="text-gray-800">
              {session.user.app_metadata.provider}
            </p>
          </div>
        )}
        <div>
          <p className="font-medium text-gray-700">セッション有効期限:</p>
          <p className="text-gray-800">{expirationDate}</p>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 border-t border-green-200 pt-4">
          <p className="font-medium text-gray-700 mb-2">セッション詳細:</p>
          <div className="bg-white p-3 rounded overflow-auto max-h-96 text-xs font-mono">
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>

          <div className="mt-4">
            <p className="font-medium text-gray-700 mb-2">ユーザー情報:</p>
            <div className="bg-white p-3 rounded overflow-auto max-h-96 text-xs font-mono">
              <pre>{JSON.stringify(session.user, null, 2)}</pre>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1.5 rounded"
              onClick={handleConsoleOutput}
            >
              コンソールに出力
            </button>

            <button
              type="button"
              className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded"
              onClick={handleLogoutClick}
            >
              ログアウト
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
