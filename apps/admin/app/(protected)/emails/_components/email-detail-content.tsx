import { getEmailDetail } from '~/actions/mail/gmail';
import { Button } from '@kit/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { SheetHeader, SheetTitle } from '@kit/ui/sheet';
import { formatDateTime } from '@kit/shared/utils';
import { formatFileSize } from '@kit/shared/utils';
import { Reply, Archive, Star, Mail, Download, Check } from 'lucide-react';
import parse from 'html-react-parser';
import {
  markEmailAsRead,
  archiveEmail,
  toggleEmailStar,
  downloadEmailAttachment,
} from '~/actions/mail/gmail';

interface EmailDetailContentProps {
  emailId: string;
}

export async function EmailDetailContent({ emailId }: EmailDetailContentProps) {
  const email = await getEmailDetail(emailId);

  if (!email) {
    return <div>メールが見つかりません</div>;
  }

  return (
    <div className="space-y-6">
      <SheetHeader>
        <div className="flex items-start justify-between gap-4">
          <SheetTitle className="text-xl">{email.subject}</SheetTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={email.is_starred ? 'text-yellow-500' : ''}
              onClick={async () => {
                await toggleEmailStar(email.id, !email.is_starred);
              }}
            >
              <Star className="h-4 w-4" />
            </Button>
            {!email.is_read && (
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await markEmailAsRead(email.id);
                }}
              >
                <Mail className="h-4 w-4" />
              </Button>
            )}
            {!email.is_archived && (
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await archiveEmail(email.id);
                }}
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
            <Button variant="secondary" size="icon">
              <Reply className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetHeader>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <div>
            <span className="font-medium">From: </span>
            {email.from_name ? (
              <>
                {email.from_name}{' '}
                <span className="text-muted-foreground">
                  &lt;{email.from_email}&gt;
                </span>
              </>
            ) : (
              email.from_email
            )}
          </div>
          <div className="text-muted-foreground">
            {formatDateTime(email.received_at)}
          </div>
        </div>
        <div>
          <span className="font-medium">To: </span>
          {email.to_email.join(', ')}
        </div>
        {email.cc_email && email.cc_email.length > 0 && (
          <div>
            <span className="font-medium">Cc: </span>
            {email.cc_email.join(', ')}
          </div>
        )}
      </div>

      <Tabs defaultValue="html" className="w-full">
        <TabsList>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="text">プレーンテキスト</TabsTrigger>
        </TabsList>
        <TabsContent value="html" className="mt-4">
          {email.body_html ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {parse(email.body_html)}
            </div>
          ) : (
            <div className="text-muted-foreground">
              HTMLコンテンツはありません
            </div>
          )}
        </TabsContent>
        <TabsContent value="text" className="mt-4">
          {email.body_text ? (
            <pre className="whitespace-pre-wrap font-normal">
              {email.body_text}
            </pre>
          ) : (
            <div className="text-muted-foreground">
              プレーンテキストコンテンツはありません
            </div>
          )}
        </TabsContent>
      </Tabs>

      {email.email_attachments && email.email_attachments.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">添付ファイル</h3>
          <div className="grid gap-2">
            {email.email_attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between rounded-lg border p-2"
              >
                <div className="flex items-center gap-2">
                  <div className="truncate">
                    <div className="font-medium">{attachment.file_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatFileSize(attachment.file_size)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    const url = await downloadEmailAttachment(
                      email.id,
                      attachment.id
                    );
                    if (url) {
                      window.open(url, '_blank');
                    }
                  }}
                  disabled={attachment.is_downloaded ?? false}
                >
                  {attachment.is_downloaded ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
