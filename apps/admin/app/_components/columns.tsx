'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@kit/ui/avatar';
import { Badge } from '@kit/ui/badge';
import { formatDate } from '@kit/shared/utils';
import type { Database } from '@kit/supabase/database';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@kit/ui/dropdown-menu';
import { Button } from '@kit/ui/button';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

type UserForTable = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
  roles: Array<{
    id: string;
    name: string;
  }>;
};

export const columns: ColumnDef<UserForTable>[] = [
  {
    accessorKey: 'avatar_url',
    header: '',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Avatar>
          <AvatarImage src={user.avatar_url ?? undefined} />
          <AvatarFallback>
            {user.full_name?.[0] ?? user.email?.[0]?.toUpperCase() ?? '?'}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: 'full_name',
    header: '名前',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div>
          <div className="font-medium">{user.full_name ?? '未設定'}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'roles',
    header: 'ロール',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-1">
          {user.roles.map((role) => (
            <Badge key={role.id} variant={getBadgeVariant(role.name)}>
              {role.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: '登録日',
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      return createdAt ? formatDate(createdAt) : '';
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">メニューを開く</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              IDをコピー
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}`}>詳細を表示</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function getBadgeVariant(
  role: string
): 'default' | 'secondary' | 'destructive' {
  switch (role) {
    case 'admin':
      return 'destructive';
    case 'client':
      return 'secondary';
    default:
      return 'default';
  }
}
