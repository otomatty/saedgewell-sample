'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@kit/ui/accordion';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Edit, Check, X, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import {
  updateChallengesAndSolutions,
  type ChallengeData,
  type SolutionData,
} from '~/actions/works/update-challenges';

interface ChallengesListProps {
  challenges: Array<{
    id: string;
    title: string;
    description: string;
    sort_order: number;
  }>;
  solutions: Array<{
    id: string;
    challenge_id?: string | null;
    title: string;
    description: string;
    sort_order: number;
  }>;
  workId: string;
}

/**
 * 課題と解決策のインライン編集用コンポーネント
 */
export function ChallengesList({
  challenges,
  solutions,
  workId,
}: ChallengesListProps) {
  // 編集モード状態
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 編集中のデータ
  const [editingChallenges, setEditingChallenges] = useState<ChallengeData[]>(
    challenges.map((c) => ({
      ...c,
      isNew: false,
      isDeleted: false,
    }))
  );

  const [editingSolutions, setEditingSolutions] = useState<SolutionData[]>(
    solutions.map((s) => ({
      ...s,
      isNew: false,
      isDeleted: false,
    }))
  );

  // 編集モードの切り替え
  const handleEditClick = () => {
    setEditingChallenges(
      challenges.map((c) => ({
        ...c,
        isNew: false,
        isDeleted: false,
      }))
    );

    setEditingSolutions(
      solutions.map((s) => ({
        ...s,
        isNew: false,
        isDeleted: false,
      }))
    );

    setIsEditing(true);
  };

  // 編集のキャンセル
  const handleCancel = () => {
    setIsEditing(false);
  };

  // 編集の保存
  const handleSave = async () => {
    try {
      setIsSubmitting(true);

      // 空のタイトルをチェック
      const hasEmptyChallenge = editingChallenges.some(
        (c) => !c.isDeleted && c.title.trim() === ''
      );

      const hasEmptySolution = editingSolutions.some(
        (s) => !s.isDeleted && s.title.trim() === ''
      );

      if (hasEmptyChallenge || hasEmptySolution) {
        toast.error('タイトルは必須です');
        return;
      }

      await updateChallengesAndSolutions(workId, {
        challenges: editingChallenges,
        solutions: editingSolutions,
      });

      setIsEditing(false);
      toast.success('課題と解決策を更新しました');

      // ページのリロードが必要
      window.location.reload();
    } catch (error) {
      console.error('課題と解決策の更新に失敗しました:', error);
      toast.error('課題と解決策の更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 課題の追加
  const handleAddChallenge = () => {
    const newOrder =
      editingChallenges.length > 0
        ? Math.max(...editingChallenges.map((c) => c.sort_order)) + 1
        : 0;

    setEditingChallenges([
      ...editingChallenges,
      {
        id: `temp_${uuidv4()}`,
        title: '',
        description: '',
        sort_order: newOrder,
        isNew: true,
        isDeleted: false,
      },
    ]);
  };

  // 課題の削除
  const handleDeleteChallenge = (index: number) => {
    const updatedChallenges = [...editingChallenges];

    if (updatedChallenges[index]?.isNew) {
      // 新規作成の場合は配列から削除
      updatedChallenges.splice(index, 1);
    } else {
      // 既存の課題の場合は削除フラグを立てる
      const challenge = updatedChallenges[index];
      if (challenge) {
        challenge.isDeleted = true;

        // 関連する解決策にも削除フラグを立てる
        const challengeId = challenge.id;
        if (challengeId) {
          setEditingSolutions((prevSolutions) =>
            prevSolutions.map((solution) =>
              solution.challenge_id === challengeId
                ? { ...solution, isDeleted: true }
                : solution
            )
          );
        }
      }
    }

    setEditingChallenges(updatedChallenges);
  };

  // 課題のフィールド変更
  const handleChallengeChange = (
    index: number,
    field: keyof ChallengeData,
    value: string
  ) => {
    const updatedChallenges = [...editingChallenges];
    if (updatedChallenges[index]) {
      updatedChallenges[index] = {
        ...updatedChallenges[index],
        [field]: value,
      };
      setEditingChallenges(updatedChallenges);
    }
  };

  // 解決策の追加
  const handleAddSolution = (challengeId?: string) => {
    const newOrder =
      editingSolutions.length > 0
        ? Math.max(...editingSolutions.map((s) => s.sort_order)) + 1
        : 0;

    setEditingSolutions([
      ...editingSolutions,
      {
        id: `temp_${uuidv4()}`,
        challenge_id: challengeId,
        title: '',
        description: '',
        sort_order: newOrder,
        isNew: true,
        isDeleted: false,
      },
    ]);
  };

  // 解決策の削除
  const handleDeleteSolution = (index: number) => {
    const updatedSolutions = [...editingSolutions];
    const solution = updatedSolutions[index];

    if (!solution) return;

    if (solution.isNew) {
      // 新規作成の場合は配列から削除
      updatedSolutions.splice(index, 1);
    } else {
      // 既存の解決策の場合は削除フラグを立てる
      solution.isDeleted = true;
    }

    setEditingSolutions(updatedSolutions);
  };

  // 解決策のフィールド変更
  const handleSolutionChange = (
    index: number,
    field: keyof SolutionData,
    value: string
  ) => {
    const updatedSolutions = [...editingSolutions];
    if (updatedSolutions[index]) {
      updatedSolutions[index] = {
        ...updatedSolutions[index],
        [field]: value,
      };
      setEditingSolutions(updatedSolutions);
    }
  };

  // 課題ごとに関連する解決策を取得
  const getSolutionsForChallenge = (challengeId: string) => {
    return solutions.filter(
      (solution) => solution.challenge_id === challengeId
    );
  };

  // 編集中の課題ごとに関連する解決策を取得
  const getEditingSolutionsForChallenge = (challengeId: string) => {
    return editingSolutions.filter(
      (solution) => solution.challenge_id === challengeId && !solution.isDeleted
    );
  };

  // 課題に関連付けられていない解決策
  const generalSolutions = solutions.filter(
    (solution) => !solution.challenge_id
  );

  // 編集中の一般的な解決策
  const editingGeneralSolutions = editingSolutions.filter(
    (solution) => !solution.challenge_id && !solution.isDeleted
  );

  // 編集モードの表示
  if (isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>課題と解決策</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" />
              キャンセル
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
              <Check className="mr-2 h-4 w-4" />
              保存
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 課題一覧（編集中） */}
            {editingChallenges
              .filter((challenge) => !challenge.isDeleted)
              .map((challenge, challengeIndex) => {
                const realIndex = editingChallenges.findIndex(
                  (c) => c.id === challenge.id
                );
                const challengeSolutions = getEditingSolutionsForChallenge(
                  challenge.id || ''
                );

                return (
                  <div
                    key={challenge.id}
                    className="space-y-4 border p-4 rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">課題</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteChallenge(realIndex)}
                        disabled={isSubmitting}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Input
                        value={challenge.title}
                        onChange={(e) =>
                          handleChallengeChange(
                            realIndex,
                            'title',
                            e.target.value
                          )
                        }
                        placeholder="課題のタイトル"
                        disabled={isSubmitting}
                      />
                      <Textarea
                        value={challenge.description}
                        onChange={(e) =>
                          handleChallengeChange(
                            realIndex,
                            'description',
                            e.target.value
                          )
                        }
                        placeholder="課題の詳細"
                        rows={4}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* 関連する解決策（編集中） */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          解決策:
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSolution(challenge.id)}
                          disabled={isSubmitting}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          解決策を追加
                        </Button>
                      </div>

                      {challengeSolutions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          解決策がありません
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {challengeSolutions.map((solution, solutionIndex) => {
                            const realSolutionIndex =
                              editingSolutions.findIndex(
                                (s) => s.id === solution.id
                              );

                            return (
                              <div
                                key={solution.id}
                                className="border p-3 rounded-md"
                              >
                                <div className="flex items-center justify-between">
                                  <h5 className="text-sm font-medium">
                                    解決策
                                  </h5>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDeleteSolution(realSolutionIndex)
                                    }
                                    disabled={isSubmitting}
                                  >
                                    <Trash className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>

                                <div className="space-y-2 mt-2">
                                  <Input
                                    value={solution.title}
                                    onChange={(e) =>
                                      handleSolutionChange(
                                        realSolutionIndex,
                                        'title',
                                        e.target.value
                                      )
                                    }
                                    placeholder="解決策のタイトル"
                                    disabled={isSubmitting}
                                  />
                                  <Textarea
                                    value={solution.description}
                                    onChange={(e) =>
                                      handleSolutionChange(
                                        realSolutionIndex,
                                        'description',
                                        e.target.value
                                      )
                                    }
                                    placeholder="解決策の詳細"
                                    rows={3}
                                    disabled={isSubmitting}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* 一般的な解決策（編集中） */}
            <div className="space-y-4 border p-4 rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">その他の解決策</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddSolution()}
                  disabled={isSubmitting}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  解決策を追加
                </Button>
              </div>

              {editingGeneralSolutions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  一般的な解決策がありません
                </p>
              ) : (
                <div className="space-y-4">
                  {editingGeneralSolutions.map((solution, solutionIndex) => {
                    const realSolutionIndex = editingSolutions.findIndex(
                      (s) => s.id === solution.id
                    );

                    return (
                      <div key={solution.id} className="border p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-medium">解決策</h5>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeleteSolution(realSolutionIndex)
                            }
                            disabled={isSubmitting}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="space-y-2 mt-2">
                          <Input
                            value={solution.title}
                            onChange={(e) =>
                              handleSolutionChange(
                                realSolutionIndex,
                                'title',
                                e.target.value
                              )
                            }
                            placeholder="解決策のタイトル"
                            disabled={isSubmitting}
                          />
                          <Textarea
                            value={solution.description}
                            onChange={(e) =>
                              handleSolutionChange(
                                realSolutionIndex,
                                'description',
                                e.target.value
                              )
                            }
                            placeholder="解決策の詳細"
                            rows={3}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 課題追加ボタン */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleAddChallenge}
                disabled={isSubmitting}
              >
                <Plus className="mr-2 h-4 w-4" />
                課題を追加
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 課題がなければ追加ボタンのみ表示
  if (!challenges.length && !generalSolutions.length) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>課題と解決策</CardTitle>
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            追加
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            課題と解決策が設定されていません
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>課題と解決策</CardTitle>
        <Button variant="outline" size="sm" onClick={handleEditClick}>
          <Edit className="mr-2 h-4 w-4" />
          編集
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 課題と関連する解決策 */}
          {challenges.map((challenge) => {
            const relatedSolutions = getSolutionsForChallenge(challenge.id);

            return (
              <div
                key={challenge.id}
                className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0"
              >
                <h3 className="text-lg font-medium">{challenge.title}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {challenge.description}
                </p>

                {relatedSolutions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      解決策:
                    </h4>
                    <Accordion type="multiple" className="w-full">
                      {relatedSolutions.map((solution) => (
                        <AccordionItem key={solution.id} value={solution.id}>
                          <AccordionTrigger className="text-left">
                            {solution.title}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                            {solution.description}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
              </div>
            );
          })}

          {/* 課題に関連付けられていない一般的な解決策 */}
          {generalSolutions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">その他の解決策</h3>
              <Accordion type="multiple" className="w-full">
                {generalSolutions.map((solution) => (
                  <AccordionItem key={solution.id} value={solution.id}>
                    <AccordionTrigger className="text-left">
                      {solution.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                      {solution.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
