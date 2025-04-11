#!/usr/bin/env ts-node

/**
 * このスクリプトは以下の機能を実行します:
 * 1. Journalsカテゴリのディレクトリを検索
 * 2. 各日付ディレクトリにあるindex.jsonファイルを読み込む
 * 3. 各ファイル内のコミット情報に重複がないかチェック
 * 4. 重複が見つかった場合は報告、オプションで自動修正
 *
 * 使用方法:
 * $ bun run find:duplicate:commits
 *
 * オプション:
 * --fix                重複を自動的に修正
 * --verbose           詳細なログを表示
 * --help, -h          このヘルプを表示
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { promisify } from 'node:util';

// インターフェース定義
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

interface IndexData {
  title?: string;
  description?: string;
  date?: string;
  entries?: JournalEntry[];
  commits?: CommitData[];
  [key: string]: unknown;
}

interface JournalEntry {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  [key: string]: unknown;
}

// オプション定義
interface Options {
  fix: boolean;
  verbose: boolean;
  help: boolean;
}

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// コマンドライン引数のパース
function parseCommandLineArgs(): Options {
  const args = process.argv.slice(2);
  const options: Options = {
    fix: false,
    verbose: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--fix') {
      options.fix = true;
    } else if (args[i] === '--verbose') {
      options.verbose = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      options.help = true;
    }
  }

  return options;
}

// ヘルプメッセージを表示する関数
function displayHelp(): void {
  console.log(`
重複するコミット情報を検索するスクリプト

使用方法:
  bun run find:duplicate:commits [オプション]

オプション:
  --fix                重複を自動的に修正
  --verbose           詳細なログを表示
  --help, -h          このヘルプを表示

例:
  # 重複を検索
  bun run find:duplicate:commits

  # 重複を検索し、自動修正
  bun run find:duplicate:commits --fix

  # 詳細なログを表示
  bun run find:duplicate:commits --verbose
`);
}

// オプションをパース
const options = parseCommandLineArgs();
const { fix, verbose, help } = options;

// ヘルプオプションが指定されていれば表示して終了
if (help) {
  displayHelp();
  process.exit(0);
}

// コンテンツディレクトリを再帰的に探索する関数
async function findJournalDirs(dir: string): Promise<string[]> {
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
        const subDirs = await findJournalDirs(entryPath);
        dateDirs.push(...subDirs);
      }
    }
  }

  return dateDirs;
}

// 重複コミットを検出する関数
function findDuplicateCommits(commits: CommitData[]): {
  duplicates: CommitData[];
  unique: CommitData[];
} {
  const shaMap = new Map<string, CommitData[]>();
  const duplicates: CommitData[] = [];

  // SHAごとにコミットをグループ化
  for (const commit of commits) {
    if (!shaMap.has(commit.sha)) {
      shaMap.set(commit.sha, []);
    }
    const commitList = shaMap.get(commit.sha);
    if (commitList) {
      commitList.push(commit);
    }
  }

  // 重複しているコミットを抽出
  for (const [sha, shaCommits] of shaMap.entries()) {
    if (shaCommits.length > 1) {
      // 2つ目以降のコミットを重複として追加
      duplicates.push(...shaCommits.slice(1));
    }
  }

  // 重複を排除した一意のコミットリストを作成
  const unique: CommitData[] = [];
  const uniqueShas = new Set<string>();

  for (const commit of commits) {
    if (!uniqueShas.has(commit.sha)) {
      uniqueShas.add(commit.sha);
      unique.push(commit);
    }
  }

  return { duplicates, unique };
}

// メイン処理
async function main(): Promise<void> {
  try {
    console.log('環境情報:');
    console.log(`- 自動修正: ${fix ? 'はい' : 'いいえ'}`);
    console.log(`- 詳細ログ: ${verbose ? 'はい' : 'いいえ'}`);

    // プロジェクトルートを決定
    const projectRoot =
      process.env.DOCKER_DEBUG === 'true'
        ? '/app'
        : '/Users/sugaiakimasa/apps/saedgewell';

    const journalsPath = path.join(projectRoot, '.docs', 'journals');

    // パス確認のログ
    if (verbose) {
      console.log(`検索パス: ${journalsPath}`);
    }

    // 日付ディレクトリを探索
    console.log('日付ディレクトリを探索中...');
    const dateDirs = await findJournalDirs(journalsPath);
    console.log(`${dateDirs.length}個の日付ディレクトリを発見しました。`);

    // 統計情報
    let processedCount = 0;
    let errorCount = 0;
    let filesWithDuplicates = 0;
    let totalDuplicatesFound = 0;
    let totalDuplicatesFixed = 0;

    // 各日付ディレクトリを処理
    for (const dateDir of dateDirs) {
      const dirName = path.basename(dateDir);
      const indexPath = path.join(dateDir, 'index.json');

      try {
        processedCount++;

        // ファイルの存在確認
        if (!fs.existsSync(indexPath)) {
          if (verbose) {
            console.log(
              `${dirName}: index.jsonが見つかりません。スキップします。`
            );
          }
          continue;
        }

        // index.jsonを読み込み
        const indexContent = await readFile(indexPath, 'utf8');
        const indexData = JSON.parse(indexContent) as IndexData;

        // コミット情報がない場合はスキップ
        if (!indexData.commits || indexData.commits.length === 0) {
          if (verbose) {
            console.log(
              `${dirName}: コミット情報がありません。スキップします。`
            );
          }
          continue;
        }

        // 重複コミットを検出
        const { duplicates, unique } = findDuplicateCommits(indexData.commits);

        // 重複がない場合
        if (duplicates.length === 0) {
          if (verbose) {
            console.log(`${dirName}: 重複するコミット情報はありません。`);
          }
          continue;
        }

        // 重複があった場合
        filesWithDuplicates++;
        totalDuplicatesFound += duplicates.length;

        console.log(
          `${dirName}: ${duplicates.length}件の重複コミットを発見しました。`
        );

        if (verbose) {
          // 重複コミットの詳細を表示
          for (const duplicate of duplicates) {
            console.log(`  SHA: ${duplicate.sha}`);
            console.log(`  メッセージ: ${duplicate.message}`);
            console.log(`  著者: ${duplicate.authorName}`);
            console.log(
              `  リポジトリ: ${duplicate.repoOwner}/${duplicate.repoName}`
            );
            console.log(`  日時: ${duplicate.date}`);
            console.log('  ---');
          }
        }

        // 自動修正オプションが有効な場合
        if (fix) {
          // 重複を排除して更新
          indexData.commits = unique;

          // 更新されたデータを書き込み
          await writeFile(indexPath, JSON.stringify(indexData, null, 2));

          console.log(
            `${dirName}: 重複を修正しました。${unique.length}件のユニークなコミットを保持しました。`
          );
          totalDuplicatesFixed += duplicates.length;
        }
      } catch (error) {
        console.error(
          `${dirName}: 処理中にエラーが発生しました:`,
          error instanceof Error ? error.message : error
        );
        errorCount++;
      }
    }

    // 処理結果のサマリーを表示
    console.log('\n処理結果サマリー:');
    console.log(`- 発見した日付ディレクトリ: ${dateDirs.length}個`);
    console.log(`- 処理したディレクトリ: ${processedCount}個`);
    console.log(`- 重複があったファイル: ${filesWithDuplicates}個`);
    console.log(`- 発見した重複コミット: ${totalDuplicatesFound}件`);

    if (fix) {
      console.log(`- 修正した重複コミット: ${totalDuplicatesFixed}件`);
    } else if (totalDuplicatesFound > 0) {
      console.log('重複を修正するには --fix オプションを使用してください。');
    }

    console.log(`- エラーが発生したディレクトリ: ${errorCount}個`);
    console.log('処理が完了しました。');
  } catch (error) {
    console.error(
      'エラーが発生しました:',
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

main();
