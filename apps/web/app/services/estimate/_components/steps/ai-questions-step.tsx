'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Spinner } from '@kit/ui/spinner';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@kit/ui/radio-group';
import { Checkbox } from '@kit/ui/checkbox';
import { Label } from '@kit/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@kit/ui/alert';
import { formDataAtom, aiQuestionsAtom, aiAnswersAtom } from '~/store/estimate';
import { generateQuestions } from '~/actions/estimate/generateQuestions';
import type { AIQuestion, QuestionAnswer } from '~/types/estimate';

export function AIQuestionsStep() {
  const [formData] = useAtom(formDataAtom);
  const [aiQuestions, setAiQuestions] = useAtom(aiQuestionsAtom);
  const [answers, setAnswers] = useAtom(aiAnswersAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ページロード時に質問がなければ取得
    const fetchQuestions = async () => {
      if (aiQuestions.length === 0 && formData.description) {
        setLoading(true);
        setError(null);

        try {
          const result = await generateQuestions(
            formData.description,
            formData.projectType
          );

          // 取得した質問をAIQuestionフォーマットに変換
          const questions: AIQuestion[] = result.followUpQuestions.map((q) => ({
            questionId: q.questionId,
            questionText: q.questionText,
            type: q.type as AIQuestion['type'],
            options: Array.isArray(q.options) ? q.options : null,
            validationRules: q.validationRules,
            isAnswered: false,
            answer: undefined,
            skipped: false,
            description: '', // オプショナルだが初期値として空文字を設定
          }));

          setAiQuestions(questions);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : '質問の生成に失敗しました'
          );
          console.error('Failed to generate questions:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [
    aiQuestions.length,
    formData.description,
    formData.projectType,
    setAiQuestions,
  ]);

  const handleAnswerChange = (
    questionId: string,
    value: string | string[] | number
  ) => {
    // 回答を更新
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // 質問の回答状態を更新
    setAiQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId
          ? {
              ...q,
              isAnswered: true,
              skipped: false,
              answer: value,
            }
          : q
      )
    );
  };

  const handleSkip = (questionId: string) => {
    // 質問をスキップ状態に更新
    setAiQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId
          ? {
              ...q,
              skipped: true,
              isAnswered: false,
              answer: undefined,
            }
          : q
      )
    );

    // answersから該当の回答を削除
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    setAiQuestions([]);

    try {
      const result = await generateQuestions(
        formData.description,
        formData.projectType
      );

      const questions: AIQuestion[] = result.followUpQuestions.map((q) => ({
        questionId: q.questionId,
        questionText: q.questionText,
        type: q.type as AIQuestion['type'],
        options: Array.isArray(q.options) ? q.options : null,
        validationRules: q.validationRules,
        isAnswered: false,
        answer: undefined,
        skipped: false,
        description: '',
      }));

      setAiQuestions(questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : '質問の生成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Spinner className="h-8 w-8" />
        <p className="mt-4 text-muted-foreground">
          AIが最適な質問を考えています...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>エラーが発生しました</AlertTitle>
        <AlertDescription>
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={handleRetry}>
            再試行
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium">プロジェクトについての追加質問</h3>
        <p className="text-muted-foreground">
          より正確な見積もりのために、以下の質問にお答えください。
        </p>
      </div>

      {aiQuestions.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-muted-foreground">質問を生成しています...</p>
        </div>
      ) : (
        aiQuestions.map((question) => (
          <div
            key={question.questionId}
            className={`p-4 border rounded-md ${
              question.skipped ? 'border-muted bg-muted/30' : 'border-border'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <Label className="text-base font-medium">
                {question.questionText}
              </Label>
              {!question.skipped && !question.isAnswered && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSkip(question.questionId)}
                >
                  スキップ
                </Button>
              )}
            </div>

            {question.skipped ? (
              <p className="text-sm text-muted-foreground">
                この質問はスキップされました
              </p>
            ) : (
              <QuestionInput
                question={question}
                value={answers[question.questionId]}
                onChange={(value) =>
                  handleAnswerChange(question.questionId, value)
                }
              />
            )}
          </div>
        ))
      )}

      {aiQuestions.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            回答した情報は見積もりの精度向上のために使用されます。
          </p>
        </div>
      )}
    </div>
  );
}

// 質問タイプに応じた入力コンポーネント
function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: AIQuestion;
  value: string | string[] | number | undefined;
  onChange: (value: string | string[] | number) => void;
}) {
  switch (question.type) {
    case 'text':
      return (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1"
        />
      );

    case 'textarea':
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1"
          rows={3}
        />
      );

    case 'radio':
    case 'select':
      return (
        <RadioGroup
          value={typeof value === 'string' ? value : String(value || '')}
          onValueChange={onChange}
          className="mt-2"
        >
          {question.options?.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option}
                id={`${question.questionId}-${option}`}
              />
              <Label htmlFor={`${question.questionId}-${option}`}>
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case 'checkbox':
      return (
        <div className="space-y-2 mt-2">
          {question.options?.map((option) => {
            const selectedValues = Array.isArray(value) ? value : [];
            return (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.questionId}-${option}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selectedValues, option]);
                    } else {
                      onChange(selectedValues.filter((v) => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${question.questionId}-${option}`}>
                  {option}
                </Label>
              </div>
            );
          })}
        </div>
      );

    case 'number':
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full mt-1"
        />
      );

    default:
      return (
        <p className="text-sm text-muted-foreground">
          未対応の質問形式です: {question.type}
        </p>
      );
  }
}
