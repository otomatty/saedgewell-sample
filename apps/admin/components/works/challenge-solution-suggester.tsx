'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@kit/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@kit/ui/popover';
import { Badge } from '@kit/ui/badge';
import { Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { generateChallengeSolutions } from '~/actions/ai/generate-challenge-solutions';
import type { ChallengeSolutionResponse } from '~/types/ai';
import type { WorkFormData } from '~/types/works/work-form';

/**
 * 課題と解決策の自動提案コンポーネント
 * プロジェクトの説明と技術スタックから課題と解決策を生成して提案する
 */
export function ChallengeSolutionSuggester() {
  const { watch, setValue } = useFormContext<WorkFormData>();
  const [suggestions, setSuggestions] =
    useState<ChallengeSolutionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 監視するフィールド
  const technologies = watch('technologies');
  const description = watch('description');
  const challenges = watch('challenges');

  // 課題と解決策の提案を生成
  const generateSuggestions = async () => {
    if (!description) {
      toast.error('プロジェクトの説明を入力してください');
      return;
    }

    try {
      setIsLoading(true);
      const result = await generateChallengeSolutions({
        description,
        technologies:
          technologies && technologies.length > 0
            ? technologies.map((tech) => ({ value: tech, label: tech }))
            : [],
        existingChallenges: challenges || [],
      });

      setSuggestions(result);
      setIsOpen(true);

      if (!result.challenges.length && !result.solutions.length) {
        toast.info('提案可能な課題と解決策が見つかりませんでした');
      }
    } catch (error) {
      console.error('提案の生成に失敗しました:', error);
      toast.error('提案の生成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 提案を採用
  const adoptSuggestions = () => {
    if (!suggestions) return;

    // 現在の課題と解決策を取得
    const currentChallenges = watch('challenges') || [];
    const currentSolutions = watch('solutions') || [];

    // 新しい課題と解決策を追加
    if (suggestions.challenges.length > 0) {
      setValue(
        'challenges',
        [...currentChallenges, ...suggestions.challenges],
        {
          shouldDirty: true,
        }
      );
    }

    if (suggestions.solutions.length > 0) {
      setValue('solutions', [...currentSolutions, ...suggestions.solutions], {
        shouldDirty: true,
      });
    }

    toast.success('提案を採用しました');
    setIsOpen(false);
    setSuggestions(null);
  };

  return (
    <div className="flex justify-end mt-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={!suggestions ? generateSuggestions : undefined}
            disabled={isLoading}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            {isLoading ? '生成中...' : '課題と解決策を提案'}
          </Button>
        </PopoverTrigger>
        {suggestions && (
          <PopoverContent className="w-96 p-4" align="end">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">AIによる提案</h3>

              {suggestions.challenges.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground flex items-center">
                    提案された課題
                    <Badge className="ml-2" variant="secondary">
                      {suggestions.challenges.length}
                    </Badge>
                  </h4>
                  <ul className="text-xs space-y-1 max-h-32 overflow-y-auto pr-2">
                    {suggestions.challenges.map((challenge) => (
                      <li
                        key={`challenge-${challenge.title.substring(0, 20)}`}
                        className="border-l-2 border-primary pl-2"
                      >
                        <span className="font-medium">{challenge.title}</span>:{' '}
                        {challenge.description.length > 100
                          ? `${challenge.description.substring(0, 100)}...`
                          : challenge.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {suggestions.solutions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground flex items-center">
                    提案された解決策
                    <Badge className="ml-2" variant="secondary">
                      {suggestions.solutions.length}
                    </Badge>
                  </h4>
                  <ul className="text-xs space-y-1 max-h-32 overflow-y-auto pr-2">
                    {suggestions.solutions.map((solution) => (
                      <li
                        key={`solution-${solution.title.substring(0, 20)}`}
                        className="border-l-2 border-primary pl-2"
                      >
                        <span className="font-medium">{solution.title}</span>:{' '}
                        {solution.description.length > 100
                          ? `${solution.description.substring(0, 100)}...`
                          : solution.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  キャンセル
                </Button>
                <Button size="sm" onClick={adoptSuggestions}>
                  提案を採用
                </Button>
              </div>
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
