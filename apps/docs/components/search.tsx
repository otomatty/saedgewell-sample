'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import { searchDocuments } from '~/actions/search';
import type { SearchResult } from '~/types/search';
import { cn } from '@kit/ui/utils';

export function SearchButton() {
  const [open, setOpen] = useState(false);

  // キーボードショートカットの設定
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">ドキュメントを検索...</span>
        <span className="inline-flex lg:hidden">検索...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <SearchDialog open={open} setOpen={setOpen} />
    </>
  );
}

function SearchDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (value.length === 0) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchDocuments(value);
      setResults(searchResults);
    } catch (error) {
      console.error('検索中にエラーが発生しました:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setOpen(false);
      router.push(result.path);
    },
    [router, setOpen]
  );

  // ダイアログが開いたときに入力フィールドにフォーカス
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5" />
            ドキュメント検索
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 py-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="キーワードを入力..."
              className="pl-8"
              value={query}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
        <div
          className={cn(
            'max-h-[300px] overflow-y-auto px-4 pb-4',
            results.length === 0 && 'hidden'
          )}
        >
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <ul className="space-y-2">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
                    onClick={() => handleSelect(result)}
                  >
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.description}
                    </div>
                    {result.matchedContent && (
                      <div className="text-xs mt-1 text-muted-foreground line-clamp-1">
                        {result.matchedContent}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {query && results.length === 0 && !isLoading && (
          <div className="px-4 pb-4 text-center text-muted-foreground">
            「{query}」に一致する結果は見つかりませんでした
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
