'use client'; // フォームの状態管理、インタラクションのため

/**
 * @file 実績作成・編集フォームのメインコンポーネント。
 * @description react-hook-form を利用してフォーム全体の状態を管理し、
 * 各セクション（基本情報、詳細、画像など）のコンポーネントをレンダリングします。
 */

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
import { WorkQualityScore } from '~/components/works/work-quality-score';
import { AiFabMenu, type AiActionType } from '~/components/ai/ai-fab-menu';
import {
  AiProgressModal,
  type AiProgressStep,
} from '~/components/ai/ai-progress-modal';
import { generateWorkFromGithub } from '~/actions/ai/generate-work-from-github';
import { generateWorkFromTitle } from '~/actions/ai/generate-work-from-title';
import { generateWorkSuggestions } from '~/actions/ai/generate-work-suggestions';
import { generateChallengeSolutions } from '~/actions/ai/generate-challenge-solutions';
import type {
  GeneratedWorkContent,
  WorkSuggestion,
  ChallengeSolutionResponse,
} from '~/types/ai';

// TODO: フォームデータの型定義 (Zodスキーマから推論)
// 型定義は types/works/work-form.ts に移動しました

// カスタムイベント名の定義
export const AI_EVENTS = {
  GENERATE_FROM_TITLE: 'ai:generate-from-title',
  UPDATE_PROGRESS: 'ai:update-progress',
};

