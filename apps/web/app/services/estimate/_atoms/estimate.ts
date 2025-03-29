import { atom } from 'jotai';
import type {
  AIQuestion,
  EstimateFormData,
  FeatureProposal,
} from '../_types/estimate';
import type { StepId } from '../_components/EstimateForm';

// 現在のステップを管理するatom
export const currentStepAtom = atom<StepId>('project-type');

// フォームデータを管理するatom
export const formDataAtom = atom<EstimateFormData>({
  projectType: 'web',
  description: '',
  deadline: 'flexible',
  features: [],
  baseCost: 0,
  rushFee: 0,
  totalCost: 0,
});

// AIが生成した質問を管理するatom
export const aiQuestionsAtom = atom<AIQuestion[]>([]);

// AIが提案した機能を管理するatom
export const proposedFeaturesAtom = atom<FeatureProposal[]>([]);

// 選択された機能のIDを管理するatom
export const selectedFeatureIdsAtom = atom<string[]>([]);
