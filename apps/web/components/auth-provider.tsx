'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuthChangeListener } from '@kit/supabase/hooks/use-auth-change-listener';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';

import pathsConfig from '~/config/paths.config';

export function AuthProvider(props: React.PropsWithChildren) {
  const supabase = useSupabase();
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAuth = useCallback(async () => {
    const { data } = await supabase.auth.getSession();

    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH-PROVIDER] Initial session state:', {
        hasSession: !!data.session,
        userId: data.session?.user?.id,
      });
    }

    setIsInitialized(true);
  }, [supabase.auth]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (!mounted) return;
      await initializeAuth();
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [initializeAuth]);

  useAuthChangeListener({
    appHomePath: pathsConfig.app.home,
    onEvent: (event, session) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          '[AUTH-PROVIDER] Auth state change event:',
          event,
          'Session exists:',
          !!session,
          'User ID:',
          session?.user?.id
        );
      }
    },
  });

  if (!isInitialized) {
    return null;
  }

  return props.children;
}
