export type SkillCategory =
  | 'Language'
  | 'Framework/Library'
  | 'Database'
  | 'Cloud'
  | 'Infra/Tool'
  | 'Methodology'
  | 'Design' // デザインツールなどを考慮して追加
  | 'Other';

// ExperienceYears 型は不要になるので削除
// export type ExperienceYears =
//   | '< 1 year'
//   | '1-3 years'
//   | '3-5 years'
//   | '5+ years';

// 関連リンクの型
export interface RelatedLink {
  type:
    | 'project'
    | 'repository'
    | 'article'
    | 'certificate'
    | 'slides'
    | 'contribution' // OSSコントリビューションなどを追加
    | 'other'; // スライド資料などを追加
  name: string; // リンクの表示名 (例: 'プロジェクトA', 'GitHub Repo')
  url: string; // 実際のURL
}

// スキルの活動イベントを表す型
export interface SkillEvent {
  date: string; // イベント発生日 (YYYY-MM-DD 形式)
  type:
    | 'learning_start' // このスキルを使い始めた日
    | 'project' // 関連プロジェクト完了/マイルストーン
    | 'repository' // リポジトリ作成/メジャーアップデート
    | 'article' // 記事公開
    | 'certificate' // 資格取得
    | 'slides' // 登壇/発表
    | 'contribution' // OSSコントリビューション
    | 'other';
  description: string; // イベントの詳細 (例: 'プロジェクトA完了', 'React Hooks記事公開')
  // 必要に応じてポイントなどを追加しても良い
  // points?: number;
}

export interface Skill {
  id: string; // スキルを一意に識別するID (例: 'react', 'typescript')
  name: string; // 表示されるスキル名 (例: 'React', 'TypeScript')
  category: SkillCategory; // スキルカテゴリ
  // experienceYears?: ExperienceYears; // 削除
  startDate?: string; // 業務での使用開始日 (YYYY-MM-DD 形式) を追加
  projectCount?: number; // 関連するWorksプロジェクト数
  repositoryCount?: number; // 関連する公開リポジトリ数
  articleCount?: number; // 関連する技術記事数
  certificates?: string[]; // 関連する資格名のリスト (例: ['AWS SAA'])
  icon?: string; // public/icons/ 以下のアイコンファイル名 (例: 'react.svg')
  description?: string; // スキルの詳細説明 (追加)
  strengths?: string[]; // 得意な領域/用途を追加
  relatedLinks?: RelatedLink[]; // 関連リンクの配列を追加
  // 必要に応じて他の指標 (OSSコントリビューション数など) を追加
  mainVersions?: string[]; // 主要利用バージョン (例: ['18', '16'] for React)
  proficiency?: string; // 習熟度・利用頻度 (例: '日常的に利用', 'Advanced')
  learning?: string[]; // 現在学習中の関連技術 (例: ['Remix', 'WebAssembly'])
  interests?: string[]; // 今後習得したい関連技術 (例: ['Rust', 'AI/ML'])
  events?: SkillEvent[]; // スキルイベントの配列を追加
}
