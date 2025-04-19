'use client';

import { useRef, useState } from 'react';
import { Button } from '@kit/ui/button';
import { Textarea } from '@kit/ui/textarea';
import { cn } from '@kit/ui/utils';
import { Paperclip, Send } from 'lucide-react';
import { toast } from 'sonner';

export interface ChatInputProps {
  /**
   * メッセージ送信時のコールバック
   */
  onSend: (message: string, files?: File[]) => Promise<void>;
  /**
   * 追加のクラス名
   */
  className?: string;
  /**
   * 送信中かどうか
   */
  isSending?: boolean;
}

export const ChatInput = ({ onSend, className, isSending }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!message.trim() && files.length === 0) return;

    try {
      await onSend(message, files);
      setMessage('');
      setFiles([]);
    } catch (error) {
      console.error(error);
      toast.error(
        'メッセージの送信に失敗しました。時間をおいて再度お試しください。'
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    // TODO: ファイルの種類と容量の制限を実装
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() =>
                  setFiles((prev) => prev.filter((f) => f !== file))
                }
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力してください..."
          className="min-h-[2.5rem] max-h-[10rem] resize-none"
          disabled={isSending}
        />

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={(!message.trim() && files.length === 0) || isSending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />
      </div>
    </div>
  );
};
