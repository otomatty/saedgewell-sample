'use client';

import { cn } from '@kit/ui/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Download } from 'lucide-react';
import { Button } from '@kit/ui/button';
import { Markdown } from '@kit/ui/markdown';

export interface ChatMessageFile {
  /**
   * ファイルの名前
   */
  name: string;
  /**
   * ファイルのURL
   */
  url: string;
  /**
   * ファイルのサイズ（バイト）
   */
  size: number;
}

export interface ChatMessageProps {
  /**
   * メッセージの送信者（"user" または "assistant"）
   */
  sender: 'user' | 'assistant';
  /**
   * メッセージの本文
   */
  content: string;
  /**
   * メッセージの送信日時
   */
  timestamp: Date;
  /**
   * 添付ファイル
   */
  files?: ChatMessageFile[];
  /**
   * FAQへのリンク
   */
  faqLinks?: Array<{
    id: string;
    title: string;
  }>;
  /**
   * 追加のクラス名
   */
  className?: string;
}

export const ChatMessage = ({
  sender,
  content,
  timestamp,
  files,
  faqLinks,
  className,
}: ChatMessageProps) => {
  const isUser = sender === 'user';

  return (
    <div
      className={cn(
        'flex w-full gap-2',
        isUser ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      <div
        className={cn(
          'flex max-w-[80%] flex-col gap-2 rounded-lg p-4',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        <Markdown content={content} />

        {files && files.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {files.map((file) => (
              <Button
                key={file.url}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                asChild
              >
                <a
                  href={file.url}
                  download={file.name}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Download className="h-4 w-4" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </a>
              </Button>
            ))}
          </div>
        )}

        {faqLinks && faqLinks.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            <p className="text-sm font-medium">関連するFAQ:</p>
            <ul className="list-inside list-disc">
              {faqLinks.map((faq) => (
                <li key={faq.id}>
                  <a
                    href={`/faq#${faq.id}`}
                    className="text-sm hover:underline"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {faq.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <time
          className={cn(
            'mt-1 text-right text-xs',
            isUser ? 'text-primary-foreground/80' : 'text-muted-foreground/80'
          )}
        >
          {format(timestamp, 'HH:mm', { locale: ja })}
        </time>
      </div>
    </div>
  );
};

const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${Math.round(size * 10) / 10}${units[unitIndex]}`;
};
