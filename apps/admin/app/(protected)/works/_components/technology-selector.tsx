'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { toast } from 'sonner';
import MultiSelectCombobox, {
  type ComboboxOption,
} from '../../../../components/works/multi-select-combobox';
import { getTechnologies } from '../../../../actions/technologies/get-technologies';
import {
  createTechnology,
  generateSlug,
} from '../../../../actions/technologies/create-technology';

interface TechnologySelectorProps {
  /** 選択されている技術IDの配列 */
  selectedTechnologies: string[];
  /** 選択変更時のコールバック */
  onChange: (selectedTechnologies: string[]) => void;
  /** 無効状態にするか */
  disabled?: boolean;
  /** コンポーネントのルート要素に追加するCSSクラス */
  className?: string;
}

/**
 * 技術選択コンポーネント
 * 既存の技術を選択したり、新しい技術を追加したりできます
 */
export function TechnologySelector({
  selectedTechnologies,
  onChange,
  disabled,
  className,
}: TechnologySelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 技術一覧を取得
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const technologies = await getTechnologies();

        // MultiSelectCombobox用のオプション形式に変換
        const techOptions = technologies.map((tech) => ({
          value: tech.id,
          label: tech.name,
        }));

        setOptions(techOptions);
      } catch (err) {
        console.error('技術一覧取得エラー:', err);
        setError('技術情報の取得に失敗しました');
        toast.error('技術情報の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  // 新しい技術を作成
  const handleCreateTechnology = async (inputValue: string) => {
    try {
      // スラッグを生成
      const slug = await generateSlug(inputValue);

      // 技術を作成
      const newTechnology = await createTechnology({
        name: inputValue,
        slug,
      });

      // 選択肢に追加
      const newOption = {
        value: newTechnology.id,
        label: newTechnology.name,
      };

      setOptions((prev) => [...prev, newOption]);

      return newOption;
    } catch (err) {
      console.error('技術作成エラー:', err);
      toast.error(
        `新しい技術の作成に失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`
      );
      return null;
    }
  };

  // 選択変更時の処理
  const handleSelectionChange = (values: string[]) => {
    onChange(values);
  };

  return (
    <div className={className}>
      <MultiSelectCombobox
        options={options}
        selectedValues={selectedTechnologies}
        onChange={handleSelectionChange}
        placeholder="技術を選択..."
        searchPlaceholder="技術を検索..."
        emptyPlaceholder="一致する技術がありません"
        allowCreate={true}
        onCreate={handleCreateTechnology}
        disabled={disabled || isLoading || isPending}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
