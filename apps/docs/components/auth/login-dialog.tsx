'use client';

import { useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import pathsConfig from '~/config/paths.config';
import authConfig from '~/config/auth.config';
import { Button } from '@kit/ui/button';
import { ResponsiveDialog } from '@kit/ui/responsive-dialog';
import { SignInMethodsContainer } from '@kit/auth/sign-in';

export const LoginDialog = () => {
  const currentPath = usePathname();

  const paths = useMemo(
    () => ({
      callback: pathsConfig.auth.callback,
      home: currentPath ?? pathsConfig.app.home,
    }),
    [currentPath]
  );

  return (
    <ResponsiveDialog
      trigger={<Button>ログイン</Button>}
      title="ログイン"
      description="ソーシャルアカウントでログインしてください"
      contentClassName="sm:max-w-[400px]"
    >
      {({ close }) => {
        const handleSignInSuccess = () => {
          console.log('Login success, closing dialog...');
          close();
        };

        return (
          <SignInMethodsContainer
            paths={paths}
            providers={authConfig.providers}
            onSignInSuccess={handleSignInSuccess}
          />
        );
      }}
    </ResponsiveDialog>
  );
};
