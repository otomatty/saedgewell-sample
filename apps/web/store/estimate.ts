import { atom } from 'jotai';
import type {
  EstimateFormData,
  AIQuestion,
  FeatureProposal,
} from '../types/estimate';

// フォームの現在のステップ
export const currentStepAtom = atom<number>(0);

// フォームデータ
export const formDataAtom = atom<EstimateFormData>({
  projectType: 'web',
  description: '',
  deadline: 'flexible',
});

// AIからの追加質問
export const aiQuestionsAtom = atom<AIQuestion[]>([]);

// AI質問への回答
export const aiAnswersAtom = atom<Record<string, string | string[]>>({});

// 提案された機能リスト
export const proposedFeaturesAtom = atom<FeatureProposal[]>([]);

// 選択された機能のID
export const selectedFeatureIdsAtom = atom<string[]>([]);
