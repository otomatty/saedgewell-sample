'use client';

import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Progress } from '@kit/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@kit/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import type { WorkFormData } from '~/types/works/work-form';

interface Feedback {
  message: string;
  type: 'positive' | 'negative';
}

/**
 * 実績内容の品質スコアコンポーネント
 * フォームの入力内容を分析し、品質スコアとアドバイスを表示する
 */
export function WorkQualityScore() {
  const { watch } = useFormContext<WorkFormData>();

  // 監視するフィールドを指定
  const watchedValues = watch([
    'title',
    'description',
    'detail_overview',
    'detail_role',
    'detail_period',
    'detail_team_size',
    'technologies',
    'challenges',
    'solutions',
    'images',
  ]);

  // useMemo を使ってスコアとフィードバックを計算
  const { score, feedbacks } = useMemo(() => {
    // watchedValuesから各値を取り出す
    const [
      title,
      description,
      detail_overview,
      detail_role,
      detail_period,
      detail_team_size,
      technologies,
      challenges,
      solutions,
      images,
    ] = watchedValues;

    let calculatedScore = 0;
    const calculatedFeedbacks: Feedback[] = [];

    // ---- スコア計算ロジック ----
    // 基本情報のスコア
    if (title && title.length >= 5) {
      calculatedScore += 10;
      calculatedFeedbacks.push({
        message: 'タイトルが適切に設定されています',
        type: 'positive',
      });
    } else {
      calculatedFeedbacks.push({
        message: 'タイトルはより具体的なものにしましょう',
        type: 'negative',
      });
    }

    if (description && description.length >= 30) {
      calculatedScore += 10;
      calculatedFeedbacks.push({
        message: '説明文が十分に記述されています',
        type: 'positive',
      });
    } else {
      calculatedFeedbacks.push({
        message: '説明文をより詳しく記述しましょう（30文字以上推奨）',
        type: 'negative',
      });
    }

    // 詳細情報のスコア
    if (detail_overview && detail_overview.length >= 100) {
      calculatedScore += 15;
      calculatedFeedbacks.push({
        message: '概要が詳細に記述されています',
        type: 'positive',
      });
    } else {
      calculatedFeedbacks.push({
        message: '概要はより詳細に記述しましょう（100文字以上推奨）',
        type: 'negative',
      });
    }

    if (detail_role) {
      calculatedScore += 10;
      calculatedFeedbacks.push({
        message: '役割が記述されています',
        type: 'positive',
      });
    } else {
      calculatedFeedbacks.push({
        message: '担当した役割を記述しましょう',
        type: 'negative',
      });
    }

    if (detail_period) {
      calculatedScore += 5;
      calculatedFeedbacks.push({
        message: '期間が記述されています',
        type: 'positive',
      });
    } else {
      calculatedFeedbacks.push({
        message: '開発期間を記述しましょう',
        type: 'negative',
      });
    }

    if (detail_team_size) {
      calculatedScore += 5;
      calculatedFeedbacks.push({
        message: 'チーム規模が記述されています',
        type: 'positive',
      });
    } else {
      calculatedFeedbacks.push({
        message: 'チーム規模を記述しましょう',
        type: 'negative',
      });
    }

    // 技術スタックのスコア
    if (technologies && technologies.length >= 3) {
      calculatedScore += 10;
      calculatedFeedbacks.push({
        message: '技術スタックが十分に記述されています',
        type: 'positive',
      });
    } else {
      calculatedFeedbacks.push({
        message: '使用した技術をより多く記述しましょう（3つ以上推奨）',
        type: 'negative',
      });
    }

    // 課題と解決策のスコア
    if (challenges && challenges.length >= 2) {
      calculatedScore += 15;
      calculatedFeedbacks.push({
        message: '課題が十分に記述されています',
        type: 'positive',
      });
    } else {
      calculatedFeedbacks.push({
        message: 'プロジェクトで直面した課題をより多く記述しましょう',
        type: 'negative',
      });
    }

    if (solutions && solutions.length >= 2) {
      calculatedScore += 15;
      calculatedFeedbacks.push({
        message: '解決策が十分に記述されています',
        type: 'positive',
      });
    } else {
      calculatedFeedbacks.push({
        message: '課題に対する解決策をより多く記述しましょう',
        type: 'negative',
      });
    }

    // 画像のスコア
    if (images && images.length >= 2) {
      calculatedScore += 5;
      calculatedFeedbacks.push({
        message: '複数の画像が添付されています',
        type: 'positive',
      });
    } else {
      calculatedFeedbacks.push({
        message: 'プロジェクトの画像をより多く添付しましょう',
        type: 'negative',
      });
    }
    // ---- スコア計算ロジック ここまで ----

    return { score: calculatedScore, feedbacks: calculatedFeedbacks };
  }, [watchedValues]); // watchedValues配列全体を依存配列に指定 (参照が変わった時のみ再計算)

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getProgressColor = () => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 50) return 'bg-amber-600';
    return 'bg-red-600';
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          実績内容の品質スコア
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 ml-1 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-xs">
                  実績内容の充実度を示すスコアです。より詳細で魅力的な内容にすることで、スコアが向上します。
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        <span className={`text-lg font-bold ${getScoreColor()}`}>
          {score}/100
        </span>
      </div>

      <Progress
        value={score}
        className="h-2"
        style={{ backgroundColor: '#f1f5f9' }}
      >
        <div
          className={`h-full ${getProgressColor()}`}
          style={{ width: `${score}%`, transition: 'width 0.5s ease-in-out' }}
        />
      </Progress>

      <div className="space-y-1 mt-2">
        <h4 className="text-xs font-medium">改善のヒント:</h4>
        <ul className="text-xs space-y-1">
          {feedbacks
            .filter((feedback) => feedback.type === 'negative')
            .slice(0, 3)
            .map((feedback) => (
              <li
                key={`feedback-${feedback.message.substring(0, 20)}`}
                className="text-muted-foreground"
              >
                • {feedback.message}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
