import type { WorkFormData } from './works/work-form';

/**
 * GitHubリポジトリから取得したREADME情報
 */
export interface RepositoryReadme {
  content: string;
  encoding: string;
  html_url: string;
}

/**
 * GitHubリポジトリから取得した言語統計情報
 * キーは言語名、値はバイト数
 */
export interface RepositoryLanguages {
  [language: string]: number;
}

/**
 * AIによる改善提案のレスポンス
 */
export interface WorkSuggestion {
  field: keyof WorkFormData;
  suggestion: string;
  reason: string;
}

/**
 * 課題と解決策の生成リクエスト
 */
export interface ChallengeSolutionRequest {
  description: string;
  technologies: { value: string; label: string }[];
  existingChallenges?: { title: string; description: string }[];
}

/**
 * AIレスポンスの基本インターフェース
 */
export interface AIResponse {
  success?: boolean;
  message?: string;
}

/**
 * 課題と解決策の生成レスポンス
 */
export interface ChallengeSolutionResponse extends AIResponse {
  challenges?: GeneratedChallenge[];
  solutions?: GeneratedSolution[];
}

/**
 * AIによって生成された課題の型
 */
export interface GeneratedChallenge {
  title: string;
  description: string;
}

/**
 * AIによって生成された解決策の型
 */
export interface GeneratedSolution {
  title: string;
  description: string;
  challenge_id?: string;
}

/**
 * AIによる実績内容生成のレスポンス
 */
export interface GeneratedWorkContent {
  title?: string;
  description?: string;
  detail_overview?: string;
  detail_role?: string;
  detail_period?: string;
  detail_team_size?: string;
  technologies?: { value: string; label: string }[];
  challenges?: GeneratedChallenge[];
  solutions?: GeneratedSolution[];
  responsibilities?: string[];
  results?: string[];
}
