'use client'; // Client Component に変更

import type React from 'react';
import type { Skill, SkillCategory } from '~/types/skill'; // 型定義のインポートパスを確認・調整
import SkillItem from './SkillItem'; // 個々のスキル表示コンポーネント

/**
 * スキルデータをカテゴリごとにグループ化するヘルパー関数
 * @param skills - スキルデータの配列
 * @returns カテゴリ名をキー、そのカテゴリに属するスキル配列を値とするオブジェクト
 */
const groupSkillsByCategory = (
  skills: Skill[]
): Partial<Record<SkillCategory, Skill[]>> => {
  return skills.reduce<Partial<Record<SkillCategory, Skill[]>>>(
    (acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category]?.push(skill);
      return acc;
    },
    {}
  );
};

// 表示するカテゴリの順序を定義 (任意)
const categoryOrder: SkillCategory[] = [
  'Language',
  'Framework/Library',
  'Cloud',
  'Database',
  'Infra/Tool',
  'Design',
  'Methodology',
  'Other',
];

interface SkillListByCategoryProps {
  skills: Skill[];
  selectedSkillId: string | null; // 現在選択されているスキルのID
  onSkillSelect: (skill: Skill) => void; // スキル選択時のコールバック
}

/**
 * スキルをカテゴリ別にリスト表示するコンポーネント (Client Component)
 * @param skills - 表示するスキルデータの配列
 * @param selectedSkillId - 現在選択されているスキルのID
 * @param onSkillSelect - スキル選択時に呼び出される関数
 */
const SkillListByCategory: React.FC<SkillListByCategoryProps> = ({
  skills,
  selectedSkillId,
  onSkillSelect,
}) => {
  const groupedSkills = groupSkillsByCategory(skills);

  return (
    <div className="space-y-10">
      {' '}
      {/* カテゴリ間のスペース */}
      {categoryOrder.map((category) => {
        const skillsInCategory = groupedSkills[category];
        // そのカテゴリにスキルが存在しない場合は何も表示しない
        if (!skillsInCategory || skillsInCategory.length === 0) {
          return null;
        }

        return (
          <section key={category}>
            <h3 className="text-xl font-semibold mb-4 capitalize border-l-4 border-primary pl-2">
              {' '}
              {/* カテゴリタイトル */}
              {category.replace('/', ' / ')} {/* Framework/Library を表示 */}
            </h3>
            <div className="space-y-3">
              {' '}
              {/* スキルアイテム間のスペースを少し詰める */}
              {skillsInCategory.map((skill) => (
                <SkillItem
                  key={skill.id}
                  skill={skill}
                  isSelected={skill.id === selectedSkillId} // 選択状態を渡す
                  onSelect={onSkillSelect} // コールバック関数を渡す
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default SkillListByCategory;
