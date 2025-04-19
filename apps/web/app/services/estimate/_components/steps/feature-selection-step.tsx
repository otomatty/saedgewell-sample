'use client';

import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { Card } from '@kit/ui/card';
import { Label } from '@kit/ui/label';
import { Checkbox } from '@kit/ui/checkbox';
import { Badge } from '@kit/ui/badge';
import { Skeleton } from '@kit/ui/skeleton';
import {
  proposedFeaturesAtom,
  selectedFeatureIdsAtom,
  currentStepAtom,
  workflowResultAtom,
  estimationLoadingAtom,
} from '~/store/estimate';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@kit/ui/button';
import type { FeatureProposal } from '~/types/estimate';

export function FeatureSelectionStep() {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const [selectedFeatureIds, setSelectedFeatureIds] = useAtom(
    selectedFeatureIdsAtom
  );
  const [proposedFeatures] = useAtom(proposedFeaturesAtom);
  const [workflowResult] = useAtom(workflowResultAtom);
  const [isLoading] = useAtom(estimationLoadingAtom);
  const [error, setError] = useState<string | null>(null);

  // 初期表示時、workflowResultやproposedFeaturesがなければエラー表示
  useEffect(() => {
    // ローディング中はエラーを表示しない
    if (isLoading) return;

    // ローディングが終わった後で、結果がなければエラー
    if (!workflowResult && proposedFeatures.length === 0) {
      setError(
        '見積もり計算が完了していないか、機能の生成に失敗しました。前のステップからやり直してください。'
      );
    } else {
      setError(null);
    }
  }, [workflowResult, proposedFeatures.length, isLoading]);

  // このステップで初めて読み込まれた時に、必須機能を自動選択
  useEffect(() => {
    if (proposedFeatures.length > 0 && selectedFeatureIds.length === 0) {
      const requiredFeatureIds = proposedFeatures
        .filter((f) => f.isRequired)
        .map((f) => f.id);
      setSelectedFeatureIds(requiredFeatureIds);
    }
  }, [proposedFeatures, selectedFeatureIds.length, setSelectedFeatureIds]);

  const handleFeatureToggle = (featureId: string, isRequired: boolean) => {
    if (isRequired) return; // 必須機能は選択解除できない

    setSelectedFeatureIds((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const getTotalPrice = () => {
    return proposedFeatures
      .filter((f) => selectedFeatureIds.includes(f.id))
      .reduce((sum, f) => sum + f.price, 0);
  };

  const getTotalDuration = () => {
    return proposedFeatures
      .filter((f) => selectedFeatureIds.includes(f.id))
      .reduce((sum, f) => sum + f.duration, 0);
  };

  const handleNext = () => {
    // 選択された機能をフォームデータに反映（任意）
    setCurrentStep('implementation-requirements');
  };

  const handleBack = () => {
    setCurrentStep('ai-questions');
  };

  // ローディング中
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center text-primary mb-4">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>見積もり計算を実行中です...</p>
        </div>
        <div className="grid gap-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 space-y-4">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <p className="text-destructive font-medium">{error}</p>
        <p className="text-sm text-muted-foreground">
          見積もり計算が正常に完了していないか、データの取得に失敗しました。
        </p>
        <div className="pt-4">
          <Button variant="secondary" onClick={handleBack}>
            質問回答ステップに戻る
          </Button>
        </div>
      </div>
    );
  }

  // データがまだ存在しない場合はローディング表示
  if (proposedFeatures.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  // カテゴリごとに機能をグループ化
  const getFeaturesByCategory = () => {
    const categories = {
      core: '基本機能',
      user: 'ユーザー管理',
      auth: '認証機能',
      content: 'コンテンツ管理',
      payment: '決済機能',
      other: 'その他',
    };

    // カテゴリでグループ化
    const groupedFeatures = proposedFeatures.reduce(
      (groups, feature) => {
        const category = feature.category;
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(feature);
        return groups;
      },
      {} as Record<FeatureProposal['category'], FeatureProposal[]>
    );

    // 必須項目が先に来るようにソート
    for (const key of Object.keys(groupedFeatures)) {
      const category = key as FeatureProposal['category'];
      groupedFeatures[category].sort((a, b) => {
        // 必須項目を優先
        if (a.isRequired && !b.isRequired) return -1;
        if (!a.isRequired && b.isRequired) return 1;
        return 0;
      });
    }

    return { categories, groupedFeatures };
  };

  const { categories, groupedFeatures } = getFeaturesByCategory();

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">推奨機能一覧</h3>
          <p className="text-sm text-muted-foreground">
            以下はAIが分析した結果、必要と思われる機能です。必須機能は自動的に選択されています。
            任意機能はチェックボックスで選択してください。
          </p>
          {workflowResult && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">見積もり計算結果</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  必須機能の合計コスト:{' '}
                  {workflowResult.requiredCost.toLocaleString()}円
                </div>
                <div>
                  任意機能の合計コスト:{' '}
                  {workflowResult.optionalCost.toLocaleString()}円
                </div>
                <div>
                  必須機能の合計工数: {workflowResult.requiredHours}時間
                </div>
                <div>
                  任意機能の合計工数: {workflowResult.optionalHours}時間
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {Object.entries(categories).map(([categoryKey, categoryName]) => {
            const featuresInCategory =
              groupedFeatures[categoryKey as FeatureProposal['category']];
            if (!featuresInCategory || featuresInCategory.length === 0)
              return null;

            return (
              <div key={categoryKey} className="space-y-4">
                <h4 className="font-medium border-b pb-2">{categoryName}</h4>
                {featuresInCategory.map((feature) => (
                  <Card key={feature.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        id={feature.id}
                        checked={selectedFeatureIds.includes(feature.id)}
                        onCheckedChange={() =>
                          handleFeatureToggle(feature.id, feature.isRequired)
                        }
                        disabled={feature.isRequired}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={feature.id}
                            className="text-base font-medium"
                          >
                            {feature.name}
                          </Label>
                          <Badge
                            variant={
                              feature.isRequired ? 'default' : 'secondary'
                            }
                          >
                            {feature.isRequired ? '必須' : '任意'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                        {feature.reason && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">
                              {feature.isRequired ? '必須' : '任意'}の理由：
                            </span>{' '}
                            {feature.reason}
                          </p>
                        )}
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>開発期間: {feature.duration.toFixed(1)}日</span>
                          <span>
                            費用目安: {feature.price.toLocaleString()}円
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed right-8 top-1/2 -translate-y-1/2 w-80">
        <Card className="p-4 shadow-lg border-primary/20">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-1">合計</h3>
              <p className="text-sm text-muted-foreground">
                選択した機能の合計金額と想定開発期間
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">
                {getTotalPrice().toLocaleString()}円
              </div>
              <div className="text-sm text-muted-foreground">
                想定開発期間：約{getTotalDuration().toFixed(1)}日
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handleNext}>
              次のステップへ
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
