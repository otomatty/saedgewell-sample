'use client'; // ページ全体を Client Component に変更

import type React from 'react'; // useMemo は不要になった
import { useState } from 'react';
import { skillsData } from '~/data/skills';
import type { Skill } from '~/types/skill'; // RelatedLink はここで不要
import SkillListByCategory from './_components/SkillListByCategory';
import SkillDetailView from './_components/SkillDetailView';
// SkillsOverviewChart は不要
// import SkillsOverviewChart from './_components/SkillsOverviewChart';

/**
 * スキルページコンポーネント (Client Component)
 * 選択されたスキルの状態管理と、リスト/詳細ビューのレイアウトを担当します。
 */
const SkillsPage: React.FC = () => {
  // 選択されているスキルを管理するstate
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // スキル選択時のハンドラ
  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Skills Overview</h1>
      <p className="text-muted-foreground mb-8">
        保有スキルとその関連実績の概要です。リストの項目をクリックすると詳細が表示されます。
      </p>

      {/* ページ上部のグラフ表示エリアを削除 */}
      {/* <div className="relative mb-8 h-[350px] ...">
        <SkillsOverviewChart skills={skillsData} />
      </div> */}

      {/* メインコンテンツエリア (リストと詳細) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {' '}
        {/* モバイルでは縦、MD以上で横並び */}
        {/* スキルリスト (左側 or 上部) - 最大幅制限 */}
        <div className="md:col-span-1 max-w-2xl w-full mx-auto md:mx-0">
          {' '}
          {/* col-span-1 で幅を確保しつつ max-w-2xl */}
          <h2 className="text-2xl font-semibold mb-6">Skill List</h2>
          <SkillListByCategory
            skills={skillsData}
            selectedSkillId={selectedSkill?.id ?? null}
            onSkillSelect={handleSkillSelect}
          />
        </div>
        {/* スキル詳細 (右側 or 下部) - 残りの幅を使用 */}
        <div className="md:col-span-2 sticky top-24 h-[calc(100vh-10rem)] overflow-y-auto">
          {' '}
          {/* 右側は sticky で追従、高さを制限してスクロール */}
          <SkillDetailView skill={selectedSkill} />
        </div>
      </div>
    </main>
  );
};

export default SkillsPage;
