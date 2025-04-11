'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Search, Github, Loader2, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@kit/ui/command';
import { Button } from '@kit/ui/button';
import { getGithubRepositories } from '~/actions/github/get-github-repositories';
import type { GithubRepository } from '~/types/github';

interface GithubRepositorySelectorModalProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
}

/**
 * GitHubリポジトリ選択モーダル
 * リポジトリの検索・選択ができるモーダルコンポーネント
 */
export function GithubRepositorySelectorModal({
  onSelect,
  trigger,
}: GithubRepositorySelectorModalProps) {
  const [open, setOpen] = useState(false);
  const [repositories, setRepositories] = useState<GithubRepository[]>([]);
  const [filteredRepositories, setFilteredRepositories] = useState<
    GithubRepository[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // リポジトリ一覧の取得
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getGithubRepositories();
        setRepositories(data);
        setFilteredRepositories(data);
      } catch (err) {
        console.error('リポジトリの取得に失敗しました:', err);
        setError('リポジトリの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchRepositories();
    }
  }, [open]);

  // 検索フィルタリング
  useEffect(() => {
    if (!search.trim()) {
      setFilteredRepositories(repositories);
      return;
    }

    const lowerSearch = search.toLowerCase();
    const filtered = repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(lowerSearch) ||
        repo.owner.toLowerCase().includes(lowerSearch) ||
        `${repo.owner}/${repo.name}`.toLowerCase().includes(lowerSearch)
    );
    setFilteredRepositories(filtered);
  }, [search, repositories]);

  // リポジトリ選択時の処理
  const handleSelect = (repository: GithubRepository) => {
    if (repository.html_url) {
      onSelect(repository.html_url);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="ml-2">
            <Github className="mr-2 h-4 w-4" />
            リポジトリを選択
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>GitHubリポジトリを選択</DialogTitle>
          <DialogDescription>
            登録済みのリポジトリから選択するか、検索して見つけてください
          </DialogDescription>
        </DialogHeader>

        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="リポジトリを検索..."
            value={search}
            onValueChange={setSearch}
          />
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                リポジトリを読み込み中...
              </span>
            </div>
          ) : error ? (
            <div className="px-4 py-6 text-center text-sm text-red-500">
              {error}
            </div>
          ) : (
            <CommandList>
              <CommandEmpty>
                <div className="py-6 text-center text-sm">
                  リポジトリが見つかりませんでした
                </div>
              </CommandEmpty>
              <CommandGroup heading="リポジトリ一覧">
                {filteredRepositories.map((repository) => (
                  <CommandItem
                    key={repository.id}
                    onSelect={() => handleSelect(repository)}
                    className="flex items-center"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    <span className="mr-2 font-medium">
                      {repository.owner}/{repository.name}
                    </span>
                    {repository.is_private && (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                        非公開
                      </span>
                    )}
                    {repository.html_url && (
                      <ExternalLink className="ml-auto h-3 w-3 flex-shrink-0 text-muted-foreground" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setOpen(false)} size="sm">
            キャンセル
          </Button>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            size="sm"
            className="text-muted-foreground"
          >
            手動入力する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
