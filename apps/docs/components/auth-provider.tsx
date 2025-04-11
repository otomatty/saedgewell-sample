'use client';

import { useEffect } from 'react';
import { useAuthChangeListener } from '@kit/supabase/hooks/use-auth-change-listener';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';

import pathsConfig from '~/config/paths.config';

export function AuthProvider(props: React.PropsWithChildren) {
  const supabase = useSupabase();

  // デバッグ用：コンポーネントマウント時と再レンダリング時にセッション状態をチェック
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log('[AUTH-PROVIDER-DOCS] Current session state:', {
        hasSession: !!data.session,
        userId: data.session?.user?.id,
        error: error?.message,
      });
    };

    checkSession();
  }, [supabase.auth]);

  // Cookieの確認
  useEffect(() => {
    if (typeof document !== 'undefined') {
      console.log('[AUTH-PROVIDER-DOCS] All cookies:', document.cookie);

      const cookiesStr = document.cookie;
      const cookies = cookiesStr.split(';').map((c) => c.trim());
      const authCookies = cookies.filter(
        (c) =>
          c.startsWith('sb-') || c.includes('supabase') || c.includes('auth')
      );

      console.log('[AUTH-PROVIDER-DOCS] Auth cookies:', authCookies);
    }
  }, []);

  useAuthChangeListener({
    appHomePath: pathsConfig.app.home,
    onEvent: (event, session) => {
      console.log(
        '[AUTH-PROVIDER-DOCS] Auth state change event:',
        event,
        'Session exists:',
        !!session,
        'User ID:',
        session?.user?.id
      );
    },
  });

  return props.children;
}
