/**
 * プロセス関連のデータ
 * 開発プロセスの情報を定義
 */

/**
 * プロセスステップの型定義
 */
export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
}

/**
 * 開発プロセスステップ一覧
 */
export const processes: ProcessStep[] = [
  {
    step: 1,
    title: 'ヒアリング・要件定義',
    description:
      'プロジェクトの目的、要件、予算、スケジュールなどについて詳しくお伺いします。必要に応じて追加のヒアリングや資料の共有をお願いすることがあります。',
    duration: '1-2週間',
    deliverables: ['要件定義書', 'プロジェクト計画書', '概算見積書'],
  },
  {
    step: 2,
    title: '設計・提案',
    description:
      'ヒアリングした内容をもとに、システム設計、UI/UX設計、技術選定などを行い、具体的な提案書を作成します。お客様との協議を通じて、最適な解決策を見出します。',
    duration: '2-3週間',
    deliverables: ['システム設計書', '画面設計書', '詳細見積書', '契約書'],
  },
  {
    step: 3,
    title: '開発・実装',
    description:
      '承認された設計書に基づいて、実際の開発作業を進めます。定期的に進捗報告を行い、必要に応じて中間デモをご確認いただきます。',
    duration: 'プロジェクトによる',
    deliverables: ['ソースコード', '進捗報告書', 'テスト結果報告書'],
  },
  {
    step: 4,
    title: 'テスト・品質確認',
    description:
      '実装したシステムの動作確認、品質チェック、セキュリティテストなどを実施します。お客様にも動作確認をしていただき、必要な修正を行います。',
    duration: '2-3週間',
    deliverables: ['テスト仕様書', 'テスト結果報告書', '修正報告書'],
  },
  {
    step: 5,
    title: 'リリース・納品',
    description:
      '最終確認を経て、本番環境へのデプロイを行います。必要に応じて、運用マニュアルの作成や管理者への操作説明も実施します。',
    duration: '1週間',
    deliverables: ['運用マニュアル', 'ソースコード一式', '納品書'],
  },
];
