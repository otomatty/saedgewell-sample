import type { FocusSession } from '~/types/focus';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { formatDate, formatTime } from '@kit/shared/utils';
import Link from 'next/link';

export default function SessionList() {
  const sessions: FocusSession[] = []; // TODO: 実際のセッション一覧を取得

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No sessions found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell>
              <Link
                href={`/admin/focus/history/${session.id}`}
                className="hover:underline"
              >
                {formatDate(session.started_at)}
              </Link>
            </TableCell>
            <TableCell>{session.project_id || '-'}</TableCell>
            <TableCell>{session.task_id || '-'}</TableCell>
            <TableCell>
              {session.ended_at
                ? formatTime(
                    (new Date(session.ended_at).getTime() -
                      new Date(session.started_at).getTime()) /
                      1000
                  )
                : '-'}
            </TableCell>
            <TableCell>{session.focus_score || '-'}</TableCell>
            <TableCell className="capitalize">{session.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
