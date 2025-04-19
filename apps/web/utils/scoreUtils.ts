import type { Skill, SkillEvent } from '~/types/skill';

/** 重み付け設定 (月数を除外) */
export const SCORE_WEIGHTS = {
  learning_start: 0,
  project: 10,
  repository: 3,
  article: 5,
  certificate: 20,
  slides: 8,
  contribution: 15,
  other: 1,
} satisfies Record<SkillEvent['type'], number>;

/**
 * 指定された日付時点でのスキル経験値スコアを計算します。
 * (月数加算を除いたイベントベースのスコア)
 */
export const calculateScoreAtDate = (
  skill: Skill,
  targetDate: Date,
  weights: typeof SCORE_WEIGHTS
): number => {
  let score = 0;

  // 基準日までのイベントを集計
  if (skill.events) {
    for (const event of skill.events) {
      const eventDate = new Date(event.date);
      if (
        !Number.isNaN(eventDate.getTime()) &&
        eventDate <= targetDate
        // learning_start はスコアに加算しないので条件不要
      ) {
        // learning_start 以外のイベントタイプに重みを適用
        if (event.type !== 'learning_start') {
          score += weights[event.type as keyof typeof weights] ?? weights.other;
        }
      }
    }
  }

  return Math.round(score);
};

/**
 * スキルの経験値スコアの時系列データを計算します。
 */
export const calculateScoreTimeline = (
  skill: Skill,
  weights: typeof SCORE_WEIGHTS,
  monthsToTrace = 36,
  intervalMonths = 1
): { date: string; score: number }[] => {
  const timeline: { date: string; score: number }[] = [];
  const today = new Date();
  today.setDate(1);

  // スキルの実際の開始日を取得 (learning_startイベント優先)
  const learningStartEvent = skill.events?.find(
    (e: SkillEvent) => e.type === 'learning_start'
  );
  const startDateString = learningStartEvent?.date ?? skill.startDate;
  const skillStartDate = startDateString ? new Date(startDateString) : null;

  for (let i = 0; i <= monthsToTrace; i += intervalMonths) {
    const targetDate = new Date(today);
    targetDate.setMonth(today.getMonth() - i);

    // スキルの開始日より前の日付はスコア0とする
    if (
      skillStartDate &&
      !Number.isNaN(skillStartDate.getTime()) &&
      targetDate < skillStartDate
    ) {
      timeline.push({
        date: `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`,
        score: 0,
      });
      continue;
    }

    const score = calculateScoreAtDate(skill, targetDate, weights);
    timeline.push({
      date: `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`,
      score: score,
    });
  }

  // 日付昇順に並び替えて返す
  return timeline.reverse();
};
