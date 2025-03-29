import { Suspense } from 'react';
import { SiteSettingsForm } from './_components/site-settings-form';
import { PageHeader } from '@kit/ui/page-header';
import { requireAdmin } from '@kit/next/actions';
import { getSiteSettings } from '@kit/next/actions';

export const metadata = {
  title: 'サイト設定',
};

export default async function SiteSettingsPage() {
  // 管理者権限の確認
  await requireAdmin();

  // サイト設定の取得
  const settings = await getSiteSettings();

  if (!settings) {
    throw new Error('サイト設定の取得に失敗しました');
  }

  return (
    <>
      <PageHeader
        title="サイト設定"
        description="サイトの基本設定、SEO設定、機能の有効/無効を管理します。"
      />
      <div className="space-y-6 container">
        <div className="grid gap-6">
          <Suspense fallback={<div>読み込み中...</div>}>
            <SiteSettingsForm initialSettings={settings} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
