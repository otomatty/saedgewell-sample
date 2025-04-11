'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { Card } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  currentStepAtom,
  formDataAtom,
  aiQuestionsAtom,
  aiAnswersAtom,
  proposedFeaturesAtom,
  selectedFeatureIdsAtom,
  workflowResultAtom,
  workflowRunIdAtom,
  estimationLoadingAtom,
} from '~/store/estimate';
import { executeEstimation } from '~/actions/estimate/executeEstimation';
import type { QuestionAnswer, FeatureProposal } from '~/types/estimate';
import { ProjectTypeStep } from './steps/project-type-step';
import { DeadlineStep } from './steps/deadline-step';
import { DescriptionStep } from './steps/description-step';
import { AIQuestionsStep } from './steps/ai-questions-step';
import { FeatureSelectionStep } from './steps/feature-selection-step';
import { EstimateResultStep } from './steps/estimate-result-step';
import { ImplementationRequirementsStep } from './steps/implementation-requirements-step';

const steps = [
  {
    id: 'project-type',
    title: 'プロジェクトの種類',
    component: ProjectTypeStep,
  },
  {
    id: 'description',
    title: 'プロジェクトの概要',
    component: DescriptionStep,
  },
  {
    id: 'deadline',
    title: '開発期間',
    component: DeadlineStep,
  },
  {
    id: 'ai-questions',
    title: '追加質問',
    component: AIQuestionsStep,
  },
  {
    id: 'feature-selection',
    title: '機能選択',
    component: FeatureSelectionStep,
  },
  {
    id: 'implementation-requirements',
    title: '実装要件',
    component: ImplementationRequirementsStep,
  },
  {
    id: 'estimate-result',
    title: '見積もり結果',
    component: EstimateResultStep,
  },
] as const;

export type StepId = (typeof steps)[number]['id'];

export function EstimateForm() {
  const [currentStep, setCurrentStep] = useAtom<StepId>(currentStepAtom);
  const [formData, setFormData] = useAtom(formDataAtom);
  const [aiQuestions, setAiQuestions] = useAtom(aiQuestionsAtom);
  const [answers, setAnswers] = useAtom(aiAnswersAtom);
  const [, setProposedFeatures] = useAtom(proposedFeaturesAtom);
  const [, setSelectedFeatureIds] = useAtom(selectedFeatureIdsAtom);
  const [, setWorkflowResult] = useAtom(workflowResultAtom);
  const [, setWorkflowRunId] = useAtom(workflowRunIdAtom);
  const [, setEstimationLoading] = useAtom(estimationLoadingAtom);

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const step = steps[currentStepIndex];
  if (!step) {
    setCurrentStep('project-type');
    return null;
  }

  const CurrentStepComponent = step.component;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const executeEstimationWorkflow = async () => {
    const executionId = Math.random().toString(36).substring(2, 9);

    // 送信データを準備
    const answersToSubmit: QuestionAnswer[] = aiQuestions.map((q) => {
      let answer: string | string[] | number | null = null;

      if (q.isAnswered && q.questionId in answers) {
        const value = answers[q.questionId];
        if (value !== undefined) {
          answer = value;
        }
      }

      return {
        questionId: q.questionId,
        isAnswered: q.isAnswered,
        skipped: q.skipped,
        answer: answer,
      };
    });

    try {
      setEstimationLoading(true);

      // リクエストデータを構築
      const requestData = {
        userInput: formData.description,
        projectType: formData.projectType,
        hourlyRates: {
          website: 5000,
          business_system: 6000,
          application: 5500,
          other: 5000,
        },
        similarProjects: [],
        followUpQuestions: aiQuestions.map((q) => ({
          questionId: q.questionId,
          questionText: q.questionText,
          type: q.type,
          options: q.options,
          validationRules: q.validationRules,
        })),
        answers: answersToSubmit,
      };
      // サーバーサイドのアクションを呼び出し
      const result = await executeEstimation(requestData);

      const features: FeatureProposal[] = result.result.breakdown.map(
        (item, index) => ({
          id: `feature-${index}`,
          name: item.feature,
          description: item.reason || '詳細情報なし',
          price: item.cost || 0,
          duration: (item.estimatedHours || 0) * 8,
          isRequired: item.isNecessary,
          category: getCategoryFromFeature(item.feature),
          reason: item.reason || undefined,
          difficulty: getDifficultyFromCost(item.cost),
          dailyRate: Math.round((result.result.usedHourlyRate || 5000) * 8),
        })
      );

      setProposedFeatures(features);

      setFormData((prev) => ({
        ...prev,
        baseCost: result.result.requiredCost,
        totalCost: result.result.grandTotalCost,
      }));
    } catch (error) {
      console.error('見積もり計算失敗:', error);
      alert(
        `見積もり計算に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`
      );
    } finally {
      setEstimationLoading(false);
    }
  };

  const handleNext = async () => {
    if (!isLastStep) {
      if (currentStep === 'ai-questions') {
        const nextStep = steps[currentStepIndex + 1] as (typeof steps)[number];
        setCurrentStep(nextStep.id);

        // 別プロセスとしてワークフロー実行
        executeEstimationWorkflow();
      } else {
        const nextStep = steps[currentStepIndex + 1] as (typeof steps)[number];
        setCurrentStep(nextStep.id);
      }
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      const prevStep = steps[currentStepIndex - 1] as (typeof steps)[number];
      setCurrentStep(prevStep.id);
    }
  };

  const handleReset = () => {
    setCurrentStep('project-type');
    setFormData({
      projectType: 'website',
      description: '',
      deadline: 'flexible',
      features: [],
      baseCost: 0,
      rushFee: 0,
      totalCost: 0,
    });
    setAiQuestions([]);
    setAnswers({});
    setProposedFeatures([]);
    setSelectedFeatureIds([]);
    setWorkflowResult(null);
    setWorkflowRunId(null);
    setEstimationLoading(false);
    localStorage.removeItem('estimateFormData');
  };

  useEffect(() => {
    localStorage.setItem('estimateFormData', JSON.stringify(formData));
  }, [formData]);

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStepIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
          <CurrentStepComponent />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={isFirstStep}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <Button onClick={handleNext} disabled={isLastStep}>
            次へ
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
      <div className="text-center">
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          見積もりを最初からやり直す
        </button>
      </div>
    </div>
  );
}

function getCategoryFromFeature(
  featureName: string
): FeatureProposal['category'] {
  const lowerName = featureName.toLowerCase();
  if (lowerName.includes('ユーザー') || lowerName.includes('user'))
    return 'user';
  if (lowerName.includes('認証') || lowerName.includes('auth')) return 'auth';
  if (lowerName.includes('コンテンツ') || lowerName.includes('content'))
    return 'content';
  if (lowerName.includes('決済') || lowerName.includes('payment'))
    return 'payment';
  if (lowerName.includes('コア') || lowerName.includes('core')) return 'core';
  return 'other';
}

function getDifficultyFromCost(cost: number | null): number {
  if (!cost) return 3;
  if (cost < 50000) return 1;
  if (cost < 100000) return 2;
  if (cost < 200000) return 3;
  if (cost < 400000) return 4;
  return 5;
}
