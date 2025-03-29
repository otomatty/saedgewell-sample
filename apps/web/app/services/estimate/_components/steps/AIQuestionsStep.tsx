'use client';

import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Card } from '@kit/ui/card';
import { Label } from '@kit/ui/label';
import { RadioGroup, RadioGroupItem } from '@kit/ui/radio-group';
import { Textarea } from '@kit/ui/textarea';
import { Skeleton } from '@kit/ui/skeleton';
import { Button } from '@kit/ui/button';
import { aiQuestionsAtom, formDataAtom } from '../../_atoms/estimate';
import { generateQuestions } from '~/actions/estimate/generateQuestions';

export function AIQuestionsStep() {
  const [questions, setQuestions] = useAtom(aiQuestionsAtom);
  const [formData] = useAtom(formDataAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!formData.projectType || !formData.description) return;

      setIsLoading(true);
      setError(null);
      try {
        const generatedQuestions = await generateQuestions(formData);
        setQuestions(
          generatedQuestions.map((q) => ({
            id: q.id,
            question: q.question,
            type: q.type === 'radio' ? 'radio' : 'text',
            options: q.options,
            isAnswered: false,
            answer: '',
            description: q.description,
            skipped: false,
          }))
        );
      } catch (error) {
        console.error('Error generating questions:', error);
        setError(
          '質問の生成中にエラーが発生しました。もう一度お試しください。'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [formData, setQuestions]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, answer: value, isAnswered: true } : q
      )
    );
  };

  const handleSkip = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, skipped: true, isAnswered: true } : q
      )
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-primary hover:underline mt-2"
          type="button"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <Card key={question.id} className="p-4">
          <div className="space-y-4">
            <div>
              <Label className="text-base">{question.question}</Label>
              {question.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {question.description}
                </p>
              )}
            </div>
            {!question.skipped && (
              <div>
                {question.type === 'radio' && question.options ? (
                  <RadioGroup
                    onValueChange={(value) =>
                      handleAnswerChange(question.id, value)
                    }
                    value={question.answer}
                  >
                    {question.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Textarea
                    value={question.answer}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    placeholder="回答を入力してください"
                  />
                )}
              </div>
            )}
            <div className="flex justify-end">
              {!question.skipped ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSkip(question.id)}
                >
                  この質問をスキップ
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setQuestions((prev) =>
                      prev.map((q) =>
                        q.id === question.id ? { ...q, skipped: false } : q
                      )
                    )
                  }
                >
                  回答する
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
