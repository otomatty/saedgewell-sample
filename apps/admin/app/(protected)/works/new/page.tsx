import React from 'react';
import { PageHeader } from '@kit/ui/page-header';
import NewWorkForm from './_components/new-work-form';
import type { Metadata } from 'next';
import AiFabWrapper from './_components/ai-fab-wrapper';

/**
 * @page NewWorkPage
 * @description 新規実績作成ページ。サーバーコンポーネントとして実装。
 * 実際のフォーム処理はクライアントコンポーネントのNewWorkFormに委譲します。
 * @returns {React.ReactElement} 新規実績作成ページのUI。
 */
export default function NewWorkPage() {
  return (
    <div className="container relative">
      <PageHeader
        title="実績新規作成"
        description="新しい実績・プロジェクトを登録します"
        breadcrumbs={[
          { href: '/works', label: '実績一覧' },
          { href: '/works/new', label: '新規作成' },
        ]}
      />

      <div className="py-8">
        <NewWorkForm />
      </div>

      {/* AI FABボタンとモーダル (クライアントコンポーネント) */}
      <AiFabWrapper />
    </div>
  );
}

/**
 * メタデータの設定
 */
export const metadata: Metadata = {
  title: '実績新規作成',
  description: '新しい実績・プロジェクトを登録します',
};
