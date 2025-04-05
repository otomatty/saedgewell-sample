'use client';

import React, { useEffect, useState } from 'react';
import { TableOfContentsSkeleton } from './table-of-contents-skeleton';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TOCItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 画面内に入った見出しのうち、最も上にあるものをアクティブにする
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // 複数の見出しが表示されている場合は、最も上にあるものを選択
          const topEntry = visibleEntries.reduce((prev, current) => {
            return prev.boundingClientRect.top > current.boundingClientRect.top
              ? current
              : prev;
          });
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: '-80px 0% -80% 0%',
        threshold: 0.1, // 少しでも見えたらトリガー
      }
    );

    for (const heading of headings) {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // URLのハッシュを更新
      window.history.pushState(null, '', `#${id}`);

      // ヘッダーの高さを考慮してスクロール
      const headerHeight = 80; // ヘッダーの高さ（px）
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth',
      });
    }
  };

  // 見出しがない場合はスケルトンを表示
  if (headings.length === 0) {
    return <TableOfContentsSkeleton />;
  }

  return (
    <nav className="toc sticky top-20 flex flex-col w-full max-h-[calc(100vh-6rem)] overflow-hidden">
      <div className="sticky top-0 z-10 flex items-center justify-between p-2 bg-background/80 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-foreground">目次</h2>
      </div>
      <div className="overflow-y-auto pr-2">
        <ul className="space-y-1 py-2">
          {headings.map((heading, index) => (
            <li
              key={`${heading.id}-${index}`}
              style={{
                paddingLeft: `${(heading.level - 2) * 0.75}rem`,
              }}
              className="relative"
            >
              {activeId === heading.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full" />
              )}
              <button
                type="button"
                onClick={() => handleClick(heading.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleClick(heading.id)}
                className={`text-sm transition-all duration-200 text-left w-full py-1.5 px-2 rounded ${
                  activeId === heading.id
                    ? 'text-primary font-medium bg-primary/10'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
