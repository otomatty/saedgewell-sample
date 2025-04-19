'use client'; // 状態管理とインタラクションのため

/**
 * @file 複数選択可能なコンボボックスコンポーネント。
 * @description 技術スタックやスキルなど、定義済みの選択肢から複数選択したり、
 * 必要に応じて新しい項目を追加したりするために使用します。
 * shadcn/ui の Popover, Command, Badge などを組み合わせて実装します。
 */

import React, { useState, useMemo, useTransition } from 'react';
import { Check, ChevronsUpDown, PlusCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@kit/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@kit/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@kit/ui/command';
import { Badge } from '@kit/ui/badge';
import { cn } from '@kit/ui/utils';
import { toast } from 'sonner';

/**
 * コンボボックスの選択肢の型
 */
export interface ComboboxOption {
  value: string;
  label: string;
}

/**
 * MultiSelectCombobox コンポーネントの Props
 */
interface MultiSelectComboboxProps {
  /** 選択肢のリスト */
  options: ComboboxOption[];
  /** 現在選択されている値のリスト */
  selectedValues: string[];
  /** 選択状態が変更されたときのコールバック */
  onChange: (selectedValues: string[]) => void;
  /** 何も選択されていないときの表示テキスト */
  placeholder?: string;
  /** 検索入力のプレースホルダー */
  searchPlaceholder?: string;
  /** 検索結果がない場合の表示テキスト */
  emptyPlaceholder?: string;
  /** 新しい選択肢の作成を許可するか */
  allowCreate?: boolean;
  /**
   * 新規作成ボタンが押されたときに呼び出される非同期関数。
   * @param inputValue 作成する新しい値のラベル
   * @returns Promise<ComboboxOption | null> 作成されたOptionオブジェクト、または失敗時にnull
   */
  onCreate?: (inputValue: string) => Promise<ComboboxOption | null>;
  /** コンポーネントのルート要素に追加するCSSクラス */
  className?: string;
  /** 無効状態にするか */
  disabled?: boolean;
}

/**
 * 複数選択可能なコンボボックスコンポーネント。
 * shadcn/ui の Popover, Command, Badge を使用します。
 */
const MultiSelectCombobox = ({
  options = [],
  selectedValues = [],
  onChange,
  placeholder = '選択してください...',
  searchPlaceholder = '検索...',
  emptyPlaceholder = '見つかりません',
  allowCreate = false,
  onCreate,
  className,
  disabled,
}: MultiSelectComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, startCreateTransition] = useTransition();

  // 選択されているOptionオブジェクトのリスト (メモ化 - performance-rules)
  const selectedOptions = useMemo(
    () => options.filter((option) => selectedValues.includes(option.value)),
    [options, selectedValues]
  );

  // 選択/選択解除の処理
  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
    // Popoverを閉じない方が連続選択しやすい場合もある
    // setOpen(false);
  };

  // 新規作成処理
  const handleCreate = async () => {
    if (!allowCreate || !onCreate || !searchQuery || isCreating) return;

    startCreateTransition(async () => {
      try {
        const newOption = await onCreate(searchQuery);
        if (newOption) {
          // 新しく作成されたオプションも選択状態にする
          if (!selectedValues.includes(newOption.value)) {
            onChange([...selectedValues, newOption.value]);
          }
          setSearchQuery(''); // 検索クエリをクリア
          // 新しいオプションが options 配列に追加されるかは onCreate の実装次第
          // ここでは追加された前提で動作する
          // setOpen(false); // 必要に応じて閉じる
        } else {
          toast.warning(`'${searchQuery}' の作成に失敗しました。`);
        }
      } catch (error) {
        console.error('Failed to create option:', error); // error-handling-guidelines
        toast.error(
          `'${searchQuery}' の作成中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`
        );
      }
    });
  };

  // 表示するオプションリスト (検索クエリでフィルタリング)
  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [options, searchQuery]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
        <Button
          variant="outline"
          aria-expanded={open}
          className={cn(
            'w-full justify-between h-auto min-h-[40px]',
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-grow mr-2 items-center">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  {option.label}
                  <button
                    type="button"
                    aria-label={`Remove ${option.label}`}
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option.value);
                    }}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--trigger-width] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            aria-label="Search options"
          />
          <CommandList>
            <CommandEmpty>
              {filteredOptions.length === 0 &&
              searchQuery &&
              allowCreate &&
              onCreate ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start mt-1 text-left h-auto py-2"
                  onClick={handleCreate}
                  disabled={isCreating}
                  size="sm"
                >
                  {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  '{searchQuery}' を作成
                </Button>
              ) : (
                emptyPlaceholder
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value} // Commandでのフィルタリングにも使われる
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="flex-grow mr-2">{option.label}</span>
                  <Check
                    className={cn(
                      'h-4 w-4 shrink-0',
                      selectedValues.includes(option.value)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectCombobox;
