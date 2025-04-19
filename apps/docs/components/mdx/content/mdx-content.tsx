'use client';

import { useState, useEffect, useRef } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import React from 'react';
import { MDXComponents } from './utils/mdx-components';

/**
 * MDXコンテンツのプロパティ
 * @param code - MDXバンドラーによって生成されたコード
 */
interface MDXContentProps {
  code: MDXRemoteSerializeResult;
}

/**
 * MDXコンテンツをレンダリングするコンポーネント
 * @param code - シリアライズされたMDXコンテンツ
 */
export function MDXContent({ code }: MDXContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // レンダリング後にDOMを確認
  useEffect(() => {
    if (contentRef.current) {
      const childNodes = contentRef.current.querySelectorAll('*');
      const keywordLinks = contentRef.current.querySelectorAll('.keyword-link');

      // [[キーワード]]パターンを含むテキストノードを探す
      const textNodes = Array.from(contentRef.current.querySelectorAll('*'))
        .flatMap((el) => Array.from(el.childNodes))
        .filter(
          (node) =>
            node.nodeType === Node.TEXT_NODE && node.textContent?.includes('[[')
        );

      if (textNodes.length > 0) {
        // 必要に応じて処理を追加
      }
    }
  }, []);

  if (!code) {
    return (
      <div className="text-red-500">MDXコンテンツが提供されていません</div>
    );
  }

  try {
    return (
      <div
        ref={contentRef}
        className="mdx-content prose prose-stone dark:prose-invert prose-headings:scroll-mt-28 w-full max-w-full px-4 md:px-6"
      >
        <style jsx global>{`
          /* 見出しのスタイル */
          h1, h2, h3, h4, h5, h6 {
            position: relative;
            transition: color 0.2s ease;
          }
          
          /* 見出しホバー時のスタイル */
          h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover {
            color: var(--tw-prose-links);
          }
        `}</style>
        <MDXRemote {...code} components={MDXComponents} />
      </div>
    );
  } catch (error) {
    return (
      <div className="text-red-500">
        MDXコンテンツのレンダリング中にエラーが発生しました: {String(error)}
      </div>
    );
  }
}