// カスタムイベント型定義
interface AiProgressEvent extends CustomEvent {
  detail: {
    steps: Array<{
      label: string;
      status: 'pending' | 'processing' | 'completed' | 'error';
    }>;
    title?: string;
    error?: string | null;
    isCompleted?: boolean;
  };
}

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

  // AI関連のstate管理
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiProgressSteps, setAiProgressSteps] = useState<AiProgressStep[]>([]);
  const [aiModalTitle, setAiModalTitle] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // フォーム送信処理をラップ
  const handleFormSubmit = methods.handleSubmit(onSubmit);

  // FABからのイベントを監視
  useEffect(() => {
    // タイトルから生成するイベントのリスナー
    const handleGenerateFromTitle = () => {
      // ここでメソッドを直接呼び出し
      const title = methods.getValues('title');

      if (!title?.trim()) {
        toast.error('タイトルを入力してください');
        return;
      }

      setIsAiProcessing(true);

      try {
        // 進捗状況を更新するヘルパー関数
        const updateProgress = (
          steps: Array<{
            label: string;
            status: 'pending' | 'processing' | 'completed' | 'error';
          }>,
          title?: string,
          error?: string | null,
          isCompleted?: boolean
        ) => {
          const event = new CustomEvent(AI_EVENTS.UPDATE_PROGRESS, {
            detail: { steps, title, error, isCompleted },
          });
          window.dispatchEvent(event);
        };

        // 進捗ステップを初期化
        updateProgress(
          [
            { label: 'タイトル情報を分析中...', status: 'processing' },
            { label: 'プロジェクトの背景・目的を推測中...', status: 'pending' },
            { label: '技術スタックを想定中...', status: 'pending' },
            { label: 'プロジェクト詳細を生成中...', status: 'pending' },
            { label: '課題と解決策を考案中...', status: 'pending' },
          ],
          'タイトルから実績内容を生成中...'
        );

        // ステップ1完了
        setTimeout(() => {
          updateProgress(
            [
              { label: 'タイトル情報を分析中...', status: 'completed' },
              {
                label: 'プロジェクトの背景・目的を推測中...',
                status: 'processing',
              },
              { label: '技術スタックを想定中...', status: 'pending' },
              { label: 'プロジェクト詳細を生成中...', status: 'pending' },
              { label: '課題と解決策を考案中...', status: 'pending' },
            ],
            'タイトルから実績内容を生成中...'
          );
        }, 1000);

        // Server Actionを呼び出し（実際の生成処理）
        generateWorkFromTitle(title)
          .then((result) => {
            // ステップ2完了
            updateProgress(
              [
                { label: 'タイトル情報を分析中...', status: 'completed' },
                {
                  label: 'プロジェクトの背景・目的を推測中...',
                  status: 'completed',
                },
                { label: '技術スタックを想定中...', status: 'processing' },
                { label: 'プロジェクト詳細を生成中...', status: 'pending' },
                { label: '課題と解決策を考案中...', status: 'pending' },
              ],
              'タイトルから実績内容を生成中...'
            );

            // 少し遅延させる（UI演出のため）
            setTimeout(() => {
              // ステップ3完了
              updateProgress(
                [
                  { label: 'タイトル情報を分析中...', status: 'completed' },
                  {
                    label: 'プロジェクトの背景・目的を推測中...',
                    status: 'completed',
                  },
                  { label: '技術スタックを想定中...', status: 'completed' },
                  {
                    label: 'プロジェクト詳細を生成中...',
                    status: 'processing',
                  },
                  { label: '課題と解決策を考案中...', status: 'pending' },
                ],
                'タイトルから実績内容を生成中...'
              );

              setTimeout(() => {
                // ステップ4完了
                updateProgress(
                  [
                    { label: 'タイトル情報を分析中...', status: 'completed' },
                    {
                      label: 'プロジェクトの背景・目的を推測中...',
                      status: 'completed',
                    },
                    { label: '技術スタックを想定中...', status: 'completed' },
                    {
                      label: 'プロジェクト詳細を生成中...',
                      status: 'completed',
                    },
                    { label: '課題と解決策を考案中...', status: 'processing' },
                  ],
                  'タイトルから実績内容を生成中...'
                );

                setTimeout(() => {
                  // 最終ステップ完了
                  updateProgress(
                    [
                      { label: 'タイトル情報を分析中...', status: 'completed' },
                      {
                        label: 'プロジェクトの背景・目的を推測中...',
                        status: 'completed',
                      },
                      { label: '技術スタックを想定中...', status: 'completed' },
                      {
                        label: 'プロジェクト詳細を生成中...',
                        status: 'completed',
                      },
                      { label: '課題と解決策を考案中...', status: 'completed' },
                    ],
                    '実績内容の生成が完了しました',
                    null,
                    true
                  );

                  // 生成結果をフォームに適用
                  applyGeneratedContent(result, false); // false = タイトルも含めて更新
                  setIsAiProcessing(false);
                }, 800);
              }, 800);
            }, 800);
          })
          .catch((error) => {
            console.error('タイトルからの生成でエラー:', error);
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'タイトルからの実績内容生成に失敗しました';

            // エラー状態を通知
            const event = new CustomEvent(AI_EVENTS.UPDATE_PROGRESS, {
              detail: {
                steps: [
                  { label: 'タイトル情報を分析中...', status: 'error' },
                  {
                    label: 'プロジェクトの背景・目的を推測中...',
                    status: 'pending',
                  },
                  { label: '技術スタックを想定中...', status: 'pending' },
                  { label: 'プロジェクト詳細を生成中...', status: 'pending' },
                  { label: '課題と解決策を考案中...', status: 'pending' },
                ],
                title: 'エラーが発生しました',
                error: errorMessage,
              },
            });
            window.dispatchEvent(event);

            toast.error(`AI処理エラー: ${errorMessage}`);
            setIsAiProcessing(false);
          });
      } catch (error) {
        console.error('タイトルからの生成でエラー:', error);
        setIsAiProcessing(false);
      }
    };

    // イベントリスナーを登録
    window.addEventListener(
      AI_EVENTS.GENERATE_FROM_TITLE,
      handleGenerateFromTitle
    );

    // クリーンアップ関数
    return () => {
      window.removeEventListener(
        AI_EVENTS.GENERATE_FROM_TITLE,
        handleGenerateFromTitle
      );
    };
  }, [methods]); // methods は安定していると仮定

  // AIアクションのハンドラー
  const handleAiAction = async (action: AiActionType) => {
    const formData = methods.getValues();
    setAiError(null);
    setIsAiProcessing(true);
    setIsAiModalOpen(true);

    const baseSteps: AiProgressStep[] = [
      { label: 'AIモデルの準備中...', status: 'processing' },
      { label: '入力情報の分析中...', status: 'pending' },
      { label: 'コンテンツ生成中...', status: 'pending' },
      { label: '結果の整形中...', status: 'pending' },
    ];
    setAiProgressSteps(baseSteps);

    try {
      let result:
        | GeneratedWorkContent
        | WorkSuggestion[]
        | ChallengeSolutionResponse
        | null = null;

      switch (action) {
        case 'github': {
          setAiModalTitle('GitHubリポジトリから実績内容を生成中...');
          const githubUrl = formData.github_url;
          if (!githubUrl?.trim()) {
            throw new Error('GitHubリポジトリのURLを入力してください。');
          }
          result = await generateWorkFromGithub(githubUrl);
          applyGeneratedContent(result as GeneratedWorkContent);
          break;
        }
        case 'title': {
          setAiModalTitle('タイトルから実績内容を生成中...');
          const title = formData.title;
          if (!title?.trim()) {
            throw new Error('プロジェクトのタイトルを入力してください。');
          }
          result = await generateWorkFromTitle(title);
          applyGeneratedContent(result as GeneratedWorkContent, true); // タイトル以外を適用
          break;
        }
        case 'suggestion': {
          setAiModalTitle('入力内容の改善案を生成中...');
          result = await generateWorkSuggestions(formData);
          // TODO: 改善提案の表示・適用ロジックを実装
          console.log('改善提案:', result); // 結果をコンソールに出力
          toast.info(
            '改善提案機能は現在開発中です。（結果はコンソールを確認）'
          );
          break;
        }
        case 'challenge_solution': {
          setAiModalTitle('課題と解決策を生成中...');
          const description = formData.description;
          const technologies = formData.technologies || [];
          const challenges = formData.challenges || [];
          if (!description?.trim()) {
            throw new Error('プロジェクトの説明を入力してください。');
          }
          result = await generateChallengeSolutions({
            description,
            technologies: technologies.map((t) => ({ value: t, label: t })),
            existingChallenges: challenges,
          });
          applyChallengeSolutions(
            result.challenges || [],
            result.solutions || []
          );
          break;
        }
        default: {
          const exhaustiveCheck: never = action;
          throw new Error(`不明なAIアクションです: ${exhaustiveCheck}`);
        }
      }

      // 完了状態に更新
      setAiProgressSteps((prev) =>
        prev.map((step) => ({
          ...step,
          status: step.status === 'processing' ? 'completed' : step.status,
        }))
      );
      setTimeout(() => {
        // 少し遅れて完了ステップを表示
        setAiProgressSteps((prev) =>
          prev.map((step) => ({ ...step, status: 'completed' }))
        );
      }, 500);
      toast.success('AIによる生成が完了しました！');
    } catch (error) {
      console.error('AI処理エラー:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'AI処理中に不明なエラーが発生しました。';
      setAiError(errorMessage);
      setAiProgressSteps((prev) =>
        prev.map((step) => ({
          ...step,
          status:
            step.status === 'processing'
              ? 'error'
              : step.status === 'pending'
                ? 'pending'
                : 'completed',
        }))
      );
      toast.error(`AI処理エラー: ${errorMessage}`);
    } finally {
      setIsAiProcessing(false);
      // モーダルはエラーか完了後に閉じるようにする（すぐには閉じない）
      // setIsAiModalOpen(false);
    }
  };

  // 生成されたコンテンツをフォームに適用
  const applyGeneratedContent = (
    content: GeneratedWorkContent,
    skipTitle = false
  ) => {
    if (!skipTitle)
      methods.setValue('title', content.title || '', { shouldDirty: true });
    methods.setValue('description', content.description || '', {
      shouldDirty: true,
    });
    methods.setValue('detail_overview', content.detail_overview || '', {
      shouldDirty: true,
    });
    methods.setValue('detail_role', content.detail_role || '', {
      shouldDirty: true,
    });
    methods.setValue('detail_period', content.detail_period || '', {
      shouldDirty: true,
    });
    methods.setValue('detail_team_size', content.detail_team_size || '', {
      shouldDirty: true,
    });
    methods.setValue(
      'technologies',
      content.technologies?.map((t) => t.value) || [],
      { shouldDirty: true }
    );
    methods.setValue('challenges', content.challenges || [], {
      shouldDirty: true,
    });
    methods.setValue('solutions', content.solutions || [], {
      shouldDirty: true,
    });

    // 新しく追加したフィールドも適用
    if (content.responsibilities && content.responsibilities.length > 0) {
      // フォーマットを変換: string[] → {description: string}[]
      const formattedResponsibilities = content.responsibilities.map(
        (resp) => ({ description: resp })
      );
      methods.setValue('responsibilities', formattedResponsibilities, {
        shouldDirty: true,
      });
    }

    if (content.results && content.results.length > 0) {
      // フォーマットを変換: string[] → {description: string}[]
      const formattedResults = content.results.map((result) => ({
        description: result,
      }));
      methods.setValue('results', formattedResults, {
        shouldDirty: true,
      });
    }

    toast.success('生成された内容をフォームに反映しました。');
  };

  // 生成された課題と解決策をフォームに追加（既存の内容は維持）
  const applyChallengeSolutions = (
    newChallenges: WorkFormData['challenges'],
    newSolutions: WorkFormData['solutions']
  ) => {
    const currentChallenges = methods.getValues('challenges') || [];
    const currentSolutions = methods.getValues('solutions') || [];
    // 型を明示的に指定
    methods.setValue(
      'challenges',
      [...currentChallenges, ...newChallenges] as WorkFormData['challenges'],
      { shouldDirty: true }
    );
    methods.setValue(
      'solutions',
      [...currentSolutions, ...newSolutions] as WorkFormData['solutions'],
      { shouldDirty: true }
    );
    toast.success('生成された課題と解決策をフォームに追加しました。');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className="space-y-8 relative pb-20">
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
            <div className="space-y-4">
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
            </div>
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

        {/* 品質スコア */}
        <WorkQualityScore />

        {/* 保存ボタン */}
        <SaveButton isLoading={isLoading || isAiProcessing} />

        {/* AI FABメニュー (削除) */}
        {/* <AiFabMenu onActionSelect={handleAiAction} disabled={isAiProcessing} /> */}

        {/* AI進捗モーダル (削除) */}
        {/* <AiProgressModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          title={aiModalTitle}
          steps={aiProgressSteps}
          error={aiError}
          onCancel={() => {
            // TODO: サーバー側でのキャンセル処理を実装する場合はここに追加
            setIsAiProcessing(false);
            setIsAiModalOpen(false);
            toast.info('AI処理をキャンセルしました。');
          }}
        /> */}
      </form>
    </FormProvider>
  );
};

export default WorkForm;
