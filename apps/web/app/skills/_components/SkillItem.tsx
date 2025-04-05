'use client'; // Client Component に変更

import type React from 'react'; // useMemo をインポート
import { useMemo } from 'react';
import type { Skill } from '~/types/skill'; // 型定義のインポートパスを確認・調整
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@kit/ui/tooltip';
import {
  BriefcaseBusiness,
  GitBranchPlus,
  Newspaper,
  Clock,
  Award,
} from 'lucide-react';
import SkillIcon from './SkillIcon';
import { cn } from '@kit/ui/utils'; // classNameを結合するためのユーティリティ (shadcn/ui に含まれる)
import { calculateExperiencePeriod } from '~/utils/dateUtils'; // ユーティリティ関数をインポート (パスを確認・調整)

interface SkillItemProps {
  skill: Skill;
  onSelect: (skill: Skill) => void; // スキル選択時のコールバック関数
  isSelected: boolean; // このアイテムが選択されているかどうかのフラグ
}

/**
 * 個々のスキル情報を表示するコンポーネント (Client Component)
 * クリック時に親コンポーネントに選択されたスキルを通知します。
 * @param skill - 表示するスキルデータ
 * @param onSelect - スキル選択時に呼び出される関数
 * @param isSelected - このスキルが現在選択されているか
 */
const SkillItem: React.FC<SkillItemProps> = ({
  skill,
  onSelect,
  isSelected,
}) => {
  const handleClick = () => {
    onSelect(skill);
  };

  // 経験期間を計算し、メモ化する
  const experiencePeriod = useMemo(
    () => calculateExperiencePeriod(skill.startDate),
    [skill.startDate]
  ); // startDate が変わらない限り再計算しない

  return (
    <TooltipProvider delayDuration={200}>
      <button
        type="button"
        className={cn(
          'flex w-full items-start p-4 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-left',
          isSelected
            ? 'bg-primary/10 border-primary ring-1 ring-primary'
            : 'bg-card',
          'hover:bg-muted/50'
        )}
        onClick={handleClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      >
        <div className="flex-shrink-0 mr-4 mt-1">
          <SkillIcon
            icon={skill.icon}
            name={skill.name}
            width={32}
            height={32}
            className="rounded-md"
          />
        </div>

        <div className="flex-grow">
          <h4 className="text-lg font-semibold mb-1 text-card-foreground">
            {skill.name}
          </h4>
          {/* 各種指標 (Tooltipは表示したままにする) */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {/* 経験期間を表示 */}
            {experiencePeriod && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> {experiencePeriod}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>業務経験期間 (開始日: {skill.startDate})</p>
                </TooltipContent>
              </Tooltip>
            )}
            {/* 関連プロジェクト数 */}
            {skill.projectCount && skill.projectCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center">
                    <BriefcaseBusiness className="w-4 h-4 mr-1" />{' '}
                    {skill.projectCount} Projects
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>関連プロジェクト数 ({skill.name} を使用)</p>
                </TooltipContent>
              </Tooltip>
            )}
            {/* 関連リポジトリ数 */}
            {skill.repositoryCount && skill.repositoryCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center">
                    <GitBranchPlus className="w-4 h-4 mr-1" />{' '}
                    {skill.repositoryCount} Repos
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>公開リポジトリ数 ({skill.name} 関連)</p>
                </TooltipContent>
              </Tooltip>
            )}
            {/* 関連技術記事数 */}
            {skill.articleCount && skill.articleCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center">
                    <Newspaper className="w-4 h-4 mr-1" /> {skill.articleCount}{' '}
                    Articles
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>技術記事数 ({skill.name} 関連)</p>
                </TooltipContent>
              </Tooltip>
            )}
            {/* 資格 */}
            {skill.certificates && skill.certificates.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />{' '}
                    {skill.certificates.join(', ')}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>関連資格</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </button>
    </TooltipProvider>
  );
};

export default SkillItem;
