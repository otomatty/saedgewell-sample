import {
  DEADLINE_TO_DAYS,
  RUSH_FEE_RATES,
  type RushFeeCalculation,
  type Deadline,
} from '~/types/estimate';

export function calculateRushFee(
  basePrice: number,
  estimatedDays: number,
  deadline: Deadline
): RushFeeCalculation {
  // 柔軟な場合は追加料金なし
  if (deadline === 'flexible') {
    return {
      basePrice,
      rushFee: 0,
      totalPrice: basePrice,
      divergenceRate: 0,
      appliedRate: 0,
      reason: '柔軟な開発期間のため、追加料金はありません。',
    };
  }

  const desiredDays = DEADLINE_TO_DAYS[deadline];
  const divergenceRate = (desiredDays - estimatedDays) / estimatedDays;

  // 希望期間の方が長い場合は追加料金なし
  if (divergenceRate >= 0) {
    return {
      basePrice,
      rushFee: 0,
      totalPrice: basePrice,
      divergenceRate,
      appliedRate: 0,
      reason: '希望開発期間が想定開発期間より長いため、追加料金はありません。',
    };
  }

  // 乖離率に応じて割増率を決定
  let appliedRate = 0;
  let reason = '';
  let isTimelineDangerous = false;

  if (divergenceRate <= -0.6) {
    appliedRate = RUSH_FEE_RATES.critical;
    reason =
      '希望開発期間が想定開発期間の40%以下です。特急料金をいただいてもご希望の開発期間に添えない可能性が高いため、開発期間の見直しをお願いいたします。';
    isTimelineDangerous = true;
  } else if (divergenceRate <= -0.5) {
    appliedRate = RUSH_FEE_RATES.critical;
    reason =
      '希望開発期間が想定開発期間の半分以下のため、50%の特急料金が発生します。';
  } else if (divergenceRate <= -0.3) {
    appliedRate = RUSH_FEE_RATES.high;
    reason =
      '希望開発期間が想定開発期間より大幅に短いため、30%の特急料金が発生します。';
  } else if (divergenceRate <= -0.2) {
    appliedRate = RUSH_FEE_RATES.medium;
    reason =
      '希望開発期間が想定開発期間より短いため、20%の特急料金が発生します。';
  } else if (divergenceRate <= -0.1) {
    appliedRate = RUSH_FEE_RATES.low;
    reason =
      '希望開発期間が想定開発期間よりやや短いため、10%の特急料金が発生します。';
  }

  const rushFee = Math.floor(basePrice * appliedRate);
  const totalPrice = basePrice + rushFee;

  return {
    basePrice,
    rushFee,
    totalPrice,
    divergenceRate,
    appliedRate,
    reason,
    isTimelineDangerous,
  };
}
