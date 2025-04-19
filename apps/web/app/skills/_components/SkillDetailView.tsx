'use client'; // Client Component に変更

import type React from 'react';
import type { Skill } from '~/types/skill'; // RelatedLink を削除
import SkillIcon from './SkillIcon';
import SkillUsageDetails from './SkillUsageDetails';
import SkillGrowthChart from './SkillGrowthChart'; // 新しいグラフコンポーネント
import SkillStrengths from './SkillStrengths'; // 新しいコンポーネントをインポート
import SkillRelatedLinks from './SkillRelatedLinks'; // 新しいコンポーネントをインポート
// import Link from 'next/link'; // 不要なインポートを削除
import {
  // BriefcaseBusiness, // 不要なインポートを削除
  // GitBranchPlus, // 不要なインポートを削除
  // Newspaper, // 不要なインポートを削除
  // Award, // 不要なインポートを削除
  // Presentation, // 不要なインポートを削除
  Link2, // これは関連リンクの最後についてるので残す
  // CheckCircle, // SkillStrengths に移動
} from 'lucide-react';
// import { cn } from '@kit/ui/utils'; // SkillRelatedLinks に移動
// import { Card } from '@kit/ui/card'; // SkillStrengths に移動

interface SkillDetailViewProps {
  skill: Skill | null; // 選択されたスキル、または何も選択されていない場合はnull
}

// RelatedLinkIcon ヘルパーコンポーネントを削除 (SkillRelatedLinks.tsx に移動)
// const RelatedLinkIcon: React.FC<{ type: RelatedLink['type'] }> = ({ type }) => {
// ... (削除) ...
// };

/**
 * 選択されたスキルの詳細情報を表示するコンポーネント。
 * @param skill - 表示するスキルデータ、またはnull
 */

const SkillDetailView: React.FC<SkillDetailViewProps> = ({ skill }) => {
  // experiencePeriod の計算は不要になる (scoreUtils で計算されるため)
  // const experiencePeriod = useMemo(() => ... );

  if (!skill) {
    return (
      <div className="p-6 h-full flex items-center justify-center text-muted-foreground bg-muted rounded-lg">
        スキルを選択すると詳細が表示されます。
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-card text-card-foreground h-full shadow-md overflow-y-auto">
      <div className="flex items-center mb-4">
        <SkillIcon
          icon={skill.icon}
          name={skill.name}
          width={40}
          height={40}
          className="mr-3 rounded-lg"
        />
        <h3 className="text-2xl font-bold">{skill.name}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        カテゴリ: {skill.category}
      </p>

      {/* === 成長グラフ === */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">成長曲線 (経験値スコア)</h4>
        <SkillGrowthChart skill={skill} />
      </div>

      {/* 詳細説明 */}
      {skill.description && (
        <div className="mt-6 space-y-1">
          <h4 className="text-lg font-semibold">概要</h4>
          <p className="text-base text-pretty leading-relaxed">
            {skill.description}
          </p>
        </div>
      )}

      {/* === 追加: 利用詳細 === */}
      <SkillUsageDetails skill={skill} />

      {/* 得意な領域 (Strengths) - 新しいコンポーネントを使用 */}
      <SkillStrengths skill={skill} />

      {/* 関連リンク - 新しいコンポーネントを使用 */}
      <SkillRelatedLinks skill={skill} />

      {/* 詳細情報がない場合の表示 (グラフの有無は考慮しない) */}
      {!skill.description &&
        !skill.strengths?.length &&
        !skill.relatedLinks?.length && (
          <p className="mt-6 text-muted-foreground italic">
            詳細情報はありません。
          </p>
        )}
    </div>
  );
};

export default SkillDetailView;
