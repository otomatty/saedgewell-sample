'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuthChangeListener } from '@kit/supabase/hooks/use-auth-change-listener';

import pathsConfig from '~/config/paths.config';

export function AuthProvider(props: React.PropsWithChildren) {
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAuth = useCallback(async () => {
    setIsInitialized(true);
  }, []);

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
  });

  if (!isInitialized) {
    return null;
  }

  return props.children;
}
