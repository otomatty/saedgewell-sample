'use client';

import { useState } from 'react';

/**
 * コードブロックのコピーボタンコンポーネント
 * @param code - コピーするコード
 */
interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      className="copy-button"
      onClick={handleCopy}
      aria-label="コードをコピー"
    >
      {copied ? 'コピーしました！' : 'コピー'}
    </button>
  );
}
