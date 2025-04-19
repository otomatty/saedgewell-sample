#!/usr/bin/env bun

/**
 * ジャーナルエントリーファイルを生成するためのライブラリ
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import type { TitleCandidate } from './ai-service.js';
import { getJSTDateString } from './date-utils.js';

// インターフェース定義
interface JournalEntry {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  [key: string]: unknown;
}

interface IndexData {
  date: string;
  entries: JournalEntry[];
  commits: unknown[];
  [key: string]: unknown;
}

// Promise版の関数
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);
const execPromise = promisify(exec);

/**
 * ファイル生成を担当するクラス
 */
export class FileGenerator {
  private projectRoot: string;
  private journalsPath: string;
  private author: string;

  /**
   * コンストラクタ
   */
  constructor() {
    // プロジェクトルートを決定
    this.projectRoot =
      process.env.PROJECT_ROOT ||
      process.env.WORKSPACE_ROOT ||
      '/Users/sugaiakimasa/apps/saedgewell';

    this.journalsPath = path.join(this.projectRoot, '.docs', 'journals');

    // 著者名の設定
    this.author = process.env.JOURNAL_AUTHOR || 'Akimasa Sugai';
  }

  /**
   * 日付ディレクトリを確認/作成する
   * @param dateStr 日付文字列 (YYYY-MM-DD)
   * @returns ディレクトリのパス
   */
  async ensureDateDirectory(dateStr: string): Promise<string> {
    try {
      // 日付が指定されていない場合は今日の日付を使用（日本標準時）
      const effectiveDateStr = !dateStr
        ? getJSTDateString() // 日本標準時でYYYY-MM-DD形式
        : dateStr;

      const dateDirPath = path.join(this.journalsPath, effectiveDateStr);

      try {
        // ディレクトリが存在するか確認
        await access(dateDirPath, fs.constants.F_OK);
        console.log(`日付ディレクトリが既に存在します: ${effectiveDateStr}`);
      } catch (error) {
        // ディレクトリが存在しない場合は自動的に作成
        console.log(`日付ディレクトリを作成します: ${effectiveDateStr}`);

        try {
          // existing script to create directory
          await execPromise(
            `cd ${this.projectRoot}/apps/docs && bun run create:journal:dirs -- --end-date ${effectiveDateStr}`
          );
        } catch (scriptError) {
          // スクリプト実行に失敗した場合は手動で作成
          console.warn(
            `スクリプトの実行に失敗しました。手動でディレクトリを作成します: ${scriptError}`
          );
          await mkdir(dateDirPath, { recursive: true });

          // index.jsonを初期化
          const initialIndexData: IndexData = {
            date: effectiveDateStr,
            entries: [],
            commits: [],
          };

          await writeFile(
            path.join(dateDirPath, 'index.json'),
            JSON.stringify(initialIndexData, null, 2)
          );
        }
      }

      return dateDirPath;
    } catch (error) {
      console.error(
        `日付ディレクトリの確認/作成中にエラーが発生しました: ${error}`
      );
      throw error;
    }
  }

  /**
   * 現在の日本標準時の日付を YYYY-MM-DD 形式で取得する
   * @returns 日本標準時の日付文字列 (YYYY-MM-DD)
   * @deprecated 代わりに date-utils.js の getJSTDateString() を使用してください
   */
  private getJSTDateString(): string {
    return getJSTDateString();
  }

