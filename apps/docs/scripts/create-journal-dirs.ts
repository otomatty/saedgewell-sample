#!/usr/bin/env bun

/**
 * このスクリプトは以下の機能を実行します:
 * 1. .docs/journalsディレクトリ内の最新の日付ディレクトリを検出
 * 2. 最新の日付から今日（または指定した終了日）までの範囲で存在しない日付ディレクトリを作成
 * 3. 各ディレクトリに初期index.jsonファイルを作成
 *
 * 使用方法:
 * $ bun run create:journal:dirs
 * $ bun run create:journal:dirs -- --help
 * $ bun run create:journal:dirs -- --force
 * $ bun run create:journal:dirs -- --verbose
 * $ bun run create:journal:dirs -- --end-date 2025-04-01
 *
 * オプション:
 * --help        このヘルプを表示
 * --force       すでに存在するディレクトリでもindex.jsonを再作成
 * --verbose     詳細なログを表示
 * --end-date    終了日を指定（YYYY-MM-DD形式、未来の日付も指定可能）
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { promisify } from 'node:util';
import matter from 'gray-matter';
import {
  getJSTDateString,
  getJSTDate,
  parseJSTDate,
  getDaysBetween,
} from './lib/date-utils.js';

// インターフェース定義
interface IndexData {
  date: string;
  entries: JournalEntry[];
  commits: CommitData[];
  [key: string]: unknown;
}

interface JournalEntry {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  [key: string]: unknown;
}

interface CommitData {
  message: string;
  sha: string;
  date: string;
  authorName: string;
  authorLogin: string | null;
  authorAvatar: string | null;
  commitUrl: string;
  repoName: string;
  repoOwner: string;
  repoUrl: string;
  additions?: number;
  deletions?: number;
}

// コマンドラインオプション定義
interface Options {
  force: boolean;
  verbose: boolean;
  help: boolean;
  endDate: string | null;
}

// 関数のPromise化
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);

/**
 * コマンドライン引数をパースする関数
 */
function parseCommandLineArgs(): Options {
  const args = process.argv.slice(2);
  const options: Options = {
    force: false,
    verbose: false,
    help: false,
    endDate: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--force') {
      options.force = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (arg === '--help') {
      options.help = true;
    } else if (arg === '--end-date' && i + 1 < args.length) {
      const dateStr = args[i + 1];
      // YYYY-MM-DD形式かどうかチェック
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        options.endDate = dateStr;
        i++; // 次の引数（日付）をスキップ
      } else {
        console.error(`無効な日付形式です: ${dateStr}`);
        console.error('日付はYYYY-MM-DD形式で指定してください');
        process.exit(1);
      }
    }
  }

  return options;
}

/**
 * 最新の日付ディレクトリを探す関数
 */
