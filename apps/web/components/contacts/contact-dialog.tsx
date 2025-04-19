'use client';

import { Button } from '@kit/ui/button';
import { ResponsiveDialog } from '@kit/ui/responsive-dialog';
import { ContactChat, type Category } from './contact-chat';
import { HelpCircle, Settings, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@kit/ui/alert';

// サンプルカテゴリー（実際の実装では外部から注入）
const defaultCategories: Category[] = [
  {
    id: 'general',
    name: '一般的なお問い合わせ',
    description: 'サービスに関する一般的なご質問',
    icon: HelpCircle,
  },
  {
    id: 'technical',
    name: '技術的なお問い合わせ',
    description: '技術的な問題やトラブル',
    icon: Settings,
  },
  {
    id: 'other',
    name: 'その他のお問い合わせ',
    description: 'その他のご質問やご要望',
    icon: Mail,
  },
];

export interface ContactDialogProps {
  /**
   * カテゴリーのリスト
   * @default defaultCategories
   */
  categories?: Category[];
  /**
   * トリガーボタンのテキスト
   */
  triggerText?: string;
  /**
   * トリガーボタンのクラス名
   */
  triggerClassName?: string;

  /**
   * トリガーボタンのサイズ
   */
  triggerSize?: 'sm' | 'lg' | 'icon' | 'default';

  /**
   * ボタンのprops
   */
  buttonProps?: React.ComponentProps<typeof Button>;
}

/**
 * お問い合わせチャットをダイアログ/ドロワーで表示するコンポーネント
 * - デスクトップではダイアログ
 * - モバイルではドロワー
 */
export const ContactDialog = ({
  categories = defaultCategories,
  triggerText = 'お問い合わせ',
  triggerClassName,
  triggerSize = 'default',
  buttonProps,
}: ContactDialogProps) => {
  if (!Array.isArray(categories)) {
    console.error('categories must be an array');
    return null;
  }

  /**
   * メッセージ送信時の処理
   */
  const handleSendMessage = async (
    message: string,
    files: File[],
    category: Category
  ) => {
    try {
      // TODO: メッセージ送信の実装
      console.log('Message sent:', { message, files, category });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <ResponsiveDialog
      trigger={
        <Button
          className={triggerClassName}
          size={triggerSize}
          {...buttonProps}
        >
          {triggerText}
        </Button>
      }
      title="お問い合わせ"
      description="お困りの内容をお聞かせください"
      contentClassName="sm:max-w-[600px] h-[80vh]"
    >
      {({ close }) => (
        <>
          {categories.length === 0 ? (
            <Alert variant="destructive">
              <AlertDescription>
                申し訳ありません。現在お問い合わせカテゴリーが設定されていません。
              </AlertDescription>
            </Alert>
          ) : (
            <ContactChat
              categories={categories}
              onSendMessage={handleSendMessage}
              className="h-full"
            />
          )}
        </>
      )}
    </ResponsiveDialog>
  );
};
