import { Suspense } from 'react';
import { EmailList } from './_components/email-list';
import { EmailListSkeleton } from './_components/email-list-skeleton';
import { GmailAuthButton } from '~/components/gmail/auth-button';
import { getEmails } from '~/actions/mail/gmail';
import { syncEmails } from '~/lib/server/gmail/service';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageHeader } from '@kit/ui/page-header';

export default async function EmailsPage() {
  const supabase = await getSupabaseServerClient();

  // 最後の同期から5分以上経過している場合のみ同期を実行
  const { data: lastSync } = await supabase
    .from('email_settings')
    .select('last_sync_at')
    .single();

  const lastSyncTime = lastSync?.last_sync_at
    ? new Date(lastSync.last_sync_at)
    : null;
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  if (!lastSyncTime || lastSyncTime < fiveMinutesAgo) {
    await syncEmails();
  }

  // 同期したメールを取得
  const result = await getEmails();
  const { emails } = result;

  return (
    <div className="space-y-4">
      <PageHeader title="メール管理" actions={<GmailAuthButton />} />
      <div className="container">
        <Suspense fallback={<EmailListSkeleton />}>
          <EmailList emails={emails} />
        </Suspense>
      </div>
    </div>
  );
}
