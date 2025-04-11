'use server';

import {
  generateEstimationPrompt,
  generateFeaturePrompt,
  generateRequiredFeaturesPrompt,
} from '../../lib/server/gemini';
import { generateGeminiResponse } from '../../lib/server/gemini';
import type { FeatureProposal, EstimateFormData } from '../../types/estimate';

// 内部で使用する型定義
interface GeneratedFeature {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'user' | 'auth' | 'content' | 'payment' | 'other';
  dependencies?: string[];
}

interface RequiredFeatureResult {
  id: string;
  isRequired: boolean;
  reason: string;
}

interface EstimationResult {
  id: string;
  difficulty: number;
  duration: number;
  dailyRate: number;
  price: number;
  difficultyReason: string;
}

interface GenerateFeaturesResult {
  features: FeatureProposal[];
  status: {
    step: number;
    message: string;
    completed: boolean;
  };
}

/**
 * 機能提案を生成する関数
 * @param formData 見積もりフォームデータ
 * @returns 機能提案の結果
 */
export async function generateFeatures(
  formData: EstimateFormData
): Promise<GenerateFeaturesResult> {
  try {
    // 1. 機能の生成
    const prompt = generateFeaturePrompt(formData);
    const response = await generateGeminiResponse(prompt);
    const { features } = JSON.parse(response) as {
      features: GeneratedFeature[];
    };

    // GeneratedFeatureをEstimateTypes.FeatureProposalに変換
    const featureProposals: FeatureProposal[] = features.map((feature) => ({
      ...feature,
      price: 0,
      duration: 0,
      isRequired: false,
    }));

    // 2. 必須機能の判定
    const requiredFeaturesPrompt =
      generateRequiredFeaturesPrompt(featureProposals);
    const requiredFeaturesResponse = await generateGeminiResponse(
      requiredFeaturesPrompt
    );
    const { features: requiredFeatures } = JSON.parse(
      requiredFeaturesResponse
    ) as {
      features: RequiredFeatureResult[];
    };

    // 必須機能の情報を元の機能リストにマージ
    const featuresWithRequired = featureProposals.map((feature) => {
      const requiredFeature = requiredFeatures.find(
        (rf) => rf.id === feature.id
      );
      return {
        ...feature,
        isRequired: requiredFeature?.isRequired || false,
        reason: requiredFeature?.reason,
      };
    });

    // 3. 開発期間と費用の見積もり
    const estimationPrompt = generateEstimationPrompt(featuresWithRequired);
    const estimationResponse = await generateGeminiResponse(estimationPrompt);
    const { features: estimatedFeatures } = JSON.parse(estimationResponse) as {
      features: EstimationResult[];
    };

    // 見積もり情報を機能リストにマージ
    const finalFeatures = featuresWithRequired.map((feature) => {
      const estimatedFeature = estimatedFeatures.find(
        (ef) => ef.id === feature.id
      );
      return {
        ...feature,
        price: estimatedFeature?.price || 0,
        duration: estimatedFeature?.duration || 0,
        difficulty: estimatedFeature?.difficulty,
        difficultyReason: estimatedFeature?.difficultyReason,
        dailyRate: estimatedFeature?.dailyRate,
      };
    });

    return {
      features: finalFeatures,
      status: {
        step: 3,
        message: '機能の生成、必須機能の判定、見積もりが完了しました',
        completed: true,
      },
    };
  } catch (error) {
    console.error('Error generating features:', error);
    return {
      features: [],
      status: {
        step: 0,
        message: `エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
        completed: false,
      },
    };
  }
}
