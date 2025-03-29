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
  proposedFeaturesAtom,
  selectedFeatureIdsAtom,
} from '../_atoms/estimate';
import { ProjectTypeStep } from './steps/ProjectTypeStep';
import { DeadlineStep } from './steps/DeadlineStep';
import { DescriptionStep } from './steps/DescriptionStep';
import { AIQuestionsStep } from './steps/AIQuestionsStep';
import { FeatureSelectionStep } from './steps/FeatureSelectionStep';
import { EstimateResultStep } from './steps/EstimateResultStep';
import { ImplementationRequirementsStep } from './steps/ImplementationRequirementsStep';

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
  const [, setAiQuestions] = useAtom(aiQuestionsAtom);
  const [, setProposedFeatures] = useAtom(proposedFeaturesAtom);
  const [, setSelectedFeatureIds] = useAtom(selectedFeatureIdsAtom);

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const step = steps[currentStepIndex];
  if (!step) {
    setCurrentStep('project-type');
    return null;
  }

  const CurrentStepComponent = step.component;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      const nextStep = steps[currentStepIndex + 1] as (typeof steps)[number];
      setCurrentStep(nextStep.id);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      const prevStep = steps[currentStepIndex - 1] as (typeof steps)[number];
      setCurrentStep(prevStep.id);
    }
  };

  const handleReset = () => {
    // 全ての状態をリセット
    setCurrentStep('project-type');
    setFormData({
      projectType: 'web',
      description: '',
      deadline: 'flexible',
      features: [],
      baseCost: 0,
      rushFee: 0,
      totalCost: 0,
    });
    setAiQuestions([]);
    setProposedFeatures([]);
    setSelectedFeatureIds([]);
    // ローカルストレージもクリア
    localStorage.removeItem('estimateFormData');
  };

  useEffect(() => {
    // フォームデータが変更されたときにローカルストレージに保存
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
