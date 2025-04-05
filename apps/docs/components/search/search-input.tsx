'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@kit/ui/input';
import { Button } from '@kit/ui/button';
import { SearchSuggestions } from './search-suggestions';

// 検索結果の型定義
interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
  excerpt: string;
  priority: number;
  sourceType: string;
  thumbnail?: string;
}

// サーバーアクションの呼び出し
async function getSuggestions(query: string): Promise<SearchResult[]> {
  try {
    // サーバーアクションを直接インポートできない場合は、fetch APIを使用
    const response = await fetch(
      `/api/search/suggestions?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error('検索候補の取得に失敗しました');
    }
    return await response.json();
  } catch (error) {
    console.error('検索候補の取得エラー:', error);
    return [];
  }
}

export function SearchInput() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 検索候補を取得する
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const results = await getSuggestions(searchQuery.trim());
        setSuggestions(results);
      } catch (error) {
        console.error('検索候補の取得に失敗しました:', error);
        setSuggestions([]);
      } finally {
        setIsDebouncing(false);
      }
    };

    // デバウンス処理
    setIsDebouncing(true);
    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // 検索を実行する
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setShowSuggestions(false);
      });
    }
  };

  // キーボード操作
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    // 下キー: 次の候補を選択
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }
    // 上キー: 前の候補を選択
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }
    // Enterキー: 選択中の候補で検索
    else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const selectedSuggestion = suggestions[highlightedIndex];
      if (selectedSuggestion) {
        setSearchQuery(selectedSuggestion.title);
        startTransition(() => {
          router.push(
            `/search?q=${encodeURIComponent(selectedSuggestion.title)}`
          );
          setShowSuggestions(false);
        });
      }
    }
    // Escapeキー: 候補を閉じる
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // 候補選択時の処理
  const handleSuggestionSelect = () => {
    setShowSuggestions(false);
  };

  // 入力フィールド外をクリックしたときに候補を閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={inputRef}>
      <form onSubmit={handleSearch} className="relative w-full">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="ドキュメントを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="pr-10 search-input"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-0 search-button"
            disabled={isPending}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* 検索候補 */}
      <SearchSuggestions
        suggestions={suggestions}
        isVisible={showSuggestions && suggestions.length > 0 && !isDebouncing}
        onSelect={handleSuggestionSelect}
        highlightedIndex={highlightedIndex}
        setHighlightedIndex={setHighlightedIndex}
      />
    </div>
  );
}
