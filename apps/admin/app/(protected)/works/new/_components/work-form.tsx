'use client'; // フォームの状態管理、インタラクションのため

/**
 * @file 実績作成・編集フォームのメインコンポーネント。
 * @description react-hook-form を利用してフォーム全体の状態を管理し、
 * 各セクション（基本情報、詳細、画像など）のコンポーネントをレンダリングします。
 */

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  workFormSchema,
  type WorkFormProps,
  type WorkFormData,
} from '~/types/works/work-form';
import BasicInfoSection from './basic-info-section';
import DetailsSection from './details-section';
import SaveButton from './save-button';
import ImageManager from '~/components/works/image-manager';
import EditableList from '~/components/works/editable-list';
import MultiSelectCombobox from '~/components/works/multi-select-combobox';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

// TODO: フォームデータの型定義 (Zodスキーマから推論)
// 型定義は types/works/work-form.ts に移動しました

const WorkForm = ({ onSubmit, initialData, isLoading }: WorkFormProps) => {
  // react-hook-form を初期化 (FormProviderでラップ)
  const methods = useForm<WorkFormData>({
    resolver: zodResolver(workFormSchema),
    defaultValues: initialData || {
      status: 'draft',
      title: '',
      slug: '',
      description: '',
      thumbnail_url: '',
      github_url: '',
      website_url: '',
      category: '',
      detail_overview: '',
      detail_role: '',
      detail_period: '',
      detail_team_size: '',
      images: [],
      challenges: [],
      solutions: [],
      responsibilities: [],
      results: [],
      technologies: [],
    },
  });

  // フォーム送信処理をラップ
  const handleFormSubmit = methods.handleSubmit(onSubmit);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* 各セクションコンポーネントを配置 */}
        <BasicInfoSection />
        <DetailsSection />

        {/* --- 画像セクション --- */}
        <section>
          <h2 className="text-xl font-semibold mb-4">画像</h2>
          <ImageManager />
        </section>

        {/* --- 課題セクション --- */}
        <Card>
          <CardHeader>
            <CardTitle>課題</CardTitle>
          </CardHeader>
          <CardContent>
            <EditableList
              control={methods.control}
              name="challenges"
              itemSchema={[
                {
                  name: 'title',
                  label: '課題タイトル',
                  type: 'input',
                  required: true,
                },
                {
                  name: 'description',
                  label: '説明',
                  type: 'textarea',
                  required: true,
                },
              ]}
              addLabel="課題を追加"
              listLabel="プロジェクトで直面した課題"
            />
          </CardContent>
        </Card>

        {/* --- 解決策セクション --- */}
        <Card>
          <CardHeader>
            <CardTitle>解決策</CardTitle>
          </CardHeader>
          <CardContent>
            <EditableList
              control={methods.control}
              name="solutions"
              itemSchema={[
                {
                  name: 'title',
                  label: '解決策タイトル',
                  type: 'input',
                  required: true,
                },
                {
                  name: 'description',
                  label: '説明',
                  type: 'textarea',
                  required: true,
                },
                {
                  name: 'challenge_id',
                  label: '関連する課題',
                  type: 'input',
                  required: false,
                },
              ]}
              addLabel="解決策を追加"
              listLabel="課題に対する解決策"
            />
          </CardContent>
        </Card>

        {/* --- 担当業務セクション --- */}
        <Card>
          <CardHeader>
            <CardTitle>担当業務</CardTitle>
          </CardHeader>
          <CardContent>
            <EditableList
              control={methods.control}
              name="responsibilities"
              itemSchema={[
                {
                  name: 'description',
                  label: '担当業務の内容',
                  type: 'textarea',
                  required: true,
                },
              ]}
              addLabel="担当業務を追加"
              listLabel="プロジェクトでの担当業務"
            />
          </CardContent>
        </Card>

        {/* --- 成果セクション --- */}
        <Card>
          <CardHeader>
            <CardTitle>成果</CardTitle>
          </CardHeader>
          <CardContent>
            <EditableList
              control={methods.control}
              name="results"
              itemSchema={[
                {
                  name: 'description',
                  label: '成果の内容',
                  type: 'textarea',
                  required: true,
                },
              ]}
              addLabel="成果を追加"
              listLabel="プロジェクトで得られた成果"
            />
          </CardContent>
        </Card>

        {/* --- 技術要素セクション --- */}
        <Card>
          <CardHeader>
            <CardTitle>使用技術</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                このプロジェクトで使用した技術やツールを選択してください。
              </p>
              {/* 実際の実装では、技術オプションをAPIから取得する必要があります */}
              <MultiSelectCombobox
                options={[
                  { value: 'react', label: 'React' },
                  { value: 'next', label: 'Next.js' },
                  { value: 'typescript', label: 'TypeScript' },
                  { value: 'tailwind', label: 'Tailwind CSS' },
                  { value: 'supabase', label: 'Supabase' },
                ]}
                selectedValues={methods.watch('technologies') || []}
                onChange={(values) =>
                  methods.setValue('technologies', values, {
                    shouldDirty: true,
                  })
                }
                placeholder="技術を選択..."
                searchPlaceholder="技術を検索..."
                allowCreate={true}
                onCreate={async (inputValue) => {
                  // 実際の実装では、新しい技術をDBに保存するAPIを呼び出す
                  console.log('Create new technology:', inputValue);
                  const newValue = inputValue
                    .toLowerCase()
                    .replace(/\s+/g, '-');
                  return { value: newValue, label: inputValue };
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* 保存ボタン */}
        <SaveButton isLoading={isLoading} />
      </form>
    </FormProvider>
  );
};

export default WorkForm;
