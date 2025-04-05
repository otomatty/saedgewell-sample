/**
 * 検索機能の設定
 */
export const searchConfig = {
  /**
   * キャッシュ関連の設定
   */
  cache: {
    /** キャッシュの有効期間（ミリ秒） */
    ttl: 5 * 60 * 1000, // 5分
    /** ファイルシステムの変更チェック間隔（ミリ秒） */
    checkInterval: 60 * 1000, // 1分
  },

  /**
   * 検索関連の設定
   */
  search: {
    /** 検索結果の最大数 */
    maxResults: 20,
    /** 最小クエリ長 */
    minQueryLength: 2,
    /** 抜粋の最大長 */
    excerptLength: 150,
    /** マッチコンテキストの前後の文字数 */
    contextLength: 50,
  },

  /**
   * インデックス関連の設定
   */
  index: {
    /** インデックスファイルのパス */
    path: 'public/search/index.json',
    /** インデックスの更新間隔（ミリ秒） */
    updateInterval: 24 * 60 * 60 * 1000, // 24時間
  },

  /**
   * スコアリング関連の設定
   */
  scoring: {
    /** フィールドごとの基本スコア */
    baseScores: {
      title: 100,
      description: 80,
      content: 60,
    },
    /** 順位による減衰係数 */
    rankDecayFactor: 0.5,
  },
} as const;
