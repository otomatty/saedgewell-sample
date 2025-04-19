'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';

/**
 * 認証デバッグ用のステータスバーコンポーネント
 * 現在のホスト名と認証状態を表示します
 */
export function AuthDebugBar() {
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [hostname, setHostname] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [authCookies, setAuthCookies] = useState<string[]>([]);
  const supabase = useSupabase();

  useEffect(() => {
    // 現在のホスト名を取得
    if (typeof window !== 'undefined') {
      setHostname(window.location.hostname);

      // セッション確認
      const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        setHasSession(!!data.session);
        setUserId(data.session?.user?.id || null);
      };

      // Cookie情報を取得
      const getCookies = () => {
        const cookiesStr = document.cookie;
        const cookies = cookiesStr.split(';').map((c) => c.trim());
        const filteredCookies = cookies.filter(
          (c) =>
            c.startsWith('sb-') || c.includes('supabase') || c.includes('auth')
        );
        setAuthCookies(filteredCookies);
      };

      checkSession();
      getCookies();

      // 5秒ごとに更新
      const interval = setInterval(() => {
        checkSession();
        getCookies();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [supabase.auth]);

  if (hasSession === null) return null;

  // 認証ステータスに基づいて背景色を設定
  const bgColor = hasSession ? '#4caf50' : '#f44336';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px',
        background: bgColor,
        color: 'white',
        fontSize: '12px',
        textAlign: 'center',
        zIndex: 9999,
        display: process.env.NODE_ENV === 'production' ? 'none' : 'block',
      }}
    >
      <div>
        <strong>ホスト:</strong> {hostname} |<strong>認証状態:</strong>{' '}
        {hasSession ? '認証済み' : '未認証'}
        {userId && (
          <span>
            {' '}
            | <strong>ユーザーID:</strong> {userId.slice(0, 8)}...
          </span>
        )}
      </div>
      <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>
        <strong>認証Cookie:</strong>{' '}
        {authCookies.length ? `${authCookies.length}個` : 'なし'}
      </div>
    </div>
  );
}
