import { cookies } from 'next/headers';
import { StrictMode } from 'react';

import { Toaster } from '@kit/ui/sonner';
import { cn } from '@kit/ui/utils';

import { RootProviders } from '~/components/root-providers';
import { heading, sans } from '~/lib/fonts';
// import { createI18nServerInstance } from '~/lib/i18n/i18n.server'; // コメントアウト
import { generateRootMetadata } from '~/lib/root-metdata';
import RootLayout from '~/components/layout/root-layout';
import { getAuthState } from '@kit/next/actions';

import '../styles/globals.css';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { language } = await createI18nServerInstance(); // コメントアウト
  const language = 'ja'; // 固定値に設定
  const theme = await getTheme();
  const className = getClassName(theme);
  const authResult = await getAuthState();
  const { profile } = authResult;

  // デバッグ用のログ出力
  console.log('[LAYOUT-DEBUG] getAuthState result:', {
    isAuthenticated: !!profile,
    profileId: profile?.id,
    profileEmail: profile?.email,
    profileData: profile
      ? `${JSON.stringify(profile).slice(0, 100)}...`
      : 'null',
    authResultKeys: Object.keys(authResult),
  });

  // 認証Cookieの状態も確認
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const authCookies = allCookies.filter(
    (cookie) =>
      cookie.name.includes('auth') ||
      cookie.name.includes('supabase') ||
      cookie.name.includes('sb-')
  );

  console.log(
    '[LAYOUT-DEBUG] Auth Cookies:',
    authCookies.map((c) => ({
      name: c.name,
      value: c.value ? `${c.value.substring(0, 15)}...` : '(undefined)',
    }))
  );

  return (
    <html lang={language} className={className}>
      <body suppressHydrationWarning>
        <StrictMode>
          <RootProviders theme={theme} lang={language}>
            <RootLayout profile={profile}>{children}</RootLayout>
          </RootProviders>

          <Toaster richColors={true} theme={theme} position="top-center" />
        </StrictMode>
      </body>
    </html>
  );
}

function getClassName(theme?: string) {
  const dark = theme === 'dark';
  const light = !dark;

  const font = [sans.variable, heading.variable].reduce<string[]>(
    (acc, curr) => {
      if (acc.includes(curr)) return acc;

      acc.push(curr);
      return acc;
    },
    []
  );

  return cn('bg-background min-h-screen antialiased', font.join(' '), {
    dark,
    light,
  });
}

async function getTheme() {
  const cookiesStore = await cookies();
  return cookiesStore.get('theme')?.value as 'light' | 'dark' | 'system';
}

export const generateMetadata = generateRootMetadata;
