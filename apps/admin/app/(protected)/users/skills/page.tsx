import { Suspense } from 'react';
import { skillActions } from '@kit/next/actions';
import { SkillsView } from './_components/skills-view';
import { Skeleton } from '@kit/ui/skeleton';
import { PageHeader } from '@kit/ui/page-header';
import type { z } from 'zod';
import type { formSchema } from './_components/skills/dialog/skill-form';
import type { SkillCreateData } from './_components/skills/dialog/form/use-skill-form';
import type { Skill } from '@kit/types/skills';

export const metadata = {
  title: 'スキル管理',
  description: 'スキル情報の管理を行います。',
};

type FormData = z.infer<typeof formSchema>;

/**
 * サーバーコンポーネントでスキルを削除するための関数
 */
async function deleteSkill(skillId: string) {
  'use server';
  return skillActions.deleteSkill(skillId);
}

/**
 * サーバーコンポーネントでスキルを作成するための関数
 */
async function createSkill(values: FormData) {
  'use server';
  // FormDataの型とAPIの型の不一致を解決
  const apiInput = {
    ...values,
    // Date型をISO文字列に変換
    started_at: values.started_at.toISOString(),
  };
  await skillActions.createSkill(apiInput);
}

/**
 * Server Actionとして直接データを受け取りスキルを作成する関数
 */
async function createSkillAction(data: SkillCreateData): Promise<Skill> {
  'use server';
  return skillActions.createSkill(data);
}

/**
 * スキル管理ページ
 * @returns {Promise<JSX.Element>}
 */
export default async function SkillsPage() {
  // Server Actionsを使用してデータを取得
  const [skills, categories] = await Promise.all([
    skillActions.getSkills(),
    skillActions.getSkillCategories(),
  ]);

  return (
    <>
      <PageHeader title="スキル管理" />
      <div className="container mx-auto py-10">
        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          <SkillsView
            initialSkills={skills}
            initialCategories={categories}
            onDeleteSkill={deleteSkill}
            onCreateSkill={createSkill}
            onCreateSkillAction={createSkillAction}
          />
        </Suspense>
      </div>
    </>
  );
}
