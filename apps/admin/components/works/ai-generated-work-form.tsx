'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Wand2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { generateWorkFromGithub } from '~/actions/ai/generate-work-from-github';
import { generateWorkFromTitle } from '~/actions/ai/generate-work-from-title';
import { generateWorkSuggestions } from '~/actions/ai/generate-work-suggestions';
import type { GeneratedWorkContent, WorkSuggestion } from '~/types/ai';
import type { WorkFormData } from '~/types/works/work-form';
import { AiSuggestionsList } from './ai-suggestions-list';

/**
 * AI生成機能を提供するフォームセクション
 * ユーザーはGitHub、タイトル、または入力内容からAIの支援を受けることができる
 */
export function AIGeneratedWorkForm() {
  const { setValue, getValues } = useFormContext<WorkFormData>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('github');
  const [suggestions, setSuggestions] = useState<WorkSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // GitHubリポジトリURLから実績内容を生成
  const generateFromGithub = async () => {
    const githubUrl = getValues('github_url');
    if (!githubUrl) {
      toast.error('GitHubリポジトリURLを入力してください');
      return;
    }

    try {
      setIsGenerating(true);
      const generatedWork = await generateWorkFromGithub(githubUrl);
      applyGeneratedContent(generatedWork);

      toast.success('実績内容を生成しました', {
        description: '生成された内容を確認し、必要に応じて編集してください。',
      });
    } catch (error) {
      console.error('実績内容の生成に失敗しました:', error);
      toast.error('実績内容の生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // タイトルから実績内容のアイデアを生成
  const generateFromTitle = async () => {
    const title = getValues('title');
    if (!title) {
      toast.error('タイトルを入力してください');
      return;
    }

    try {
      setIsGenerating(true);
      const generatedWork = await generateWorkFromTitle(title);
      applyGeneratedContent(generatedWork);

      toast.success('実績内容を生成しました');
    } catch (error) {
      console.error('実績内容の生成に失敗しました:', error);
      toast.error('実績内容の生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // 入力済みの内容から改善提案を生成
  const generateSuggestions = async () => {
    const currentValues = getValues();

    try {
      setIsGenerating(true);
      const result = await generateWorkSuggestions(currentValues);
      setSuggestions(result);
      setShowSuggestions(true);

      if (result.length === 0) {
        toast.info('改善提案はありませんでした');
      } else {
        toast.success(`${result.length}件の改善提案を生成しました`);
      }
    } catch (error) {
      console.error('改善提案の生成に失敗しました:', error);
      toast.error('改善提案の生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // 生成されたコンテンツをフォームに適用する
  const applyGeneratedContent = (content: GeneratedWorkContent) => {
    // フォームに生成した値をセット
    for (const [key, value] of Object.entries(content)) {
      if (value !== undefined) {
        setValue(key as keyof WorkFormData, value, { shouldDirty: true });
      }
    }
  };

  // 提案を適用する
  const applySuggestion = (suggestion: WorkSuggestion) => {
    setValue(suggestion.field, suggestion.suggestion, { shouldDirty: true });
    toast.success('提案を適用しました');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI支援機能</CardTitle>
          <CardDescription>
            AIを活用して実績内容の作成を支援します。情報源を選択して生成ボタンをクリックしてください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="github">GitHubから生成</TabsTrigger>
              <TabsTrigger value="title">タイトルから生成</TabsTrigger>
              <TabsTrigger value="improve">入力内容の改善</TabsTrigger>
            </TabsList>

            <TabsContent value="github" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                選択したGitHubリポジトリの情報を元に、実績内容を自動生成します。
                プロジェクトの概要、技術スタック、課題と解決策などを含む内容が提案されます。
              </p>
              <Button
                onClick={generateFromGithub}
                disabled={isGenerating}
                className="w-full"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? '生成中...' : 'GitHubから実績を生成'}
              </Button>
            </TabsContent>

            <TabsContent value="title" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                入力されたタイトルをもとに、実績内容のアイデアを生成します。
                プロジェクトがどのようなものか、想定される課題や技術などを提案します。
              </p>
              <Button
                onClick={generateFromTitle}
                disabled={isGenerating}
                className="w-full"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? '生成中...' : 'タイトルから実績を生成'}
              </Button>
            </TabsContent>

            <TabsContent value="improve" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                現在入力されている内容をAIが分析し、より魅力的な表現や追加すべき情報を提案します。
                文章の改善、新たな視点の追加、技術的な詳細の充実などを支援します。
              </p>
              <Button
                onClick={generateSuggestions}
                disabled={isGenerating}
                className="w-full"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? '生成中...' : '入力内容の改善提案を表示'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <Alert variant="default" className="mt-4 w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>注意事項</AlertTitle>
            <AlertDescription>
              生成された内容は必ず確認し、必要に応じて編集してください。AIは不正確な情報を含むことがあります。
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>

      {/* 改善提案モーダル */}
      {showSuggestions && suggestions.length > 0 && (
        <AiSuggestionsList
          suggestions={suggestions}
          onApply={applySuggestion}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </>
  );
}
