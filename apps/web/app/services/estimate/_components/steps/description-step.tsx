'use client';

import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { formDataAtom } from '~/store/estimate';
import { Label } from '@kit/ui/label';
import { Textarea } from '@kit/ui/textarea';
import { Card } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Skeleton } from '@kit/ui/skeleton';
import { Lightbulb, Wand2 } from 'lucide-react';
import {
  generateDescriptionExamples,
  type DescriptionExample,
} from '~/actions/estimate/generateDescriptionExamples';
import type { EstimateFormData } from '~/types/estimate';

export function DescriptionStep() {
  const [formData, setFormData] = useAtom(formDataAtom);
  const [examples, setExamples] = useState<DescriptionExample[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev: EstimateFormData) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handleGenerateExamples = async () => {
    if (!formData.projectType) return;

    setIsLoading(true);
    setError(null);
    try {
      const generatedExamples = await generateDescriptionExamples(
        formData.projectType,
        formData.description
      );
      setExamples(generatedExamples);
    } catch (error) {
      console.error('Error generating examples:', error);
      setError(
        'プロジェクトの具体化中にエラーが発生しました。もう一度お試しください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseExample = (example: DescriptionExample) => {
    const description = `【プロジェクト概要】
${example.description}

【主な機能】
${example.features.map((f) => `・${f}`).join('\n')}

【ターゲットユーザー】
${example.targetUsers.map((u) => `・${u}`).join('\n')}

【参考サイト】
${example.references.map((r) => `・${r}`).join('\n')}`;

    setFormData((prev: EstimateFormData) => ({
      ...prev,
      description,
    }));
  };

  const hasDescription = formData.description?.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="description" className="text-base">
          プロジェクトの概要
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          プロジェクトの目的、主な機能、ターゲットユーザーなどを記述してください。AIがより具体的な提案を生成します。
        </p>
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateExamples}
            disabled={isLoading || !formData.projectType}
          >
            {hasDescription ? (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                プロジェクトを具体化
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                例文を生成
              </>
            )}
          </Button>
        </div>
        <Textarea
          id="description"
          placeholder="例：会員制の料理レシピ共有サイトを作りたいと考えています。ユーザーは自分のレシピを投稿でき、他のユーザーのレシピを閲覧・お気に入り登録できるようにしたいです。主なターゲットは20-30代の料理好きの方です。"
          value={formData.description}
          onChange={handleChange}
          className="min-h-[200px] mb-4"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40" />
          {!hasDescription && (
            <>
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </>
          )}
        </div>
      ) : error ? (
        <div className="text-center p-4">
          <p className="text-destructive">{error}</p>
          <button
            onClick={handleGenerateExamples}
            className="text-primary hover:underline mt-2"
            type="button"
          >
            再試行
          </button>
        </div>
      ) : examples.length > 0 ? (
        <div>
          <h3 className="text-sm font-medium mb-4">
            {hasDescription ? '具体化された提案' : '生成された例文'}
          </h3>
          <div className="grid gap-4">
            {examples.map((example, index) => (
              <Card key={example.title} className="p-4">
                <h4 className="font-medium mb-2">{example.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {example.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseExample(example)}
                >
                  この{hasDescription ? '提案' : '例文'}を使用
                </Button>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      <div className="text-sm text-muted-foreground">
        <h3 className="font-medium mb-2">記入のポイント：</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>プロジェクトで実現したいことは何ですか？</li>
          <li>
            どのような機能が必要ですか？優先順位の高い機能から記述してください。
          </li>
          <li>想定しているユーザー層や利用シーンを教えてください。</li>
          <li>
            参考にしたいWebサイトやアプリケーションがあれば、URLを記載してください。
          </li>
          <li>
            特別な要件（セキュリティ、パフォーマンス、デザインなど）があれば記載してください。
          </li>
        </ul>
      </div>
    </div>
  );
}
