import type {
  ImplementationRequirements,
  ImplementationCosts,
} from '~/types/estimate';
import {
  IMPLEMENTATION_COST_FACTORS as COSTS,
  IMPLEMENTATION_DURATION_FACTORS as DURATION,
} from './implementationCostFactors';

export function calculateImplementationCosts(
  requirements: ImplementationRequirements
): ImplementationCosts {
  // デザインコストの計算
  const designCost = calculateDesignCost(requirements);

  // アセットコストの計算
  const assetsCost = calculateAssetsCost(requirements);

  // コンテンツコストの計算
  const contentCost = calculateContentCost(requirements);

  // 合計の計算
  const totalAdditionalCost =
    designCost.amount + assetsCost.amount + contentCost.amount;

  // 追加期間の計算
  const additionalDuration =
    designCost.duration + assetsCost.duration + contentCost.duration;

  return {
    designCost,
    assetsCost,
    contentCost,
    totalAdditionalCost,
    additionalDuration,
  };
}

function calculateDesignCost(requirements: ImplementationRequirements) {
  let amount = 0;
  let duration = 0;
  const reasons: string[] = [];

  if (!requirements.hasDesign) {
    // デザインがない場合は新規作成
    amount += COSTS.design.base;
    duration += DURATION.design.creation.base;
    reasons.push('デザイン新規作成');
  } else if (
    requirements.designFormat &&
    requirements.designFormat !== 'none'
  ) {
    // 既存デザインの変換作業
    const factor = COSTS.design.formatFactors[requirements.designFormat];
    const conversionCost = COSTS.design.base * (factor - 1);
    if (conversionCost > 0) {
      amount += conversionCost;
      duration += DURATION.design.conversion;
      reasons.push(`${requirements.designFormat}形式からの変換作業`);
    }
  }

  if (!requirements.hasBrandGuidelines) {
    amount += COSTS.design.brandGuide;
    duration += DURATION.design.brandGuide;
    reasons.push('ブランドガイドライン作成');
  }

  return {
    amount,
    duration,
    reason: reasons.join('、'),
  };
}

function calculateAssetsCost(requirements: ImplementationRequirements) {
  let amount = 0;
  let duration = 0;
  const reasons: string[] = [];

  if (!requirements.hasLogo) {
    amount += COSTS.assets.logo.base;
    duration += DURATION.assets.logo.simple;
    reasons.push('ロゴ制作');
  }

  if (!requirements.hasIcons) {
    amount += COSTS.assets.icons.set;
    duration += DURATION.assets.icons.set;
    reasons.push('アイコンセット制作');
  }

  if (requirements.hasCustomFonts) {
    amount += COSTS.assets.fonts.license;
    reasons.push('カスタムフォントライセンス');
  }

  return {
    amount,
    duration,
    reason: reasons.join('、'),
  };
}

function calculateContentCost(requirements: ImplementationRequirements) {
  let amount = 0;
  let duration = 0;
  const reasons: string[] = [];

  if (!requirements.hasContent) {
    // 仮で5ページ分のコンテンツ作成を想定
    const estimatedPages = 5;
    amount += COSTS.content.writing.base * estimatedPages;
    duration += DURATION.content.writing.perPage * estimatedPages;
    reasons.push(`コンテンツ作成（${estimatedPages}ページ分）`);
  }

  return {
    amount,
    duration,
    reason: reasons.join('、'),
  };
}
