/**
 * ジャーナルファイル操作モジュール
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { promisify } from 'node:util';
import type { IndexData, CommitData } from './types.js';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

/**
 * 日付ディレクトリを再帰的に探索する
 * @param dir 探索開始ディレクトリ
 * @param journalsPath ジャーナルのルートパス
 * @returns 日付ディレクトリのパスの配列
 */
export async function findJournalDirs(
  dir: string,
  journalsPath: string
): Promise<string[]> {
  const entries = await readdir(dir);
  const dateDirs: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry);
    const entryStat = await stat(entryPath);

    if (entryStat.isDirectory()) {
      // 日付形式のディレクトリかチェック (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(entry)) {
        dateDirs.push(entryPath);
      } else {
        // 再帰的に検索
        const subDirs = await findJournalDirs(entryPath, journalsPath);
        dateDirs.push(...subDirs);
      }
    }
  }

  return dateDirs;
}

/**
 * 指定された日付が日付範囲内にあるかチェック
 * @param dateStr チェックする日付 (YYYY-MM-DD)
 * @param fromDateStr 開始日 (YYYY-MM-DD)
 * @param toDateStr 終了日 (YYYY-MM-DD)
 * @returns 範囲内ならtrue
 */
export function isDateInRange(
  dateStr: string,
  fromDateStr: string | null,
  toDateStr: string
): boolean {
  // 日付文字列をJST基準で解析
  const date = new Date(`${dateStr}T00:00:00+09:00`);
  const toDate = new Date(`${toDateStr}T00:00:00+09:00`);

  // fromDateが指定されている場合はその日付から比較
  if (fromDateStr) {
    const fromDate = new Date(`${fromDateStr}T00:00:00+09:00`);
    return date >= fromDate && date <= toDate;
  }

  // fromDateが指定されていない場合はtoDateのみで比較
  return date <= toDate;
}

/**
 * 処理対象の日付ディレクトリをフィルタリング
 * @param allDateDirs すべての日付ディレクトリのパスの配列
 * @param fromDate 開始日 (YYYY-MM-DD)
 * @param toDate 終了日 (YYYY-MM-DD)
 * @returns フィルタリングされた日付ディレクトリのパスの配列
 */
export function filterDateDirs(
  allDateDirs: string[],
  fromDate: string | null,
  toDate: string
): string[] {
  return allDateDirs.filter((dir) => {
    const dirName = path.basename(dir);
    // 日付形式のディレクトリのみを処理
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dirName)) {
      return false;
    }
    // 指定された日付範囲のディレクトリのみを処理
    return isDateInRange(dirName, fromDate, toDate);
  });
}

/**
 * 日付ディレクトリのindex.jsonファイルを読み込む
 * @param dateDir 日付ディレクトリのパス
 * @returns 読み込んだIndexDataオブジェクト
 */
export async function readJournalFile(dateDir: string): Promise<IndexData> {
  const indexPath = path.join(dateDir, 'index.json');

  // ファイルの存在確認
  if (!fs.existsSync(indexPath)) {
    // ファイルが存在しない場合は新規作成
    const dirName = path.basename(dateDir);
    const newData: IndexData = {
      date: dirName,
      entries: [],
      commits: [],
    };
    await writeFile(indexPath, JSON.stringify(newData, null, 2));
    return newData;
  }

  // 既存ファイルを読み込み
  const indexContent = await readFile(indexPath, 'utf8');
  return JSON.parse(indexContent) as IndexData;
}

/**
 * 日付ディレクトリのindex.jsonファイルにコミット情報を更新して保存
 * @param dateDir 日付ディレクトリのパス
 * @param indexData 既存のIndexDataオブジェクト
 * @param newCommits 追加するコミット情報の配列
 * @returns 追加されたコミットの数
 */
export async function updateJournalCommits(
  dateDir: string,
  indexData: IndexData,
  newCommits: CommitData[]
): Promise<number> {
  if (newCommits.length === 0) {
    return 0;
  }

  const indexPath = path.join(dateDir, 'index.json');

  // 既存のコミット情報
  const existingCommits = indexData.commits || [];

  // 既存のコミットのSHAを集めたセット
  const existingShas = new Set(
    existingCommits.map((commit: CommitData) => commit.sha)
  );

  // 重複していない新しいコミットのみをフィルタリング
  const filteredNewCommits = newCommits.filter(
    (commit) => !existingShas.has(commit.sha)
  );

  if (filteredNewCommits.length === 0) {
    // 新しいコミットがない場合は更新しない
    return 0;
  }

  // 既存のコミットと新しいコミットをマージ
  indexData.commits = [...existingCommits, ...filteredNewCommits];

  // コミットを日時でソート（新しい順）
  indexData.commits.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 更新されたデータを書き込み
  await writeFile(indexPath, JSON.stringify(indexData, null, 2));

  return filteredNewCommits.length;
}

/**
 * プロジェクトのルートパスを取得
 * @returns プロジェクトルートパス
 */
export function getProjectRoot(): string {
  // Docker環境の場合は/app、それ以外の場合はホストパスを使用
  return process.env.DOCKER_DEBUG === 'true'
    ? '/app'
    : '/Users/sugaiakimasa/apps/saedgewell';
}

/**
 * ジャーナルディレクトリのパスを取得
 * @returns ジャーナルディレクトリのパス
 */
export function getJournalsPath(): string {
  return path.join(getProjectRoot(), '.docs', 'journals');
}
