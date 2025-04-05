'use client';

import { useHydrateAtoms } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { skillsAtom, categoriesAtom } from '~/store/skills';
import type { Skill, SkillCategory } from '@kit/types/skills';
import { DataTable } from '@kit/ui/data-table';
import { createSkillColumns } from './skills/table/columns';
import { categoryColumns } from './categories/table/columns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { toast } from 'sonner';
import type { z } from 'zod';
import type { formSchema } from './skills/dialog/skill-form';
import { CreateSkillDialog } from './skills/dialog/create-skill-dialog';
import type { SkillCreateData } from './skills/dialog/form/use-skill-form';

type FormData = z.infer<typeof formSchema>;

interface SkillsViewProps {
  initialSkills: Skill[];
  initialCategories: SkillCategory[];
  // サーバーアクションを関数としてpropsで受け取る
  onDeleteSkill: (skillId: string) => Promise<void>;
  onCreateSkill?: (values: FormData) => Promise<void>;
  // 型付きのServer Actionを追加
  onCreateSkillAction?: (data: SkillCreateData) => Promise<Skill>;
}

/**
 * スキル管理ページのコンテンツ
 * - Tabsを使用してスキル一覧とカテゴリー一覧を表示
 * - useHydrateAtomsを使用して初期データをatomにhydrate
 * @param {SkillsViewProps} props
 * @returns {JSX.Element}
 */
export function SkillsView({
  initialSkills,
  initialCategories,
  onDeleteSkill,
  onCreateSkill,
  onCreateSkillAction,
}: SkillsViewProps) {
  // 初期データをatomにhydrate
  useHydrateAtoms([
    [skillsAtom, initialSkills],
    [categoriesAtom, initialCategories],
  ]);

  const skills = useAtomValue(skillsAtom);
  const categories = useAtomValue(categoriesAtom);

  // columnsを動的に生成
  const skillColumns = createSkillColumns({ onDeleteSkill });

  const handleCreateSkill = async (values: FormData) => {
    try {
      if (onCreateSkill) {
        await onCreateSkill(values);
      } else {
        // TODO: スキル作成のServer Actionを呼び出す
        console.log('Create skill:', values);
      }

      // 成功時の処理
      toast.success('スキルを追加しました', {
        description: '新しいスキルが正常に追加されました。',
      });
    } catch (error) {
      console.error('Failed to create skill:', error);
      toast.error('スキルの追加に失敗しました', {
        description:
          error instanceof Error ? error.message : 'スキルの追加に失敗しました',
      });
    }
  };

  return (
    <Tabs defaultValue="skills" className="space-y-4">
      <TabsList>
        <TabsTrigger value="skills">スキル一覧</TabsTrigger>
        <TabsTrigger value="categories">カテゴリー一覧</TabsTrigger>
      </TabsList>
      <TabsContent value="skills">
        <div className="space-y-4">
          <DataTable
            columns={skillColumns}
            data={skills}
            create={{
              content: (
                <CreateSkillDialog
                  categories={categories}
                  onSubmit={handleCreateSkill}
                  onCreateSkill={onCreateSkillAction}
                />
              ),
            }}
          />
        </div>
      </TabsContent>
      <TabsContent value="categories">
        <div className="space-y-4">
          <DataTable columns={categoryColumns} data={categories} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
