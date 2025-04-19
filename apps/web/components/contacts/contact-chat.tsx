'use client';

import { useCallback, useState } from 'react';
import { CategoryCard, type CategoryCardProps } from './category-card';
import { ChatInput } from './chat-input';
import { ChatMessage, type ChatMessageProps } from './chat-message';
import { FAQAccordion, type FAQ } from './faq-accordion';
import { cn } from '@kit/ui/utils';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: CategoryCardProps['icon'];
}

export interface Message extends Omit<ChatMessageProps, 'className'> {
  id: string;
}

export interface ContactChatProps {
  /**
   * カテゴリーのリスト
   */
  categories: Category[];
  /**
   * メッセージ送信時のコールバック
   */
  onSendMessage: (
    message: string,
    files: File[],
    category: Category
  ) => Promise<void>;
  /**
   * 追加のクラス名
   */
  className?: string;
}

export const ContactChat = ({
  categories,
  onSendMessage,
}: ContactChatProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [relatedFAQs, setRelatedFAQs] = useState<FAQ[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    setSelectedCategory(category);
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: 'assistant',
        content: `${category.name}カテゴリーについて、どのようなことでお困りですか？`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = useCallback(
    async (message: string, files: File[] = []) => {
      if (!selectedCategory) return;

      try {
        setIsSending(true);

        // ユーザーメッセージを追加
        const userMessage: Message = {
          id: crypto.randomUUID(),
          sender: 'user',
          content: message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        // メッセージを送信
        await onSendMessage(message, files, selectedCategory);

        // TODO: AIアシスタントの応答を追加
        // TODO: 関連FAQを更新
      } catch (error) {
        console.error(error);
        toast.error(
          'メッセージの送信に失敗しました。時間をおいて再度お試しください。'
        );
      } finally {
        setIsSending(false);
      }
    },
    [selectedCategory, onSendMessage]
  );

  const handleFAQClick = useCallback((faq: FAQ) => {
    // TODO: FAQの内容をチャットメッセージとして引用する機能を実装
  }, []);

  if (!selectedCategory) {
    return (
      <div className="flex flex-col gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            description={category.description}
            icon={category.icon}
            onSelect={handleCategorySelect}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex h-full flex-col gap-4')}>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
      </div>

      {relatedFAQs.length > 0 && (
        <div className="border-t bg-muted/50 p-4">
          <FAQAccordion faqs={relatedFAQs} onFAQClick={handleFAQClick} />
        </div>
      )}

      <div className="border-t bg-background p-4">
        <ChatInput onSend={handleSendMessage} isSending={isSending} />
      </div>
    </div>
  );
};
