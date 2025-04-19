'use client';

import type React from 'react';

/**
 * 強調コンポーネント
 */
export function Strong({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  );
}

/**
 * 斜体コンポーネント
 */
export function Emphasis({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <em className="italic text-muted-foreground" {...props}>
      {children}
    </em>
  );
}

/**
 * リンクコンポーネント
 */
export function Anchor({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className="text-primary font-medium hover:underline"
      {...props}
    >
      {children}
    </a>
  );
}
