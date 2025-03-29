'use client';

import { useAtom } from 'jotai';
import { useEffect, useState, useCallback } from 'react';
import { Card } from '@kit/ui/card';
import { Label } from '@kit/ui/label';
import { Checkbox } from '@kit/ui/checkbox';
import { Badge } from '@kit/ui/badge';
import { Skeleton } from '@kit/ui/skeleton';
import {
  aiQuestionsAtom,
  formDataAtom,
  proposedFeaturesAtom,
  selectedFeatureIdsAtom,
  currentStepAtom,
} from '../../_atoms/estimate';
import { generateFeatures } from '~/actions/estimate/generateFeatures';
import { cn } from '@kit/ui/utils';
import { CheckIcon, Loader2Icon, RefreshCw } from 'lucide-react';
import { Button } from '@kit/ui/button';

export function FeatureSelectionStep() {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const [formData] = useAtom(formDataAtom);
  const [selectedFeatureIds, setSelectedFeatureIds] = useAtom(
    selectedFeatureIdsAtom
  );
  const [proposedFeatures, setProposedFeatures] = useAtom(proposedFeaturesAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<{
    step: number;
    message: string;
    completed: boolean;
  }>({
    step: 0,
    message: '',
    completed: false,
  });

  const statusMessages = [
    {
      id: 'generate',
      loading: '機能を考えています...',
      completed: '機能の検討が完了しました',
    },
    {
      id: 'analyze',
      loading: '機能の必要性を検討しています...',
      completed: '機能の必要性の判断が完了しました',
    },
    {
      id: 'estimate',
      loading: '開発期間と開発費用を検討しています...',
      completed: '開発期間と開発費用の検討が完了しました',
    },
  ] as const;

  const generateFeaturesList = useCallback(async () => {
    if (!formData.projectType || !formData.description) return;

    setIsLoading(true);
    setError(null);
    try {
      setGenerationStatus({
        step: 1,
        message: statusMessages[0]?.loading ?? '機能を生成中...',
        completed: false,
      });

      const result = await generateFeatures(formData);
      const features = result.features.map((f) => ({
        ...f,
        category: f.category as
          | 'content'
          | 'other'
          | 'core'
          | 'user'
          | 'auth'
          | 'payment',
      }));
      setProposedFeatures(features);
      setGenerationStatus(result.status);

      const requiredFeatureIds = features
        .filter((f) => f.isRequired)
        .map((f) => f.id);
      setSelectedFeatureIds(requiredFeatureIds);
    } catch (error) {
      console.error('Error generating features:', error);
      setError('機能の生成中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, [formData, setProposedFeatures, setSelectedFeatureIds, statusMessages]);

  useEffect(() => {
    if (proposedFeatures.length === 0) {
      generateFeaturesList();
    }
  }, [proposedFeatures.length, generateFeaturesList]);

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
    setCurrentStep('estimate-result');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          {statusMessages.map((message) => (
            <div
              key={message.id}
              className={cn('flex items-center gap-2 text-sm', {
                'text-muted-foreground':
                  statusMessages.indexOf(message) > generationStatus.step - 1,
                'text-primary':
                  statusMessages.indexOf(message) === generationStatus.step - 1,
                'text-primary font-medium':
                  statusMessages.indexOf(message) < generationStatus.step - 1,
              })}
            >
              {(statusMessages.indexOf(message) < generationStatus.step - 1 ||
                generationStatus.completed) && (
                <CheckIcon className="h-4 w-4" />
              )}
              {statusMessages.indexOf(message) === generationStatus.step - 1 &&
                !generationStatus.completed && (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                )}
              <span>
                {statusMessages.indexOf(message) < generationStatus.step - 1 ||
                generationStatus.completed
                  ? message.completed
                  : message.loading}
              </span>
            </div>
          ))}
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-primary hover:underline mt-2"
          type="button"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            {statusMessages.map((message) => (
              <div
                key={message.id}
                className={cn('flex items-center gap-2 text-sm', {
                  'text-muted-foreground':
                    statusMessages.indexOf(message) > generationStatus.step - 1,
                  'text-primary':
                    statusMessages.indexOf(message) ===
                    generationStatus.step - 1,
                  'text-primary font-medium':
                    statusMessages.indexOf(message) < generationStatus.step - 1,
                })}
              >
                {(statusMessages.indexOf(message) < generationStatus.step - 1 ||
                  generationStatus.completed) && (
                  <CheckIcon className="h-4 w-4" />
                )}
                {statusMessages.indexOf(message) ===
                  generationStatus.step - 1 &&
                  !generationStatus.completed && (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  )}
                <span>
                  {statusMessages.indexOf(message) <
                    generationStatus.step - 1 || generationStatus.completed
                    ? message.completed
                    : message.loading}
                </span>
              </div>
            ))}
          </div>
          {!isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={generateFeaturesList}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              機能を再生成
            </Button>
          )}
        </div>
        <div className="grid gap-4 mt-6">
          {proposedFeatures.map((feature) => (
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
                      variant={feature.isRequired ? 'default' : 'secondary'}
                    >
                      {feature.isRequired ? '必須' : '任意'}
                    </Badge>
                    <Badge variant="outline">{feature.category}</Badge>
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
                    <span>費用目安: {feature.price.toLocaleString()}円</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
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