  /**
   * MDXファイルを生成する
   * @param dateStr 日付文字列 (YYYY-MM-DD)
   * @param candidate タイトル候補
   * @param content 内容
   * @returns 生成されたファイルのパス
   */
  async generateMdxFile(
    dateStr: string,
    candidate: TitleCandidate,
    content: string
  ): Promise<string> {
    try {
      // 日付ディレクトリを確認/作成
      const dateDirPath = await this.ensureDateDirectory(dateStr);

      // mdxファイルのパス
      const mdxFilePath = path.join(dateDirPath, `${candidate.slug}.mdx`);

      // ファイルが既に存在するか確認
      try {
        await access(mdxFilePath, fs.constants.F_OK);

        // 存在する場合はタイムスタンプを追加
        const timestamp = new Date().getTime();
        const newSlug = `${candidate.slug}-${timestamp}`;
        console.log(
          `ファイルが既に存在します。代替名で作成します: ${newSlug}.mdx`
        );

        return this.generateMdxFile(
          dateStr,
          { ...candidate, slug: newSlug },
          content
        );
      } catch (error) {
        // ファイルが存在しない場合は続行
      }

      // MDXファイルのコンテンツ
      const mdxContent = `---
title: '${candidate.title}'
description: ''
date: '${dateStr}'
author: '${this.author}'
tags: [${candidate.tags.map((tag: string) => `'${tag}'`).join(', ')}]
---

# ${candidate.title}

${content}
`;

      // ファイルに書き込み
      await writeFile(mdxFilePath, mdxContent);
      console.log(`MDXファイルを作成しました: ${mdxFilePath}`);

      // index.jsonを更新
      await this.updateIndexJson(dateStr, candidate);

      return mdxFilePath;
    } catch (error) {
      console.error(`MDXファイルの生成中にエラーが発生しました: ${error}`);
      throw error;
    }
  }

  /**
   * index.jsonファイルを更新する
   * @param dateStr 日付文字列 (YYYY-MM-DD)
   * @param candidate タイトル候補
   * @returns 成功したかどうか
   */
  async updateIndexJson(
    dateStr: string,
    candidate: TitleCandidate
  ): Promise<boolean> {
    try {
      const dateDirPath = await this.ensureDateDirectory(dateStr);
      const indexPath = path.join(dateDirPath, 'index.json');

      // index.jsonを読み込み
      let indexData: IndexData;
      try {
        const indexContent = await readFile(indexPath, 'utf8');
        indexData = JSON.parse(indexContent) as IndexData;
      } catch (error) {
        // ファイルが存在しないか読み込みエラーの場合は新規作成
        indexData = {
          date: dateStr,
          entries: [],
          commits: [],
        };
      }

      // エントリを追加
      const newEntry: JournalEntry = {
        id: candidate.slug,
        title: candidate.title,
        description: '',
        tags: candidate.tags,
      };

      // 既存のエントリをチェック
      const existingEntryIndex = indexData.entries.findIndex(
        (entry) => entry.id === candidate.slug
      );

      if (existingEntryIndex >= 0) {
        // 既存のエントリを更新
        indexData.entries[existingEntryIndex] = newEntry;
      } else {
        // 新しいエントリを追加
        indexData.entries.push(newEntry);
      }

      // 更新されたデータを書き込み
      await writeFile(indexPath, JSON.stringify(indexData, null, 2));
      console.log(`index.jsonを更新しました: ${indexPath}`);

      // 更新を完全にするために、更新スクリプトを実行
      try {
        await execPromise(
          `cd ${this.projectRoot}/apps/docs && bun run update:journal:entries -- --dir ${dateStr} --force`
        );
        console.log('index.jsonの更新が完了しました');
      } catch (scriptError) {
        console.warn(
          `更新スクリプトの実行に失敗しました。手動での更新が必要な場合があります: ${scriptError}`
        );
        // エラーでも成功とみなす（基本的な更新は既に行われているため）
      }

      return true;
    } catch (error) {
      console.error(`index.jsonの更新中にエラーが発生しました: ${error}`);
      throw error;
    }
  }

  /**
   * 作成されたファイルをVSCodeで開く
   * @param filePath ファイルパス
   */
  async openFileInVSCode(filePath: string): Promise<void> {
    try {
      await execPromise(`code ${filePath}`);
      console.log(`ファイルをVSCodeで開きました: ${filePath}`);
    } catch (error) {
      // codeコマンドが見つからない場合の処理
      if (
        error instanceof Error &&
        error.message.includes('command not found')
      ) {
        console.log(`
注意: 'code'コマンドが見つかりません。以下のファイルを手動で開いてください:
ファイルパス: ${filePath}

VSCodeでcodeコマンドを有効にするには:
  1. VSCodeを開く
  2. コマンドパレット(Cmd+Shift+P)を開く
  3. "Shell Command: Install 'code' command in PATH"を選択して実行
`);
      } else {
        console.error(
          `ファイルをVSCodeで開く際にエラーが発生しました: ${error}`
        );
      }
      // エラーは無視（コマンドが失敗しても処理は続行）
    }
  }
}

// モジュールとしてエクスポート
export default new FileGenerator();
