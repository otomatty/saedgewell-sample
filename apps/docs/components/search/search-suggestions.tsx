import React from 'react';
import Link from 'next/link';
import { FileText, Folder, Book } from 'lucide-react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ユーティリティ関数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

interface SearchSuggestionsProps {
  suggestions: SearchResult[];
  isVisible: boolean;
  onSelect: () => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
}

export function SearchSuggestions({
  suggestions,
  isVisible,
  onSelect,
  highlightedIndex,
  setHighlightedIndex,
}: SearchSuggestionsProps) {
  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  // カテゴリに基づいてアイコンを取得する関数
  const getIconForCategory = (category: string, sourceType: string) => {
    if (category === 'documents') {
      return <FileText className="h-5 w-5 text-blue-500" />;
    }

    if (category === 'wiki') {
      return <Book className="h-5 w-5 text-green-500" />;
    }

    return <Folder className="h-5 w-5 text-amber-500" />;
  };

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-md border border-border bg-background shadow-lg">
      <ul className="py-2">
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.id}
            className={cn(
              'px-4 py-2 hover:bg-accent/50 cursor-pointer flex items-center gap-3',
              highlightedIndex === index && 'bg-accent/50'
            )}
            onMouseEnter={() => setHighlightedIndex(index)}
          >
            <Link
              href={`/search?q=${encodeURIComponent(suggestion.title)}`}
              className="flex items-center gap-3 w-full"
              onClick={onSelect}
            >
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                {getIconForCategory(suggestion.category, suggestion.sourceType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {suggestion.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {suggestion.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
