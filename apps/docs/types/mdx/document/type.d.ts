/**
 * ドキュメントタイプとカテゴリの型定義
 */

/**
 * ドキュメントタイプ
 * ドキュメントの種類を表す
 */
export interface DocType {
  /** 識別子 */
  id: string;
  /** タイトル */
  title: string;
  /** 説明 */
  description?: string;
  /** アイコン */
  icon?: string;
  /** サムネイル */
  thumbnail?: string; // Gyazoなどの画像URLまたは/thumbnails/から始まる相対パス
  /** ドキュメントの状態 */
  status?: 'published' | 'draft' | 'deprecated';
  /** ドロップダウンでの選択を無効化 */
  disabled?: boolean;
  /** "開発中" "非推奨"などのバッジテキスト */
  badge?: string;
  /** バッジの色 */
  badgeColor?: 'default' | 'warning' | 'error' | 'success';
  /** 完全に非表示にする */
  hidden?: boolean;
  /** ドキュメントのバージョン */
  version?: string;
  /** 最終更新日 */
  lastUpdated?: string;
  /** メンテナー情報 */
  maintainers?: string[];
  /** ドキュメントが属するカテゴリのID */
  category?: string;
  /** エンティティの種類（ドキュメントタイプ） */
  type?: 'docType';
  /** タグ情報 */
  tags?:
    | string[]
    | {
        [key: string]: string[] | undefined;
      };
  /** ドキュメントの要約（主に日記用） */
  summary?: string;
  /** ドキュメントの日付（主に日記用） */
  date?: string;
  /** ドキュメントの著者（主に日記用） */
  author?: string;
  /** 親ドキュメントの識別子（階層構造を表現） */
  parentId?: string;
  /** GitHubコミット情報（主に日記用） */
  githubCommits?: Array<{
    message: string;
    sha: string;
    date: string;
    authorName: string;
    authorLogin?: string;
    authorAvatar?: string;
    commitUrl: string;
    repoName?: string;
    repoOwner?: string;
    repoUrl?: string;
    additions?: number;
    deletions?: number;
  }>;
}

/**
 * ドキュメントカテゴリ
 * ドキュメントタイプをグループ化するカテゴリを表す
 */
export interface DocCategory {
  /** 識別子 */
  id: string;
  /** タイトル */
  title: string;
  /** 説明 */
  description?: string;
  /** アイコン */
  icon?: string;
  /** 表示順序 */
  order?: number;
  /** ドロップダウンでの選択を無効化 */
  disabled?: boolean;
  /** 完全に非表示にする */
  hidden?: boolean;
  /** エンティティの種類（カテゴリ） */
  type?: 'category';
}
