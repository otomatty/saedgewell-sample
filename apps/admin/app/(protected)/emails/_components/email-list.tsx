'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Star, Mail, Archive } from 'lucide-react';
import { Button } from '@kit/ui/button';
import {
  markEmailAsRead,
  archiveEmail,
  toggleEmailStar,
} from '~/actions/mail/gmail';
import { useState } from 'react';
import { EmailDetailSheet } from './email-detail-sheet';

interface Email {
  id: string;
  from_name: string | null;
  from_email: string;
  subject: string;
  received_at: string;
  is_read: boolean | null;
  is_starred: boolean | null;
  is_archived: boolean | null;
}

export function EmailList({ emails }: { emails: Email[] }) {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  if (!emails || emails.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        メールがありません
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>差出人</TableHead>
              <TableHead>件名</TableHead>
              <TableHead className="w-48">受信日時</TableHead>
              <TableHead className="w-32">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emails.map((email) => (
              <TableRow
                key={email.id}
                className={!email.is_read ? 'font-medium' : undefined}
                onClick={() => setSelectedEmailId(email.id)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={email.is_starred ? 'text-yellow-500' : ''}
                    onClick={async (e) => {
                      e.stopPropagation();
                      await toggleEmailStar(email.id, !email.is_starred);
                    }}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>{email.from_name || email.from_email}</TableCell>
                <TableCell>{email.subject}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(email.received_at), {
                    addSuffix: true,
                    locale: ja,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {!email.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={async (e) => {
                          e.stopPropagation();
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
                        onClick={async (e) => {
                          e.stopPropagation();
                          await archiveEmail(email.id);
                        }}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EmailDetailSheet
        emailId={selectedEmailId}
        onClose={() => setSelectedEmailId(null)}
      />
    </>
  );
}
