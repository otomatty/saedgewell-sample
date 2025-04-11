'use client';

import { SearchInput } from '../search/search-input';
import { useEffect, useRef } from 'react';

/**
 * ドキュメントサイトのトップページに表示するヒーローセクション
 * 検索機能を提供します
 */
export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // スクロール検出とヘッダー表示制御
  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;

    // ヘッダーを初期状態で非表示にするイベントを発行
    window.dispatchEvent(
      new CustomEvent('hero-visible', { detail: { visible: true } })
    );

    const observer = new IntersectionObserver(
      (entries) => {
        // ヒーローが画面内にあるかどうかを検出
        const isVisible = entries[0]?.isIntersecting;

        // カスタムイベントを発行してヘッダーの表示/非表示を制御
        window.dispatchEvent(
          new CustomEvent('hero-visible', { detail: { visible: isVisible } })
        );
      },
      {
        // ヒーローの上部が画面の上端に達したときに検出
        rootMargin: '-10px 0px 0px 0px',
        threshold: 0,
      }
    );

    // ヒーロー要素の監視を開始
    observer.observe(heroElement);

    return () => {
      // コンポーネントのアンマウント時に監視を停止
      observer.disconnect();
      // ヘッダーを表示状態に戻す
      window.dispatchEvent(
        new CustomEvent('hero-visible', { detail: { visible: false } })
      );
    };
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative flex items-center justify-center bg-gradient-to-b from-background to-muted/30 min-h-[40vh] px-4"
    >
      <div className="w-full max-w-3xl">
        <style jsx global>{`
          /* 検索入力フィールドのサイズを大きくするためのスタイル */
          .hero-search .search-input {
            height: 4rem;
            font-size: 1.25rem;
            border-width: 2px;
            border-radius: 0.75rem;
            padding-left: 1.5rem;
            padding-right: 4rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: all 0.2s ease-in-out;
          }
          
          .hero-search .search-input:focus {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border-color: var(--primary);
          }
          
          .hero-search .search-button {
            height: 4rem;
            width: 4rem;
            right: 0.25rem;
          }
          
          .hero-search .search-button svg {
            height: 1.5rem;
            width: 1.5rem;
          }
          
          /* 検索候補のスタイル調整 */
          .hero-search + div {
            max-width: 3xl;
            border-radius: 0.75rem;
            margin-top: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        `}</style>
        <div className="hero-search">
          <SearchInput />
        </div>
      </div>
    </div>
  );
}
