#!/usr/bin/env bun

/**
 * AI APIサービスとの連携を行うライブラリ
 * Gemini APIを使用してタイトル候補を生成する
 */

import { config } from '../config/ai-config.js';
import {
  GoogleGenerativeAI,
  type GenerativeModel,
} from '@google/generative-ai';

// 応答の型定義
export interface TitleCandidate {
  id: number;
  title: string;
  slug: string;
  tags: string[];
}

export interface AIResponse {
  candidates: TitleCandidate[];
}

/**
 * Gemini APIクライアント
 */
export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    try {
      // 環境変数、または設定ファイルからAPIキーを取得
      const apiKey = process.env.GEMINI_API_KEY || config.apiKey;

      if (!apiKey) {
        throw new Error('Gemini API Keyが設定されていません');
      }

      this.genAI = new GoogleGenerativeAI(apiKey);

      // モデルを初期化
      const modelName =
        process.env.AI_MODEL || config.model || 'gemini-2.0-flash';
      this.model = this.genAI.getGenerativeModel({ model: modelName });
    } catch (error) {
      console.error('AIサービスの初期化に失敗しました:', error);
      throw error;
    }
  }

  /**
   * 入力内容からタイトル候補を生成する
   * @param content ユーザーが入力した内容
   * @returns タイトル候補の配列
   */
  async generateTitleCandidates(content: string): Promise<AIResponse> {
    try {
      // プロンプトを構築
      const prompt = `
以下の内容から、適切な日本語のタイトル案を3つ、それぞれに対応する英語のケバブケーススラッグ、そしてタグ候補を生成してください。
      
内容:
${content}
      
各タイトルは以下の特徴を持つようにしてください:
- 候補1: 簡潔で端的なタイトル
- 候補2: 内容を詳細に表現したタイトル
- 候補3: 技術的な専門用語を含むタイトル
      
出力形式（JSON）:
{
  "candidates": [
    {
      "id": 1,
      "title": "簡潔なタイトル",
      "slug": "concise-title-slug",
      "tags": ["タグ1", "タグ2"]
    },
    {
      "id": 2,
      "title": "詳細なタイトル",
      "slug": "detailed-title-slug",
      "tags": ["タグ1", "タグ2", "タグ3"]
    },
    {
      "id": 3,
      "title": "技術的なタイトル",
      "slug": "technical-title-slug",
      "tags": ["タグ1", "タグ3", "タグ4"]
    }
  ]
}
      `;

      // モデルを実行
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      try {
        // JSONの部分だけを抜き出す（マークダウンなどの形式で返ってくる場合がある）
        const jsonMatch =
          text.match(/```json\n([\s\S]*?)\n```/) ||
          text.match(/```\n([\s\S]*?)\n```/) ||
          text.match(/{[\s\S]*?}/);

        const jsonString = jsonMatch
          ? jsonMatch[0].replace(/```json\n|```\n|```/g, '')
          : text;

        // JSONをパース
        const parsedResponse = JSON.parse(jsonString) as AIResponse;

        // 応答を検証
        if (
          !parsedResponse.candidates ||
          parsedResponse.candidates.length === 0
        ) {
          throw new Error('AIから有効な候補が返されませんでした');
        }

        return parsedResponse;
      } catch (parseError) {
        console.error('AI応答のパースに失敗しました:', parseError);
        console.debug('AI応答テキスト:', text);
        throw new Error(
          'AI応答の解析に失敗しました。APIの出力形式が変更された可能性があります。'
        );
      }
    } catch (error) {
      console.error('タイトル候補の生成に失敗しました:', error);
      throw error;
    }
  }

  /**
   * 入力内容から単一のタイトルとスラッグを生成する（手動入力のサポート用）
   * @param title ユーザーが入力したタイトル
   * @returns 推奨スラッグとタグ
   */
  async generateSlugAndTags(
    title: string
  ): Promise<{ slug: string; tags: string[] }> {
    try {
      const prompt = `
次の日本語タイトルに対して、適切な英語のケバブケーススラッグとタグを生成してください。

タイトル: ${title}

出力形式（JSON）:
{
  "slug": "english-kebab-case-slug",
  "tags": ["タグ1", "タグ2", "タグ3"]
}
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      try {
        const jsonMatch =
          text.match(/```json\n([\s\S]*?)\n```/) ||
          text.match(/```\n([\s\S]*?)\n```/) ||
          text.match(/{[\s\S]*?}/);

        const jsonString = jsonMatch
          ? jsonMatch[0].replace(/```json\n|```\n|```/g, '')
          : text;

        const parsedResponse = JSON.parse(jsonString);

        if (!parsedResponse.slug) {
          throw new Error('AIからスラッグが返されませんでした');
        }

        return {
          slug: parsedResponse.slug,
          tags: parsedResponse.tags || [],
        };
      } catch (parseError) {
        console.error('AI応答のパースに失敗しました:', parseError);

        // フォールバック: 簡易的なスラッグ生成
        const fallbackSlug = title
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .substring(0, 50);

        return {
          slug: `journal-entry-${Date.now()}`,
          tags: ['journal'],
        };
      }
    } catch (error) {
      console.error('スラッグとタグの生成に失敗しました:', error);

      // エラー時は日時ベースのスラッグを返す
      return {
        slug: `journal-entry-${Date.now()}`,
        tags: ['journal'],
      };
    }
  }
}

// モジュールとしてエクスポート
export default new AIService();
