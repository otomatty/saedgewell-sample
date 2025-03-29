'use client';

/**
 * ユーザー一覧のフィルターコンポーネント
 */
import { Button } from '@kit/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import { Input } from '@kit/ui/input';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function UserFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleRoleFilter = (role: string) => {
    const params = new URLSearchParams(searchParams);
    if (params.get('role') === role) {
      params.delete('role');
    } else {
      params.set('role', role);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="ユーザーを検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)}
        className="w-[300px]"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">ロール</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={searchParams.get('role') === 'admin'}
            onCheckedChange={() => handleRoleFilter('admin')}
          >
            管理者
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={searchParams.get('role') === 'client'}
            onCheckedChange={() => handleRoleFilter('client')}
          >
            クライアント
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={searchParams.get('role') === 'user'}
            onCheckedChange={() => handleRoleFilter('user')}
          >
            一般ユーザー
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
