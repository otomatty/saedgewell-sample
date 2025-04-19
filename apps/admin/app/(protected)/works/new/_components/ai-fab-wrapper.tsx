'use client';

import React, { useState, useEffect } from 'react';
import { AiFabMenu, type AiActionType } from '~/components/ai/ai-fab-menu';
import {
  AiProgressModal,
  type AiProgressStep,
} from '~/components/ai/ai-progress-modal';
import { toast } from 'sonner';
import { AI_EVENTS } from './work-form';

/**
 * AIのFABとモーダルを提供するラッパーコンポーネント
 * クライアントサイドのインタラクションを担当
 */
export default function AiFabWrapper() {
  // AI関連のstate管理
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiProgressSteps, setAiProgressSteps] = useState<AiProgressStep[]>([]);
  const [aiModalTitle, setAiModalTitle] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // WorkFormからの進捗イベントを受け取るための効果
  useEffect(() => {
    const handleProgressUpdate = (event: Event) => {
      const progressEvent = event as CustomEvent;
      const { steps, title, error, isCompleted } = progressEvent.detail;

      // 進捗状況の更新
      setAiProgressSteps(steps);

      // タイトルの更新（存在する場合）
      if (title) setAiModalTitle(title);

      // エラーの更新（存在する場合）
      setAiError(error || null);

      // 処理完了の場合
      if (isCompleted) {
        // モーダルを3秒後に自動的に閉じる
        setTimeout(() => {
          setIsAiModalOpen(false);
          setIsAiProcessing(false);
        }, 3000);
      }
    };

    // イベントリスナーを登録
    window.addEventListener(AI_EVENTS.UPDATE_PROGRESS, handleProgressUpdate);

    // クリーンアップ時にリスナーを削除
    return () => {
      window.removeEventListener(
        AI_EVENTS.UPDATE_PROGRESS,
        handleProgressUpdate
      );
    };
  }, []);

  // AIアクションのハンドラー
  const handleAiAction = async (action: AiActionType) => {
    setAiError(null);
    setIsAiProcessing(true);
    setIsAiModalOpen(true);

    // アクション種別に応じた処理
    if (action === 'title') {
      // タイトルからの生成はWorkFormコンポーネントに委譲
      const event = new CustomEvent(AI_EVENTS.GENERATE_FROM_TITLE);
      window.dispatchEvent(event);
    } else {
      // その他のアクションは従来通りの動作（一時的な処理）
      setAiModalTitle('AI処理を準備中...');
      setAiProgressSteps([
        { label: 'AI機能を準備しています...', status: 'completed' },
      ]);

      // 通常は何らかの処理が行われるが、ここでは直接閉じる
      setTimeout(() => {
        setIsAiProcessing(false);
        setIsAiModalOpen(false);
        toast.info(
          'フォーム内の入力欄（タイトル、説明、GitHubリポジトリURL）にデータを入力してください。AI支援機能はその情報を元に動作します。',
          { duration: 5000 }
        );
      }, 1500);
    }
  };

  return (
    <>
      {/* AI FABメニュー */}
      <AiFabMenu onActionSelect={handleAiAction} disabled={isAiProcessing} />

      {/* AI進捗モーダル */}
      <AiProgressModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title={aiModalTitle}
        steps={aiProgressSteps}
        error={aiError}
        onCancel={() => {
          setIsAiProcessing(false);
          setIsAiModalOpen(false);
          toast.info('AI処理をキャンセルしました');
        }}
      />
    </>
  );
}
