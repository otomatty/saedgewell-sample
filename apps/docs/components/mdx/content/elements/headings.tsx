'use client';

import type React from 'react';
import { useScrollToAnchor } from '../../../../hooks/mdx/use-scroll-to-anchor';
import { generateIdFromText } from '../utils/id-generator';

/**
 * 見出しコンポーネントの共通プロパティ
 */
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * 見出しコンポーネント
 * レベルに応じた見出しタグを生成し、アンカーリンク機能を提供します
 */
export function Heading({ children, level, ...props }: HeadingProps) {
  const { scrollToElement } = useScrollToAnchor();
  const id = generateIdFromText(children);

  // レベルに応じたクラス名を設定
  const classNames = {
    1: 'text-3xl font-bold mt-12 mb-4 group scroll-mt-28',
    2: 'text-2xl font-bold mt-10 mb-3 group scroll-mt-28',
    3: 'text-xl font-bold mt-8 mb-3 group scroll-mt-28',
    4: 'text-lg font-bold mt-6 mb-2 group scroll-mt-28',
    5: 'text-base font-bold mt-5 mb-2 group scroll-mt-28',
    6: 'text-sm font-bold mt-4 mb-2 group scroll-mt-28',
  };

  // アイコンサイズをレベルに応じて調整
  const iconSizes = {
    1: '0.8em',
    2: '0.8em',
    3: '0.7em',
    4: '0.7em',
    5: '0.6em',
    6: '0.6em',
  };

  // レベルに応じたHTMLタグを選択
  const renderHeading = () => {
    switch (level) {
      case 1:
        return (
          <h2 id={id} className={classNames[level]} {...props}>
            {children}
            {renderLinkButton()}
          </h2>
        );
      case 2:
        return (
          <h3 id={id} className={classNames[level]} {...props}>
            {children}
            {renderLinkButton()}
          </h3>
        );
      case 3:
        return (
          <h4 id={id} className={classNames[level]} {...props}>
            {children}
            {renderLinkButton()}
          </h4>
        );
      case 4:
        return (
          <h5 id={id} className={classNames[level]} {...props}>
            {children}
            {renderLinkButton()}
          </h5>
        );
      case 5:
      case 6:
        return (
          <h6 id={id} className={classNames[level]} {...props}>
            {children}
            {renderLinkButton()}
          </h6>
        );
      default:
        return null;
    }
  };

  // リンクボタンをレンダリング
  const renderLinkButton = () => (
    <button
      type="button"
      className="ml-2 inline-flex items-center opacity-0 transform translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
      aria-label={`${children}へのリンク`}
      onClick={() => {
        if (id) {
          scrollToElement(id);
        }
      }}
    >
      <span className="sr-only">{children}へのリンク</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSizes[level]}
        height={iconSizes[level]}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="inline-block text-primary"
        aria-hidden="true"
      >
        <title>リンクアイコン</title>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    </button>
  );

  return renderHeading();
}

/**
 * 各レベルの見出しコンポーネント
 */
export function H1(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <Heading level={1} {...props} />;
}

export function H2(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <Heading level={2} {...props} />;
}

export function H3(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <Heading level={3} {...props} />;
}

export function H4(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <Heading level={4} {...props} />;
}

export function H5(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <Heading level={5} {...props} />;
}

export function H6(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <Heading level={6} {...props} />;
}
