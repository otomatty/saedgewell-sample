import { PageHeader } from '@kit/ui/page-header';
import { EmailListSkeleton } from './_components/email-list-skeleton';
import { GmailAuthButton } from '~/components/gmail/auth-button';

export default function Loading() {
  return (
    <div className="space-y-4">
      <PageHeader title="メール管理" actions={<GmailAuthButton />} />
      <EmailListSkeleton />
    </div>
  );
}
