/**
 * 開始日から現在までの期間を「X年Yヶ月」または「Yヶ月」の形式で計算します。
 * 無効な日付や未来の日付の場合は null を返します。
 * @param startDateString - 開始日 (YYYY-MM-DD 形式の文字列)
 * @returns 計算された期間の文字列、または計算不能な場合は null
 */
export const calculateExperiencePeriod = (
  startDateString: string | undefined | null
): string | null => {
  if (!startDateString) {
    return null;
  }

  const startDate = new Date(startDateString);
  const today = new Date();

  // 無効な日付か、未来の日付の場合は null
  if (Number.isNaN(startDate.getTime()) || startDate > today) {
    console.error('Invalid start date:', startDateString);
    return null;
  }

  const years = today.getFullYear() - startDate.getFullYear();
  const months = today.getMonth() - startDate.getMonth();
  const days = today.getDate() - startDate.getDate();

  let totalMonths = years * 12 + months;

  // 日にちを考慮して月数を調整 (例: 2023-01-31 から 2023-02-01 はまだ1ヶ月経っていない)
  if (days < 0) {
    totalMonths--;
  }

  if (totalMonths < 0) {
    // 開始日から1ヶ月未満の場合など
    return null; // または "1ヶ月未満" など
  }

  const experienceYears = Math.floor(totalMonths / 12);
  const experienceMonths = totalMonths % 12;

  if (experienceYears > 0 && experienceMonths > 0) {
    return `${experienceYears}年${experienceMonths}ヶ月`;
  }
  if (experienceYears > 0 && experienceMonths === 0) {
    return `${experienceYears}年`;
  }
  if (experienceYears === 0 && experienceMonths > 0) {
    return `${experienceMonths}ヶ月`;
  }

  // 0年0ヶ月の場合 (計算上はありえないはずだが念のため)
  return null;
};

/**
 * 開始日から現在までの経過月数を計算します。
 * 無効な日付や未来の日付の場合は 0 を返します。
 * @param startDateString - 開始日 (YYYY-MM-DD 形式の文字列)
 * @returns 経過月数 (数値)、または計算不能な場合は 0
 */
export const calculateExperienceMonths = (
  startDateString: string | undefined | null
): number => {
  if (!startDateString) {
    return 0;
  }

  const startDate = new Date(startDateString);
  const today = new Date();

  if (Number.isNaN(startDate.getTime()) || startDate > today) {
    return 0;
  }

  const years = today.getFullYear() - startDate.getFullYear();
  const months = today.getMonth() - startDate.getMonth();
  const days = today.getDate() - startDate.getDate();

  let totalMonths = years * 12 + months;
  if (days < 0) {
    totalMonths--;
  }

  return totalMonths < 0 ? 0 : totalMonths;
};