async function findLatestDateDir(journalsPath: string): Promise<string | null> {
  try {
    // journalsディレクトリが存在するか確認
    try {
      await access(journalsPath, fs.constants.F_OK);
    } catch (error) {
      console.error(`"${journalsPath}"ディレクトリが見つかりません。`);
      return null;
    }

    // journalsディレクトリ内のエントリを取得
    const entries = await readdir(journalsPath, { withFileTypes: true });

    // 日付形式のディレクトリを抽出
    const dateDirs = entries
      .filter(
        (entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(entry.name)
      )
      .map((entry) => entry.name);

    if (dateDirs.length === 0) {
      return null;
    }

    // 日付でソート（降順）
    dateDirs.sort().reverse();

    return dateDirs[0]; // 最新（一番大きい）日付を返す
  } catch (error) {
    console.error('最新の日付ディレクトリ検索中にエラーが発生しました:', error);
    return null;
  }
}

/**
 * 日付の範囲を作成する関数
 */
function createDateRange(
  startDateStr: string | null,
  endDateStr: string
): string[] {
  const result: string[] = [];

  // 開始日付がnullの場合は今日だけ返す
  if (!startDateStr) {
    return [endDateStr];
  }

  // 日付をJST基準で解析
  const startDate = parseJSTDate(startDateStr);
  const endDate = parseJSTDate(endDateStr);

  // 開始日付が存在する場合は、その翌日から今日までの範囲を生成
  startDate.setDate(startDate.getDate() + 1); // 翌日から開始

  // 開始日が終了日より後の場合は空配列を返す
  if (startDate > endDate) {
    return [];
  }

  // 日付の範囲を生成
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    result.push(`${year}-${month}-${day}`);

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

/**
 * 初期index.jsonを作成する関数
 */
async function createIndexJson(
  dirPath: string,
  dateStr: string,
  options: Options
): Promise<boolean> {
  const indexJsonPath = path.join(dirPath, 'index.json');

  // 強制作成フラグがない場合は既存のindex.jsonをスキップ
  if (!options.force) {
    try {
      await access(indexJsonPath, fs.constants.F_OK);
      if (options.verbose) {
        console.log(`  ${dateStr}: index.jsonが既に存在します`);
      }
      return false;
    } catch (error) {
      // ファイルが存在しない場合は続行
    }
  }

  // 基本的なindex.jsonデータを作成
  const indexData: IndexData = {
    date: dateStr,
    entries: [],
    commits: [],
  };

  // ファイルに書き込み
  await writeFile(indexJsonPath, JSON.stringify(indexData, null, 2));
  console.log(`  ${dateStr}: index.jsonを作成しました`);
  return true;
}

/**
 * ヘルプメッセージを表示
 */
function displayHelp(): void {
  console.log(`
日記ディレクトリの自動作成

説明:
  最新の日付ディレクトリから今日（または指定した終了日）までの範囲で、存在しない日付ディレクトリを自動的に作成します。
  各ディレクトリには空のindex.jsonファイルも作成されます。

使い方:
  bun run create:journal:dirs
  bun run create:journal:dirs -- --help
  bun run create:journal:dirs -- --force
  bun run create:journal:dirs -- --verbose
  bun run create:journal:dirs -- --end-date 2025-04-01

オプション:
  --help        このヘルプを表示
  --force       既存のindex.jsonを上書きして強制的に作成
  --verbose     詳細な情報を表示
  --end-date    終了日を指定（YYYY-MM-DD形式、未来の日付も指定可能）
`);
}

/**
 * メイン処理
 */
async function main(): Promise<void> {
  try {
    console.log('日記ディレクトリの自動作成を開始します...');

    // コマンドライン引数のパース
    const options = parseCommandLineArgs();

    // ヘルプを表示して終了
    if (options.help) {
      displayHelp();
      return;
    }

    // プロジェクトルートを取得
    const currentDir = process.cwd();
    const projectRoot =
      process.env.PROJECT_ROOT || '/Users/sugaiakimasa/apps/saedgewell';

    if (options.verbose) {
      console.log(`カレントディレクトリ: ${currentDir}`);
      console.log(`プロジェクトルート: ${projectRoot}`);
    }

    // journalsディレクトリのパス
    const journalsPath = path.join(projectRoot, '.docs', 'journals');
    if (options.verbose) {
      console.log(`Journalsパス: ${journalsPath}`);
    }

    // 最新の日付ディレクトリを取得
    const latestDateDir = await findLatestDateDir(journalsPath);
    if (options.verbose) {
      console.log(`最新の日付ディレクトリ: ${latestDateDir || 'なし'}`);
    }

    // 今日の日付または指定された終了日を取得（日本標準時）
    const endDateStr = options.endDate || getJSTDateString();

    if (options.verbose) {
      console.log(`終了日: ${endDateStr}`);
    }

    // 日付の範囲を作成
    const dateRange = createDateRange(latestDateDir, endDateStr);
    if (options.verbose || dateRange.length > 0) {
      console.log(
        `作成対象の日付: ${dateRange.length > 0 ? dateRange.join(', ') : 'なし'}`
      );
    }

    // 新規作成したディレクトリ数
    let createdDirCount = 0;
    let createdJsonCount = 0;

    // 各日付について処理
    for (const dateStr of dateRange) {
      const dateDirPath = path.join(journalsPath, dateStr);

      // ディレクトリの作成
      try {
        await access(dateDirPath, fs.constants.F_OK);
        if (options.verbose) {
          console.log(`  ${dateStr}: ディレクトリが既に存在します`);
        }
      } catch (error) {
        // ディレクトリが存在しない場合は作成
        await mkdir(dateDirPath);
        console.log(`  ${dateStr}: ディレクトリを作成しました`);
        createdDirCount++;
      }

      // index.jsonの作成
      const created = await createIndexJson(dateDirPath, dateStr, options);
      if (created) {
        createdJsonCount++;
      }
    }

    // 処理の結果を表示
    console.log('\n処理結果サマリー:');
    console.log(`- 作成した日付ディレクトリ: ${createdDirCount}個`);
    console.log(`- 作成したindex.jsonファイル: ${createdJsonCount}個`);
    console.log(`- 対象日付範囲: ${dateRange.length}個`);

    if (dateRange.length === 0) {
      console.log('\n注: 新規作成対象の日付が見つかりませんでした');
      if (latestDateDir && !options.endDate) {
        console.log(
          `最新の日付ディレクトリ(${latestDateDir})は既に今日の日付以降です`
        );
      } else if (latestDateDir && options.endDate) {
        console.log(
          `最新の日付ディレクトリ(${latestDateDir})は既に指定された終了日(${options.endDate})以降です`
        );
      }
    }

    console.log('\n処理が完了しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

// メイン処理の実行
main();
