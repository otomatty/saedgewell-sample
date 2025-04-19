'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@kit/ui/dialog';
import { Button } from '@kit/ui/button';
import type { WorkSuggestion } from '~/types/ai';

interface AiSuggestionsListProps {
  suggestions: WorkSuggestion[];
  onApply: (suggestion: WorkSuggestion) => void;
  onClose: () => void;
}

/**
 * 個別の提案カードコンポーネント
 */
interface SuggestionItemProps {
  suggestion: WorkSuggestion;
  onApply: () => void;
}

function SuggestionItem({ suggestion, onApply }: SuggestionItemProps) {
  // フィールド名を日本語に変換
  const getFieldName = (field: string): string => {
    const fieldNames: Record<string, string> = {
      title: 'タイトル',
      description: '説明',
      detail_overview: '概要',
      detail_role: '役割',
      detail_period: '期間',
      detail_team_size: 'チーム規模',
    };
    return fieldNames[field] || field;
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 hover:border-primary transition-colors">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium">
          {getFieldName(suggestion.field)}の改善提案
        </h3>
        <Button variant="ghost" size="sm" onClick={onApply}>
          適用
        </Button>
      </div>

      <div className="text-sm">
        <div className="bg-muted p-2 rounded mb-2">
          <p className="text-muted-foreground">{suggestion.suggestion}</p>
        </div>
        <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
      </div>
    </div>
  );
}

/**
 * AI提案リストコンポーネント
 * ダイアログとして表示され、複数の改善提案を選択可能な形で表示する
 */
export function AiSuggestionsList({
  suggestions,
  onApply,
  onClose,
}: AiSuggestionsListProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI改善提案</DialogTitle>
          <DialogDescription>
            AIが分析した実績内容の改善提案です。適用したい提案を選択してください。
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion) => (
            <SuggestionItem
              key={`${suggestion.field}-${suggestion.suggestion.substring(0, 20)}`}
              suggestion={suggestion}
              onApply={() => onApply(suggestion)}
            />
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
