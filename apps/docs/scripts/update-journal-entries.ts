#!/usr/bin/env tsx

/**
 * このスクリプトは以下の機能を実行します:
 * 1. .docs/journalsカテゴリの日付ディレクトリを検索
 * 2. 各日付ディレクトリ内のMDXファイルのフロントマター情報を抽出
 * 3. その情報からindex.jsonのentriesセクションを作成または更新
 *
 * 使用方法:
 * $ npx tsx scripts/update-journal-entries.ts [--dir <日付ディレクトリ>] [--force]
 *
 * オプション:
 * --dir <YYYY-MM-DD>: 特定の日付ディレクトリのみを処理
 * --force: 更新タイムスタンプに関わらず強制的に更新
 *
 * 例: $ npx tsx scripts/update-journal-entries.ts --dir 2025-03-21
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { promisify } from 'node:util';
import matter from 'gray-matter';

// インターフェース定義
interface IndexData {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  commits?: CommitData[];
  entries?: JournalEntry[];
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

interface JournalEntry {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  [key: string]: unknown;
}

interface MDXFrontmatter {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  tags?: string[] | Record<string, string[]>;
  [key: string]: unknown;
}

interface DirProcessResult {
  processed: boolean;
  entriesCount: number;
  reason?: string;
}

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// コマンドライン引数のパース
const args = process.argv.slice(2);
let targetDateDir = '';
let forceUpdate = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir' && i + 1 < args.length) {
    targetDateDir = args[i + 1];
    i++;
  } else if (args[i] === '--force') {
    forceUpdate = true;
  }
}

// コンテンツディレクトリを再帰的に探索する関数
async function findJournalDirs(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir);
    const dateDirs: string[] = [];

    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      const entryStat = await stat(entryPath);

      if (entryStat.isDirectory()) {
        // 日付形式のディレクトリかチェック (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(entry)) {
          // 特定のディレクトリが指定されている場合はそれだけを処理
          if (!targetDateDir || entry === targetDateDir) {
            dateDirs.push(entryPath);
          }
        } else {
          // 再帰的に検索
          const subDirs = await findJournalDirs(entryPath);
          dateDirs.push(...subDirs);
        }
      }
    }

    return dateDirs;
  } catch (error) {
    console.error('ディレクトリ探索中にエラーが発生しました:', error);
    return [];
  }
}

// MDXファイルのフロントマターを抽出する関数
async function extractFrontmatter(
  filePath: string
): Promise<MDXFrontmatter | null> {
  try {
    const content = await readFile(filePath, 'utf8');
    const { data } = matter(content);
    return data as MDXFrontmatter;
  } catch (error) {
    console.error(
      `${filePath}のフロントマター抽出中にエラーが発生しました:`,
      error
    );
    return null;
  }
}

// MDXファイルからタグを正規化する関数
function normalizeEntryTags(
  tags: string[] | Record<string, string[]> | undefined
): string[] {
  if (!tags) return [];

  if (Array.isArray(tags)) {
    return tags;
  }

  // オブジェクト形式のタグを配列に変換
  if (typeof tags === 'object') {
    const normalizedTags: string[] = [];
    for (const category in tags) {
      if (Array.isArray(tags[category])) {
        normalizedTags.push(...tags[category]);
      }
    }
    return normalizedTags;
  }

  return [];
}

// index.jsonからファイル名を生成する関数
function getIdFromFilename(filename: string): string {
  return path.basename(filename, '.mdx');
}

// ディレクトリ内のファイルが変更されているか確認する関数
async function hasChanges(
  dirPath: string,
  indexJsonPath: string
): Promise<boolean> {
  try {
    // index.jsonが存在しない場合は変更ありとみなす
    if (!fs.existsSync(indexJsonPath)) {
      return true;
    }

    // index.jsonの最終更新時間を取得
    const indexJsonStat = await stat(indexJsonPath);
    const indexJsonMtime = indexJsonStat.mtime.getTime();

    // ディレクトリ内のすべてのMDXファイルを取得
    const dirEntries = await readdir(dirPath);
    const mdxFiles = dirEntries.filter((file) => file.endsWith('.mdx'));

    // MDXファイルがない場合も更新の必要なし
    if (mdxFiles.length === 0) {
      return false;
    }

    // 各MDXファイルの最終更新時間を確認
    for (const mdxFile of mdxFiles) {
      const mdxPath = path.join(dirPath, mdxFile);
      const mdxStat = await stat(mdxPath);

      // MDXファイルがindex.jsonより新しい場合は変更あり
      if (mdxStat.mtime.getTime() > indexJsonMtime) {
        return true;
      }
    }

    // 新しいMDXファイルがない場合も、index.jsonのentriesをチェック
    // index.jsonにentriesがない場合や、MDXファイル数と不一致の場合は更新が必要
    try {
      const indexContent = await readFile(indexJsonPath, 'utf8');
      const indexData = JSON.parse(indexContent) as IndexData;

      if (
        !indexData.entries ||
        !Array.isArray(indexData.entries) ||
        indexData.entries.length !== mdxFiles.length
      ) {
        return true;
      }
    } catch (error) {
      // index.jsonの読み込みに失敗した場合は更新が必要
      return true;
    }

    // 変更なし
    return false;
  } catch (error) {
    console.error(`${dirPath}の変更確認中にエラーが発生しました:`, error);
    // エラーの場合は安全のため変更ありとみなす
    return true;
  }
}

// 特定ディレクトリの処理を行う関数
async function processDirectory(dirPath: string): Promise<DirProcessResult> {
  const dirName = path.basename(dirPath);
  const indexJsonPath = path.join(dirPath, 'index.json');

  try {
    // 強制更新フラグがない場合は変更チェックを行う
    if (!forceUpdate) {
      const needsUpdate = await hasChanges(dirPath, indexJsonPath);
      if (!needsUpdate) {
        return {
          processed: false,
          entriesCount: 0,
          reason: '変更なし',
        };
      }
    }

    // MDXファイルを取得
    const dirEntries = await readdir(dirPath);
    const mdxFiles = dirEntries.filter((file) => file.endsWith('.mdx'));

    if (mdxFiles.length === 0) {
      return {
        processed: false,
        entriesCount: 0,
        reason: 'MDXファイルなし',
      };
    }

    // index.jsonの読み込み
    let indexData: IndexData = {};
    try {
      if (fs.existsSync(indexJsonPath)) {
        const jsonContent = await readFile(indexJsonPath, 'utf8');
        indexData = JSON.parse(jsonContent);
      } else {
        // デフォルト値を設定
        indexData = {
          title: `${dirName}の作業記録`,
          description: `${dirName}の活動記録`,
          date: dirName,
          entries: [],
        };
      }
    } catch (error) {
      console.error(
        `  ${dirName}: index.jsonの読み込み中にエラーが発生しました:`,
        error
      );
      // デフォルト値を設定
      indexData = {
        title: `${dirName}の作業記録`,
        description: `${dirName}の活動記録`,
        date: dirName,
        entries: [],
      };
    }

    // 既存のエントリを保持するための辞書を作成
    const existingEntries: Record<string, JournalEntry> = {};
    if (indexData.entries && Array.isArray(indexData.entries)) {
      for (const entry of indexData.entries) {
        if (entry.id) {
          existingEntries[entry.id] = entry;
        }
      }
    }

    // 各MDXファイルからフロントマターを抽出
    const newEntries: JournalEntry[] = [];
    for (const mdxFile of mdxFiles) {
      const filePath = path.join(dirPath, mdxFile);
      const entryId = getIdFromFilename(mdxFile);

      // フロントマターを抽出
      const frontmatter = await extractFrontmatter(filePath);
      if (!frontmatter) {
        console.log(`  ${mdxFile}: フロントマターが抽出できませんでした`);
        continue;
      }

      // 既存のエントリがあれば、それを更新
      const existingEntry = existingEntries[entryId];

      // 新しいエントリを作成
      const newEntry: JournalEntry = {
        id: entryId,
        title: frontmatter.title || entryId.replace(/-/g, ' '),
        description: frontmatter.description || '',
        tags: normalizeEntryTags(frontmatter.tags),
      };

      // 既存のエントリがあれば、必要な情報を保持
      if (existingEntry) {
        // タイトルと説明が新しいエントリで空の場合は既存値を使用
        if (!newEntry.title) newEntry.title = existingEntry.title;
        if (!newEntry.description)
          newEntry.description = existingEntry.description;

        // タグをマージ
        if (existingEntry.tags && Array.isArray(existingEntry.tags)) {
          const existingTags = new Set(existingEntry.tags);
          if (newEntry.tags) {
            for (const tag of newEntry.tags) {
              existingTags.add(tag);
            }
          }
          newEntry.tags = Array.from(existingTags);
        }
      }

      newEntries.push(newEntry);
      console.log(`  ${mdxFile}: エントリを追加しました`);
    }

    // エントリを更新
    indexData.entries = newEntries;

    // index.jsonを書き込み
    await writeFile(indexJsonPath, JSON.stringify(indexData, null, 2));
    console.log(
      `  ${dirName}: index.jsonを更新しました (${newEntries.length}件のエントリ)`
    );

    return {
      processed: true,
      entriesCount: newEntries.length,
    };
  } catch (error) {
    console.error(`  ${dirName}の処理中にエラーが発生しました:`, error);
    return {
      processed: false,
      entriesCount: 0,
      reason: '処理エラー',
    };
  }
}

// メイン処理
async function main(): Promise<void> {
  try {
    console.log(
      'MDXファイルのフロントマターからindex.jsonのエントリを更新します...'
    );

    // カレントディレクトリまたは環境変数からプロジェクトルートを取得
    const currentDir = process.cwd();
    // プロジェクトルートを固定パスとして設定
    const projectRoot =
      process.env.PROJECT_ROOT || '/Users/sugaiakimasa/apps/saedgewell';

    console.log(`カレントディレクトリ: ${currentDir}`);
    console.log(`プロジェクトルート: ${projectRoot}`);

    const journalsPath = path.join(projectRoot, '.docs', 'journals');
    console.log(`Journalsパス: ${journalsPath}`);

    // 日付ディレクトリを探索
    const dateDirs = await findJournalDirs(journalsPath);
    console.log(`${dateDirs.length}個の日付ディレクトリを検出しました`);

    // 処理結果の統計
    let processed = 0;
    let skipped = 0;
    let totalEntries = 0;
    const skippedDirs: { dir: string; reason: string }[] = [];

    // 各日付ディレクトリを処理
    for (const dateDir of dateDirs) {
      const dirName = path.basename(dateDir);
      console.log(`処理中: ${dirName}`);

      // ディレクトリを処理
      const result = await processDirectory(dateDir);

      if (result.processed) {
        processed++;
        totalEntries += result.entriesCount;
      } else {
        skipped++;
        if (result.reason) {
          skippedDirs.push({ dir: dirName, reason: result.reason });
          console.log(`  ${dirName}: スキップ (${result.reason})`);
        }
      }
    }

    // 結果サマリー
    console.log('\n処理結果サマリー:');
    console.log(`- 処理したディレクトリ: ${processed}個`);
    console.log(`- スキップしたディレクトリ: ${skipped}個`);
    console.log(`- 更新されたエントリ数: ${totalEntries}件`);

    if (skippedDirs.length > 0) {
      console.log('\nスキップしたディレクトリ:');
      for (const dir of skippedDirs) {
        console.log(`- ${dir.dir}: ${dir.reason}`);
      }
    }

    console.log('\n処理が完了しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
