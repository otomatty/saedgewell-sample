#!/usr/bin/env bun

/**
 * AIによるタイトル生成機能を備えたジャーナルエントリー作成スクリプト
 *
 * 使い方:
 *   bun run create:journal:entry [options]
 *
 * オプション:
 *   --content <text>   エントリーの内容（テキスト）
 *   --content-file <file>  エントリーの内容（ファイルから読み込み）
 *   --date <YYYY-MM-DD>   日付（デフォルト: 今日）
 *   --debug             デバッグモード
 *   --help, -h          ヘルプを表示
 *
 * 例:
 *   bun run create:journal:entry --content "今日は素晴らしい一日でした。..."
 *   bun run create:journal:entry --content-file content.txt --date 2023-12-15
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';
import { promisify } from 'node:util';

// 自作ライブラリをインポート
import AIService, {
  type TitleCandidate,
  type AIResponse,
} from './lib/ai-service.js';
import fileGenerator from './lib/file-generator.js';
import { getJSTDateString } from './lib/date-utils.js';

// __dirname の定義（ESM環境用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// インターフェース
interface Options {
  content?: string;
  contentFile?: string;
  date?: string;
  debug?: boolean;
  help?: boolean;
}

// readlineインターフェースの生成関数
function createReadlineInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

// Promisify readline.question
const question = (rl: readline.Interface, query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};

// 非同期readFileの作成
const readFileAsync = promisify(fs.readFile);

/**
 * コマンドライン引数を解析する
 */
function parseCommandLineArgs(): Options {
  const args = process.argv.slice(2);
  const options: Options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--content' && i + 1 < args.length) {
      options.content = args[++i];
    } else if (arg === '--content-file' && i + 1 < args.length) {
      options.contentFile = args[++i];
    } else if (arg === '--date' && i + 1 < args.length) {
      options.date = args[++i];
    } else if (arg === '--debug') {
      options.debug = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  }

  return options;
}

/**
 * ヘルプメッセージを表示する
 */
function showHelp(): void {
  console.log(`
AIによるタイトル生成機能を備えたジャーナルエントリー作成スクリプト

使い方:
  bun run create:journal:entry [options]

オプション:
  --content <text>     エントリーの内容（テキスト）
  --content-file <file>  エントリーの内容（ファイルから読み込み）
  --date <YYYY-MM-DD>   日付（デフォルト: 今日）
  --debug             デバッグモード
  --help, -h          ヘルプを表示

例:
  bun run create:journal:entry --content "今日は素晴らしい一日でした。..."
  bun run create:journal:entry --content-file content.txt --date 2023-12-15
  `);
}

/**
 * コンテンツの取得
 */
async function getContent(options: Options): Promise<string> {
  if (options.content) {
    return options.content;
  }

  if (options.contentFile) {
    try {
      const content = await readFileAsync(options.contentFile, 'utf8');
      return content;
    } catch (error) {
      console.error(`ファイルの読み込みに失敗しました: ${error}`);
      throw error;
    }
  }

  // コンテンツが指定されていない場合は入力を促す
  console.log(
    'エントリーの内容を入力してください。入力を終了するには、新しい行で Ctrl+D (Unix) または Ctrl+Z (Windows) を押してください:'
  );

  // 新しいrlインスタンスを作成
  const rl = createReadlineInterface();
  let content = '';

  for await (const line of rl) {
    content += `${line}\n`;
  }

  // 入力が終了したらrlを閉じる
  rl.close();

  return content.trim();
}

/**
 * タイトル候補の選択
 */
async function selectTitle(
  titleCandidates: TitleCandidate[]
): Promise<TitleCandidate> {
  console.log('\nAIが生成したタイトル候補:');

  titleCandidates.forEach((candidate, index) => {
    console.log(`${index + 1}: ${candidate.title}`);
    console.log(`   スラッグ: ${candidate.slug}`);
    console.log(`   タグ: ${candidate.tags.join(', ')}`);
    console.log();
  });

  // 新しいrlインスタンスを作成
  const rl = createReadlineInterface();

  // 選択肢の入力
  let selectedIndex: number;

  while (true) {
    const answer = await question(
      rl,
      `使用したいタイトルの番号を選択してください (1-${titleCandidates.length}): `
    );
    selectedIndex = Number.parseInt(answer, 10) - 1;

    if (selectedIndex >= 0 && selectedIndex < titleCandidates.length) {
      break;
    }

    console.log(
      `無効な選択です。1から${titleCandidates.length}の間の番号を入力してください。`
    );
  }

  // 使用後に閉じる
  rl.close();

  return titleCandidates[selectedIndex];
}

/**
 * メイン関数
 */
async function main(): Promise<void> {
  try {
    // コマンドライン引数の解析
    const options = parseCommandLineArgs();

    // ヘルプが要求された場合
    if (options.help) {
      showHelp();
      process.exit(0);
    }

    // コンテンツの取得
    const content = await getContent(options);

    if (!content || content.trim().length === 0) {
      console.error(
        'エラー: コンテンツが空です。--content または --content-file オプションを使用して内容を提供してください。'
      );
      process.exit(1);
    }

    if (options.debug) {
      console.log('=== デバッグモード ===');
      console.log('オプション:', options);
      console.log('コンテンツ:', content);
    }

    // デフォルトの日付（今日）
    const date = options.date || getJSTDateString();

    console.log('AIによるタイトル生成を開始します...');

    // AIにタイトル候補を生成させる
    const response: AIResponse =
      await AIService.generateTitleCandidates(content);

    if (!response.candidates || response.candidates.length === 0) {
      console.error('エラー: タイトル候補の生成に失敗しました。');
      process.exit(1);
    }

    // ユーザーにタイトルを選択させる
    const selectedTitle = await selectTitle(response.candidates);

    console.log(`選択されたタイトル: ${selectedTitle.title}`);

    // MDXファイルを生成
    const filePath = await fileGenerator.generateMdxFile(
      date,
      selectedTitle,
      content
    );

    console.log(`ジャーナルエントリーを作成しました: ${filePath}`);

    // ファイルをVSCodeで開く
    await fileGenerator.openFileInVSCode(filePath);

    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

// メイン関数の実行
main();
