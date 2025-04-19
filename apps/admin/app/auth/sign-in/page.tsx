'use client';

import pathsConfig from '~/config/paths.config';
import { AuthLayoutShell } from '@kit/auth/shared';
import { SignInMethodsContainer } from '@kit/auth/sign-in';

export default function SignInPage() {
  return (
    <AuthLayoutShell>
      <SignInMethodsContainer
        paths={{
          callback: pathsConfig.auth.callback,
          home: pathsConfig.app.home,
        }}
        providers={{
          password: false,
          magicLink: false,
          oAuth: ['google'],
        }}
      />
    </AuthLayoutShell>
  );
}
