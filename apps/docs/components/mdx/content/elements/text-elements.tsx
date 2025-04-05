'use client';

import type React from 'react';

/**
 * 段落コンポーネント
 */
export function Paragraph({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className="my-4 text-base leading-7 text-muted-foreground" {...props}>
      {children}
    </p>
  );
}

/**
 * 順序なしリストコンポーネント
 */
export function UnorderedList({
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className="my-4 ml-6 list-disc space-y-2 text-base leading-7 text-muted-foreground"
      {...props}
    >
      {children}
    </ul>
  );
}

/**
 * 順序付きリストコンポーネント
 */
export function OrderedList({
  children,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className="my-4 ml-6 list-decimal space-y-2 text-base leading-7 text-muted-foreground"
      {...props}
    >
      {children}
    </ol>
  );
}

/**
 * リスト項目コンポーネント
 */
export function ListItem({
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className="my-1 text-base leading-7 text-muted-foreground" {...props}>
      {children}
    </li>
  );
}

/**
 * 引用コンポーネント
 */
export function Blockquote({
  children,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className="my-4 border-l-4 border-primary pl-4 py-1 text-base italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  );
}

/**
 * 区切り線コンポーネント
 */
export function HorizontalRule(props: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className="my-8 border-t border-border" {...props} />;
}
