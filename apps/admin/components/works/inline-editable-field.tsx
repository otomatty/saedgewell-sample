'use client'; // 編集状態とインタラクションのため

/**
 * @file インライン編集可能なフィールドコンポーネント。
 * @description テキストなどをクリックすると編集モードに切り替わり、編集後に保存処理を呼び出します。
 * 表示モードと編集モードを持ちます。
 */

import type React from 'react';
import { useState, useRef, useEffect, useTransition, useCallback } from 'react';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Button } from '@kit/ui/button';
import { Check, X, Pencil, Loader2 } from 'lucide-react'; // アイコン例
import { cn } from '@kit/ui/utils';
import { toast } from 'sonner';

/**
 * InlineEditableField コンポーネントの Props
 */
interface InlineEditableFieldProps {
  /** 編集対象の初期値 */
  initialValue: string | number;
  /**
   * 保存ボタンが押されたときに呼び出される非同期関数。
   * @param newValue 新しい値
   * @returns Promise<void>
   */
  onSave: (newValue: string | number) => Promise<void>;
  /** フィールドのラベル (主にアクセシビリティ用) */
  label?: string;
  /** 編集時のプレースホルダー */
  placeholder?: string;
  /** 表示/編集に使用する要素 ('text' は Input, 'textarea' は Textarea) */
  displayAs?: 'text' | 'textarea';
  /**
   * オプションのバリデーション関数。
   * @param value 現在の値
   * @returns エラーメッセージ (string) または null (エラーなし)
   */
  validation?: (value: string | number) => string | null;
  /** コンポーネント全体に追加するCSSクラス */
  className?: string;
}

/**
 * クリックすることでインライン編集が可能になるフィールドコンポーネント。
 */
const InlineEditableField = ({
  initialValue,
  onSave,
  label,
  placeholder = '値を入力してください',
  displayAs = 'text',
  validation,
  className,
}: InlineEditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startTransition] = useTransition(); // 保存処理中の状態
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const previousValue = useRef(initialValue); // キャンセル用に元の値を保持

  // initialValue が外部から変更された場合、内部状態も更新
  useEffect(() => {
    setValue(initialValue);
    previousValue.current = initialValue; // キャンセル用に元の値も更新
  }, [initialValue]);

  // 編集モードになったら入力フィールドにフォーカス
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (
        displayAs === 'text' &&
        inputRef.current instanceof HTMLInputElement
      ) {
        inputRef.current.select(); // Inputの場合は全選択
      }
    }
  }, [isEditing, displayAs]);

  // 保存処理
  const handleSave = useCallback(() => {
    setError(null);
    if (validation) {
      const validationError = validation(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    if (value === previousValue.current) {
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      try {
        await onSave(value);
        previousValue.current = value;
        setIsEditing(false);
      } catch (err) {
        console.error('Inline save failed:', err);
        setError('保存に失敗しました。再度お試しください。');
        toast.error(
          `保存に失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`
        );
      }
    });
  }, [value, validation, onSave]);

  // キャンセル処理
  const handleCancel = useCallback(() => {
    setValue(previousValue.current); // 変更を元に戻す
    setError(null);
    setIsEditing(false);
  }, []);

  // キーボード操作 (Enterで保存, Escapeでキャンセル)
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (
        event.key === 'Enter' &&
        !(displayAs === 'textarea' && event.shiftKey)
      ) {
        event.preventDefault();
        handleSave();
      } else if (event.key === 'Escape') {
        handleCancel();
      }
    },
    [handleSave, handleCancel, displayAs]
  );

  return (
    <div className={cn('relative group', className)}>
      {isEditing ? (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            {displayAs === 'text' ? (
              <Input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={String(value)} // Ensure value is string for Input
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-label={label}
                className={cn(
                  'flex-grow h-9',
                  error ? 'border-red-500' : 'border-input'
                )}
                disabled={isSaving}
              />
            ) : (
              <Textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={String(value)} // Ensure value is string for Textarea
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-label={label}
                className={cn(
                  'flex-grow',
                  error ? 'border-red-500' : 'border-input'
                )}
                rows={3} // Default rows, could be a prop
                disabled={isSaving}
              />
            )}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-green-600 hover:bg-green-100 hover:text-green-700"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <span className="sr-only">保存</span>
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isSaving}
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">キャンセル</span>
            </Button>
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      ) : (
        <button
          type="button"
          className={cn(
            'flex items-center w-full text-left cursor-pointer hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-1 rounded min-h-[36px] group',
            !initialValue && 'text-muted-foreground italic' // 値がない場合はイタリックで表示
          )}
          onClick={() => setIsEditing(true)}
          aria-label={`${label || 'フィールド'}: ${initialValue || placeholder}. クリックまたはEnterで編集`}
          disabled={isSaving} // 保存中は編集モードに入れないようにする
        >
          <span className="flex-grow break-words whitespace-pre-wrap">
            {/* 値がない場合はプレースホルダーを表示 */}
            {initialValue || placeholder}
          </span>
          <Pencil
            size={14}
            className="ml-2 shrink-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 text-muted-foreground"
          />
        </button>
      )}
    </div>
  );
};

export default InlineEditableField;
