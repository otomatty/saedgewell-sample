import type React from 'react';
import type { Skill } from '~/types/skill';
import {
  // Versions, // 存在しないため削除
  Binary, // 代替アイコン
  Gauge, // 習熟度用アイコン (例)
  Sparkles, // 学習中/興味あり用アイコン (例)
  BookOpenCheck, // 学習中
  Target, // 興味あり
} from 'lucide-react';
import { Badge } from '@kit/ui/badge'; // バッジ表示用 (shadcn/uiなど)

interface SkillUsageDetailsProps {
  skill: Skill;
}

/**
 * スキルの利用状況や習熟度に関する詳細情報を表示するコンポーネント。
 */
const SkillUsageDetails: React.FC<SkillUsageDetailsProps> = ({ skill }) => {
  const hasDetails =
    skill.mainVersions?.length ||
    skill.proficiency ||
    skill.learning?.length ||
    skill.interests?.length;

  if (!hasDetails) {
    return null; // 表示する情報がない場合は何も描画しない
  }

  return (
    <div className="mt-6 space-y-4">
      <h4 className="text-lg font-semibold">利用詳細</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
        {/* 主要利用バージョン */}
        {skill.mainVersions && skill.mainVersions.length > 0 && (
          <div className="flex items-start">
            <Binary className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <div>
              <span className="font-medium text-card-foreground">
                主な利用バージョン:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {skill.mainVersions.map((version) => (
                  <Badge key={version} variant="secondary">
                    {version}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 習熟度/利用頻度 */}
        {skill.proficiency && (
          <div className="flex items-start">
            <Gauge className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <div>
              <span className="font-medium text-card-foreground">
                習熟度/頻度:
              </span>
              <p className="text-muted-foreground mt-1">{skill.proficiency}</p>
            </div>
          </div>
        )}

        {/* 学習中の技術 */}
        {skill.learning && skill.learning.length > 0 && (
          <div className="flex items-start sm:col-span-2">
            {' '}
            {/* 横幅いっぱい使う */}
            <BookOpenCheck className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <div>
              <span className="font-medium text-card-foreground">
                現在学習中:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {skill.learning.map((item) => (
                  <Badge key={item} variant="outline" className="font-normal">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 今後習得したい技術 */}
        {skill.interests && skill.interests.length > 0 && (
          <div className="flex items-start sm:col-span-2">
            {' '}
            {/* 横幅いっぱい使う */}
            <Target className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <div>
              <span className="font-medium text-card-foreground">
                興味/今後習得したい技術:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {skill.interests.map((item) => (
                  <Badge key={item} variant="outline" className="font-normal">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillUsageDetails;
